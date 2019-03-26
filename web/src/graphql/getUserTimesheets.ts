import gql from "graphql-tag";
import { TimesheetEntry } from "./types/TimesheetEntry";

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
  user: {
    isClockedIn: boolean;
    timesheets: TimesheetEntry[]
  }
};
