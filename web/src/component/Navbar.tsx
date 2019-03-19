import { AppBar, createStyles, MenuItem, Toolbar, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { UserState } from "./auth/UserState";

const styles = createStyles({
  link: {
    color: "white",
    textDecoration: "none"
  }
});

const NAVBAR_LINKS = {
  noAuth: {
    "Hello!": "/"
  },
  authRequired: {
    "Manage Media": "/media"
  }
};

export const Navbar = withRouter(withStyles(styles)(class extends React.Component<RouteComponentProps & WithStyles<typeof styles>> {
  onNavigate(url: string) {
    return () => this.props.history.push(url);
  }

  getAuthLinks(): {[key: string]: string} {
    if (UserState.isAuthenticated) {
      return { "Log out": "/logout" };
    }
    return {
      "Log in": "/login",
      "Register": "/register"
    };
  }

  renderLinks(links: {[key: string]: string}) {
    const { classes } = this.props;
    return Object.keys(links).map(label => (
      <MenuItem key={label} onClick={this.onNavigate(links[label])}>
        <Link to={links[label]} className={classes.link}>
          {label}
        </Link>
      </MenuItem>
    ));
  }

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          {this.renderLinks(NAVBAR_LINKS.noAuth)}
          {UserState.isAuthenticated && this.renderLinks(NAVBAR_LINKS.authRequired)}
          <div style={{ flexGrow: 1 }} />
          {this.renderLinks(this.getAuthLinks())}
        </Toolbar>
      </AppBar>
    );
  }
}));
