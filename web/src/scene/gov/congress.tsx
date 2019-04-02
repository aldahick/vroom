import { Button, Card, CardContent, CardHeader, createStyles, Grid, Input, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { Query } from "react-apollo";
import { GET_CONGRESS_MEMBERS, GetCongressMembersResult } from "../../graphql/getCongressMembers";
import { QueryCongressMembersArgs } from "../../graphql/types";
import congressSealImage from "../../images/gov/congress-seal-450x550.png";
import { getStateName } from "../../util/stateNames";

const styles = createStyles({
  buttonBar: {
    marginBottom: "1em"
  },
  card: {
    marginBottom: "1em",
    marginLeft: "0.5em",
    marginRight: "0.5em"
  },
  cardPhoto: {
    maxWidth: "100%"
    // paddingTop: "56.25%" // 16:9
  },
  "party-democrat": {
    backgroundColor: "rgba(  0,  21, 188, 0.5)"
  },
  "party-independent": {
    // backgroundColor: "rgba(106,  83, 194, 0.5)"
    backgroundColor: "rgba( 75,   0, 130, 0.5)"
  },
  "party-republican": {
    backgroundColor: "rgba(222,   1,   0, 0.5)"
  }
});

type CongressSceneState = {
  search?: string;
  searchValue: string;
  offset: number;
  pageSize: number;
};

export const CongressScene = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>, CongressSceneState> {
  readonly state: CongressSceneState = {
    search: undefined,
    searchValue: "",
    offset: 0,
    pageSize: 10
  };

  onPageChange = (direction: -1 | 1) => () => {
    this.setState({
      offset: this.state.offset + (direction * this.state.pageSize)
    });
  };

  onImageError = (evt: React.SyntheticEvent<HTMLImageElement>) => {
    evt.currentTarget.src = congressSealImage;
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

  render() {
    const { classes } = this.props;
    return (
      <Query<GetCongressMembersResult, QueryCongressMembersArgs>
        query={GET_CONGRESS_MEMBERS}
        variables={{
          limit: this.state.pageSize,
          offset: this.state.offset,
          query: this.state.search
        }}
      >
        {({ data, error, loading }) => {
          if (loading) return "Loading...";
          if (error || !data) return <Typography color="error">{error ? error.message : "No data available."}</Typography>;
          return (
            <Grid container>
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
                    <Card className={[classes.card, (classes as any)["party-" + member.party.toLowerCase()]].join(" ")}>
                      <CardHeader title={member.name.first + " " + member.name.last} />
                      <CardContent>
                        <Grid container justify="space-around">
                          <Grid item xs={12} md={6} lg={4}>
                            <img
                              className={classes.cardPhoto}
                              src={`https://theunitedstates.io/images/congress/450x550/${member._id}.jpg`}
                              onError={this.onImageError}
                            />
                          </Grid>
                          <Grid item xs={12} md={5} lg={7}>
                            <Typography>
                              {_.startCase(member.type.toLowerCase())}&nbsp;
                              {_.startCase(member.party.toLowerCase())} of&nbsp;
                              {getStateName(member.state)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
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

