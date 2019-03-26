import { Button, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles, WithStyles } from "@material-ui/core";
import { ApolloQueryResult } from "apollo-client";
import _ from "lodash";
import React, { Fragment } from "react";
import { Mutation, Query } from "react-apollo";
import { GET_USER_TIMESHEETS, GetUserTimesheetsResult } from "../graphql/getUserTimesheets";
import { MARK_TIMESHEET, MarkTimesheetMutation } from "../graphql/markTimesheet";
import { TimesheetEntry } from "../graphql/types/TimesheetEntry";
import { callMutation } from "../util/graphql";

const styles = createStyles({

});

interface TimesheetSceneState {
  successMessage?: string;
  errorMessage?: string;
}

export const TimesheetScene = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>, TimesheetSceneState> {
  readonly state: TimesheetSceneState = {};

  mark = (markTimesheet: MarkTimesheetMutation, refetchTimesheets: () => Promise<ApolloQueryResult<GetUserTimesheetsResult>>) => async () => {
    try {
      const { timesheet } = await callMutation(markTimesheet, {});
      await refetchTimesheets();
      this.setState({
        successMessage: `Clocked ${timesheet.end ? "out" : "in"} successfully.`,
        errorMessage: undefined
      });
    } catch (err) {
      this.setState({
        successMessage: undefined,
        errorMessage: err.message
      });
    }
  }

  render() {
    const { successMessage, errorMessage } = this.state;
    return (
      <Query<GetUserTimesheetsResult> query={GET_USER_TIMESHEETS}>
        {({ data, error, loading, refetch: refetchTimesheets }) => {
          if (loading) return "Loading...";
          if (error || !data) return <Typography color="error">{error ? error.message : "No data available."}</Typography>;
          return (
            <Fragment>
              {successMessage && <Typography color="primary">{successMessage}</Typography>}
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
              <Mutation mutation={MARK_TIMESHEET}>
                {markTimesheet => (
                  <Button color="primary" onClick={this.mark(markTimesheet, refetchTimesheets)}>
                    Clock {data.user.isClockedIn ? "Out" : "In"}
                  </Button>
                )}
              </Mutation>
              {this.renderTable(data.user.timesheets)}
            </Fragment>
          );
        }}
      </Query>
    );
  }

  renderTable(timesheets: TimesheetEntry[]) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheets.sort((a, b) =>
            new Date(b.start).getTime() - new Date(a.start).getTime()
          ).map(timesheet => (
            <TableRow key={timesheet.id}>
              <TableCell>{new Date(timesheet.start).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(timesheet.start).toLocaleTimeString()}</TableCell>
              <TableCell>{timesheet.end ? new Date(timesheet.end).toLocaleTimeString() : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
});
