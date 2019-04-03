import gql from "graphql-tag";
import { MutationFn } from "react-apollo";
import { TimesheetEntry } from "./types";

export const MARK_TIMESHEET = gql`
mutation MarkTimesheetWeb {
  timesheet: markTimesheet {
    id
    start
    end
  }
}`;

export type MarkTimesheetMutation = MutationFn<{
  timesheet: TimesheetEntry;
}, {}>;
