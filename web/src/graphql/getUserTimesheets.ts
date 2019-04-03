import gql from "graphql-tag";
import { User } from "./types";

export const GET_USER_TIMESHEETS = gql`
query GetUserMediaItemsWeb {
  user {
    isClockedIn
    timesheets {
      id
      start
      end
    }
  }
}`;

export type GetUserTimesheetsResult = {
  user: Pick<User, "isClockedIn" | "timesheets">;
};
