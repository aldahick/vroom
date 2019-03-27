import gql from "graphql-tag";
import { CongressMember } from "./types/CongressMember";

export const GET_CONGRESS_MEMBERS = gql`
query GetCongressMembersWeb {
  congressMembers {
    _id
    name {
      first
      last
      full
    }
    party
    state
    type
  }
}`;

type ResultKeys = "_id" | "name" | "party" | "state" | "type";

export type GetCongressMembersResult = {
  congressMembers: Pick<CongressMember, ResultKeys>[];
};
