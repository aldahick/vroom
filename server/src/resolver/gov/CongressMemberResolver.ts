import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { CongressMember, CongressParty } from "../../collection/CongressMember";
import { QueryCongressMembersArgs } from "../../generated/graphql";
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
    @gql.Args() { query: searchTerm, limit, offset }: QueryCongressMembersArgs
  ): Promise<{
    total: number;
    members: CongressMember[];
  }> {
    let query = this.db.congressMembers.find().sort({
      "name.last": 1
    });
    if (searchTerm) {
      query = query.filter(this.getFilterQuery(searchTerm));
    }
    // no reason to have limit without offset
    if (offset !== undefined && limit) {
      query = query.skip(offset).limit(limit);
    }
    const total = await query.clone().count(false);
    return {
      total,
      members: await query.toArray()
    };
  }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("reloadCongressMembers")
  async reloadCongressMembers(): Promise<boolean> {
    const rawMembers = await this.congressMemberService.getMembers();
    const members: CongressMember[] = rawMembers.map(m => ({
      _id: m.id.bioguide,
      name: {
        first: m.name.first,
        last: m.name.last,
        full: m.name.official_full
      },
      birthday: new Date(m.bio.birthday),
      gender: m.bio.gender,
      terms: m.terms.map(t => ({
        type: t.type,
        state: t.state,
        party: t.party,
        start: new Date(t.start),
        end: new Date(t.end),
        district: t.district,
        url: t.url
      }))
    }));
    await this.db.congressMembers.deleteMany({});
    await this.db.congressMembers.insertMany(members);
    return true;
  }

  private getFilterQuery(searchTerm: string) {
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
