import { Button, createStyles, Grid, Input, MenuItem, Select, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { Query } from "react-apollo";
import { CongressMemberCard } from "../../component/gov/CongressMember";
import { GET_CONGRESS_MEMBERS, GetCongressMembersResult } from "../../graphql/getCongressMembers";
import { CongressMemberSortType, QueryCongressMembersArgs } from "../../graphql/types";

const styles = createStyles({
  buttonBar: {
    marginBottom: "1em"
  }
});

type CongressSceneState = {
  search?: string;
  searchValue: string;
  offset: number;
  pageSize: number;
  sortBy: CongressMemberSortType;
};

export const CongressScene = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>, CongressSceneState> {
  readonly state: CongressSceneState = {
    search: undefined,
    searchValue: "",
    offset: 0,
    pageSize: 10,
    sortBy: CongressMemberSortType.LastName
  };

  onPageChange = (direction: -1 | 1) => () => {
    this.setState({
      offset: this.state.offset + (direction * this.state.pageSize)
    });
  };

  onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: evt.target.value });
  };

  onSearchKeyUp = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter" && evt.currentTarget.value) {
      this.setState({
        search: evt.currentTarget.value,
        offset: 0
      });
    }
    return true;
  };

  onSortChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ sortBy: evt.target.value as any });
  };

  render() {
    return (
      <Query<GetCongressMembersResult, QueryCongressMembersArgs>
        query={GET_CONGRESS_MEMBERS}
        variables={{
          limit: this.state.pageSize,
          offset: this.state.offset,
          query: this.state.search,
          sortBy: this.state.sortBy
        }}
      >
        {({ data, error, loading }) => {
          if (loading) return "Loading...";
          if (error || !data) return <Typography color="error">{error ? error.message : "No data available."}</Typography>;
          return (
            <Grid container>
              <Grid container item xs={12} justify="space-between">
                <Select value={this.state.sortBy} onChange={this.onSortChange} placeholder="Sort By">
                  <MenuItem value={CongressMemberSortType.LastName}>Last Name</MenuItem>
                  <MenuItem value={CongressMemberSortType.AverageContributionsAsc}>Average Contributions Ascending</MenuItem>
                  <MenuItem value={CongressMemberSortType.AverageContributionsDesc}>Average Contributions Descending</MenuItem>
                </Select>
              </Grid>
              {this.renderButtons(data.congressMembers.total, (
                <Input
                  type="text"
                  placeholder="Search"
                  onKeyUp={this.onSearchKeyUp}
                  onChange={this.onSearchChange}
                  value={this.state.searchValue}
                />
              ))}
              <Grid container item xs={12}>
                {data.congressMembers.members.map(member => (
                  <Grid key={member._id} item xs={12} md={6}>
                    <CongressMemberCard member={member} />
                  </Grid>
                ))}
              </Grid>
              {this.renderButtons(data.congressMembers.total)}
            </Grid>
          );
        }}
      </Query>
    );
  }

  private renderButtons(total: number, children?: React.ReactNode) {
    return (
      <Grid container item xs={12} justify="space-between" className={this.props.classes.buttonBar}>
        <Button
          color="secondary"
          variant="contained"
          onClick={this.onPageChange(-1)}
          disabled={this.state.offset === 0}
        >
          Previous
        </Button>
        {children}
        <Button
          color="secondary"
          variant="contained"
          onClick={this.onPageChange(1)}
          disabled={total - (this.state.pageSize * (this.state.offset + 1)) <= 0}
        >
          Next
        </Button>
      </Grid>
    );
  }
});

