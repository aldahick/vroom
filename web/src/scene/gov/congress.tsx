import { Card, CardContent, CardHeader, CardMedia, createStyles, Grid, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { Query } from "react-apollo";
import { GET_CONGRESS_MEMBERS, GetCongressMembersResult } from "../../graphql/getCongressMembers";
import { getStateName } from "../../util/state";

const styles = createStyles({
  cardPhoto: {
    height: 400,
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

export const CongressScene = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props;
    return (
      <Query<GetCongressMembersResult> query={GET_CONGRESS_MEMBERS}>
        {({ data, error, loading }) => {
          if (loading) return "Loading...";
          if (error || !data) return <Typography color="error">{error ? error.message : "No data available."}</Typography>;
          return (
            <Grid container>
              {_.sortBy(data.congressMembers, "name.last").map(member => (
                <Grid key={member._id} item xs={12} sm={6} lg={4}>
                  <Card className={(classes as any)["party-" + member.party.toLowerCase()]}>
                    <CardHeader title={member.name.first + " " + member.name.last} />
                    <CardMedia
                      className={classes.cardPhoto}
                      image={`https://theunitedstates.io/images/congress/450x550/${member._id}.jpg`}
                      title={`Photo of ${member.name.full}`}
                    />
                    <CardContent>
                      <Typography>
                        {_.startCase(member.type.toLowerCase())}&nbsp;
                        {_.startCase(member.party.toLowerCase())} of&nbsp;
                        {getStateName(member.state)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          );
        }}
      </Query>
    );
  }
});
