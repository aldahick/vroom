import gql from "graphql-tag";
import { CongressMember } from "./types";

export const GET_CONGRESS_MEMBERS = gql`
query GetCongressMembersWeb($limit: Int, $offset: Int, $query: String, $sortBy: CongressMemberSortType) {
  congressMembers(limit: $limit, offset: $offset, query: $query, sortBy: $sortBy) {
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
      averageCampaignContributions
      terms {
        start
        campaign {
          year
          contributions {
            total
            individual
          }
        }
      }
    }
  }
}`;

export type GetCongressMembersResult = {
  congressMembers: {
    total: number;
    members: CongressMember[];
  }
};
