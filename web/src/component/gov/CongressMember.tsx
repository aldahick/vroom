import { Card, CardContent, CardHeader, createStyles, Grid, Hidden, Typography, withStyles, WithStyles } from "@material-ui/core";
import * as _ from "lodash";
import React, { Fragment } from "react";
import { CongressMember } from "../../graphql/types";
import congressSealImage from "../../images/gov/congress-seal-450x550.png";
import { toMoneyString } from "../../util/money";
import { getStateName } from "../../util/stateNames";

const styles = createStyles({
  card: {
    marginBottom: "1em",
    marginLeft: "0.5em",
    marginRight: "0.5em"
  },
  cardPhoto: {
    maxWidth: "100%"
  },
  "party-democrat": {
    backgroundColor: "rgba(  0,  21, 188, 0.5)"
  },
  "party-independent": {
    backgroundColor: "rgba( 75,   0, 130, 0.5)"
  },
  "party-republican": {
    backgroundColor: "rgba(222,   1,   0, 0.5)"
  }
});

type CongressMemberProps = {
  member: CongressMember;
};

export const CongressMemberCard = withStyles(styles)(class extends React.Component<WithStyles<typeof styles> & CongressMemberProps> {
  onImageError = (evt: React.SyntheticEvent<HTMLImageElement>) => {
    evt.currentTarget.src = congressSealImage;
  };

  render() {
    const { classes, member } = this.props;
    const campaigns = _.compact(member.terms.map(t => t.campaign));
    const individualContributionRatio = _.sumBy(campaigns, ({ contributions }) =>
      contributions.individual / contributions.total
    ) / campaigns.length;
    return (
      <Card className={[classes.card, (classes as any)["party-" + member.party.toLowerCase()]].join(" ")}>
        <CardHeader title={member.name.first + " " + member.name.last} />
        <CardContent>
          <Grid container justify="space-around">
            <Hidden smDown>
              <Grid item md={3}>
                <img
                  className={classes.cardPhoto}
                  src={`https://theunitedstates.io/images/congress/450x550/${member._id}.jpg`}
                  onError={this.onImageError}
                />
              </Grid>
            </Hidden>
            <Grid item xs={12} md={5} lg={8}>
              <Typography variant="subtitle1">
                {_.startCase(member.type.toLowerCase())}&nbsp;
                {_.startCase(member.party.toLowerCase())} of&nbsp;
                {getStateName(member.state)}
              </Typography>
              <Typography>
                Held federal office since {new Date(member.terms[0].start).getFullYear()}
              </Typography>
              {campaigns.length > 0 ? (
                <Fragment>
                  <Typography>
                    {(100 * individualContributionRatio).toFixed(2)}% individual contributions
                  </Typography>
                  {member.averageCampaignContributions && (
                    <Typography>
                      {toMoneyString(member.averageCampaignContributions)} average total contributions
                    </Typography>
                  )}
                </Fragment>
              ) : <Typography>No campaign data available.</Typography>}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
});
