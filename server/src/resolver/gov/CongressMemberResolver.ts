import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { CongressMember, CongressParty } from "../../collection/CongressMember";
import { CongressMemberSortType, QueryCongressMembersArgs } from "../../generated/graphql";
import { AuthBearerGuard } from "../../lib/AuthBearerGuard";
import { app } from "../../main";
import { CongressMemberService, MongoService, StateNameService } from "../../service";
import { CongressMemberTermResolver } from "./CongressMemberTermResolver";

@gql.Resolver("CongressMember")
export class CongressMemberResolver {
  constructor(
    private congressMemberService: CongressMemberService,
    private db: MongoService,
    private stateNameService: StateNameService
  ) { }

  @gql.ResolveProperty("party")
  party(@gql.Root() member: CongressMember): string {
    const termResolver = app.get(CongressMemberTermResolver);
    return termResolver.party(member.terms.slice(-1)[0]);
  }

  @gql.ResolveProperty("state")
  state(@gql.Root() member: CongressMember): string {
    return member.terms.slice(-1)[0].state;
  }

  @gql.ResolveProperty("type")
  type(@gql.Root() member: CongressMember): string {
    const termResolver = app.get(CongressMemberTermResolver);
    return termResolver.type(member.terms.slice(-1)[0]);
  }

  @UseGuards(AuthBearerGuard)
  @gql.Query("congressMembers")
  async congressMembers(
    @gql.Args() {
      query: searchTerm,
      limit, offset,
      sortBy
    }: QueryCongressMembersArgs
  ): Promise<{
    total: number;
    members: CongressMember[];
  }> {
    const aggregateSteps: any[] = [];
    if (sortBy && sortBy !== CongressMemberSortType.LastName) {
      if ([CongressMemberSortType.AverageContributionsAsc, CongressMemberSortType.AverageContributionsDesc].includes(sortBy)) {
        aggregateSteps.push({
          $match: {
            "averageCampaignContributions": { $exists: true }
          }
        }, {
          $sort: {
            "averageCampaignContributions": sortBy === CongressMemberSortType.AverageContributionsAsc ? 1 : -1
          }
        });
      }
    } else {
      aggregateSteps.push({
        $sort: { "name.last": 1 }
      });
    }
    if (searchTerm) {
      aggregateSteps.push({
        $match: this.getFilterStep(searchTerm)
      });
    }
    const countRow = (await this.db.congressMembers.aggregate< { total: number }>([
      ...aggregateSteps,
      { $count: "total" }
    ]).toArray())[0];
    if (!countRow) return { total: 0, members: [] };
    if (offset !== undefined && limit) {
      aggregateSteps.push({
        $skip: offset
      }, {
        $limit: limit
      });
    }
    return {
      total: countRow.total,
      members: await this.db.congressMembers.aggregate(aggregateSteps).toArray()
    };
  }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("reloadCongressMembers")
  async reloadCongressMembers(): Promise<boolean> {
    const members = await this.congressMemberService.getMembers();
    await this.db.congressMembers.deleteMany({});
    await this.db.congressMembers.insertMany(members);
    return true;
  }

  private getFilterStep(searchTerm: string) {
    const partyNames = Object.values(CongressParty).map(s => s.toLowerCase());
    if (partyNames.includes(searchTerm.toLowerCase())) {
      return {
        "terms.party": _.startCase(searchTerm)
      };
    } else if (searchTerm.toLowerCase() === "house") {
      return {
        "terms.type": "rep"
      };
    } else if (searchTerm.toLowerCase() === "senate") {
      return {
        "terms.type": "sen"
      };
    } else {
      const stateId = this.stateNameService.getIdFromName(searchTerm.toLowerCase());
      if (stateId) {
        return {
          "terms.state": stateId
        };
      } else {
        return {
          "name.full": new RegExp(searchTerm, "i")
        };
      }
    }
  }
}
