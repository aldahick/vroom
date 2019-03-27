import * as gql from "@nestjs/graphql";
import { CongressMemberTerm, CongressMemberTermType } from "../../collection/CongressMember";

@gql.Resolver("CongressMemberTerm")
export class CongressMemberTermResolver {
  @gql.ResolveProperty("party")
  party(@gql.Root() term: CongressMemberTerm): string {
    return term.party.toUpperCase();
  }

  @gql.ResolveProperty("type")
  type(@gql.Root() term: CongressMemberTerm): string {
    return term.type === CongressMemberTermType.House ? "HOUSE" : "SENATE";
  }
}
