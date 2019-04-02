import gql from "graphql-tag";
import { CongressMember } from "./types";

export const GET_CONGRESS_MEMBERS = gql`
query GetCongressMembersWeb($limit: Int, $offset: Int, $query: String) {
  congressMembers(limit: $limit, offset: $offset, query: $query) {
    total
    members {
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
  }
}`;

type ResultKeys = "_id" | "name" | "party" | "state" | "type";

export type GetCongressMembersResult = {
  congressMembers: {
    total: number;
    members: Pick<CongressMember, ResultKeys>[];
  }
};
