import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { MutationReloadCampaignsArgs } from "../../generated/graphql";
import { AuthBearerGuard } from "../../lib/AuthBearerGuard";
import { CampaignService, MongoService } from "../../service";

@gql.Resolver("Campaign")
export class CampaignResolver {
  constructor(
    private campaignService: CampaignService,
    private db: MongoService
  ) { }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("reloadCampaigns")
  async reloadCampaigns(@gql.Args() { year }: MutationReloadCampaignsArgs): Promise<boolean> {
    let campaigns = await this.campaignService.getForYear(year);
    await this.db.campaigns.deleteMany({ year });
    await this.db.campaigns.insertMany(campaigns);

    // assign CongressMember.terms.campaignId
    await Promise.all(campaigns.map(async campaign => {
      const member = await this.db.congressMembers.findOne({
        "externalIds.fec": campaign.candidate.id
      });
      if (!member) return;
      const termIndex = member.terms.findIndex(t => (t.start.getFullYear() - 1) === campaign.year);
      if (termIndex === -1) return;
      await this.db.congressMembers.updateOne({ _id: member._id }, {
        $set: {
          [`terms.${termIndex}.campaignId`]: campaign._id
        }
      });
    }));

    campaigns = await this.db.campaigns.find().toArray();
    // recalculate averageCampaignContributions (using all campaigns, not just the specified year's)
    await Promise.all((await this.db.congressMembers.find().toArray()).map(async member => {
      const campaignIds = _.compact(member.terms.map(c => c.campaignId));
      const memberCampaigns = campaigns.filter(c => campaignIds.some(i => i.equals(c._id)));
      if (memberCampaigns.length === 0) return;
      const averageCampaignContributions = _.sumBy(memberCampaigns, c => c.contributions.total) / memberCampaigns.length;
      await this.db.congressMembers.updateOne({ _id: member._id }, {
        $set: { averageCampaignContributions }
      });
    }));
    return true;
  }
}
