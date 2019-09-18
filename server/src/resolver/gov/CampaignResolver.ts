import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { MutationReloadCampaignsArgs } from "../../generated/graphql";
import { AuthBearerGuard } from "../../lib/AuthBearerGuard";
import { RequestContext } from "../../lib/RequestContext";
import { CampaignService, LoggingService, MongoService } from "../../service";

@gql.Resolver("Campaign")
export class CampaignResolver {
  constructor(
    private campaignService: CampaignService,
    private db: MongoService,
    private logger: LoggingService
  ) { }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("reloadCampaigns")
  async reloadCampaigns(
    @gql.Context() context: RequestContext,
    @gql.Args() { year }: MutationReloadCampaignsArgs
  ): Promise<boolean> {
    this.logger.log(`reloadCampaigns.start ${context.userId ? (await context.user())!.username : "system"}`);
    let campaigns = await this.campaignService.getForYear(year);
    this.logger.log(`reloadCampaigns.fetch ${campaigns.length}`);
    await this.db.campaigns.deleteMany({ year });
    await this.db.campaigns.insertMany(campaigns);
    this.logger.log(`reloadCampaigns.db`);

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
    this.logger.log(`reloadCampaigns.congressMember.campaignId`);

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
    this.logger.log(`reloadCampaigns.congressMember.averageCampaignContributions`);
    return true;
  }
}
