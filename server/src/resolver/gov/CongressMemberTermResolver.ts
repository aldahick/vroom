import * as gql from "@nestjs/graphql";
import { Campaign } from "../../collection/Campaign";
import { CongressMemberTerm, CongressMemberTermType } from "../../collection/CongressMember";
import { MongoService } from "../../service";

@gql.Resolver("CongressMemberTerm")
export class CongressMemberTermResolver {
  constructor(
    private db: MongoService
  ) { }

  @gql.ResolveProperty("campaign")
  async campaign(@gql.Root() term: CongressMemberTerm): Promise<Campaign | undefined | null> {
    if (!term.campaignId) return;
    return this.db.campaigns.findOne({ _id: term.campaignId });
  }

  @gql.ResolveProperty("party")
  party(@gql.Root() term: CongressMemberTerm): string {
    return term.party.toUpperCase();
  }

  @gql.ResolveProperty("type")
  type(@gql.Root() term: CongressMemberTerm): string {
    return term.type === CongressMemberTermType.House ? "HOUSE" : "SENATE";
  }

}
