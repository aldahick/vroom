import { createStyles, Grid, withStyles, WithStyles } from "@material-ui/core";
import React, { Fragment } from "react";
import { Navbar } from "./Navbar";

const styles = createStyles({
  body: {
    paddingTop: "2em"
  }
});

export const Layout = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>> {
  render() {
    const { children, classes } = this.props;
    return (
      <Fragment>
        <Navbar />
        <Grid container justify="center" className={classes.body}>
          <Grid item xs={12} sm={10} md={9} lg={7}>
            {children}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
});
