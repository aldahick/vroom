import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { CongressMember } from "../../collection/CongressMember";
import { AuthBearerGuard } from "../../lib/AuthBearerGuard";
import { app } from "../../main";
import { CongressMemberService, MongoService } from "../../service";
import { CongressMemberTermResolver } from "./CongressMemberTermResolver";

@gql.Resolver("CongressMember")
export class CongressMemberResolver {
  constructor(
    private congressMemberService: CongressMemberService,
    private db: MongoService
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
  async congressMembers(): Promise<CongressMember[]> {
    return this.db.congressMembers.find().toArray();
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
}
