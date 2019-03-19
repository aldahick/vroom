import React from "react";
import { Redirect } from "react-router";
import { UserState } from "../component/auth";

interface LogoutSceneState {
  isLoggedOut: boolean;
}

export class LogoutScene extends React.Component<{}, LogoutSceneState> {
  readonly state: LogoutSceneState = {
    isLoggedOut: false
  };

  componentDidMount() {
    UserState.deleteToken();
    this.setState({ isLoggedOut: true });
  }

  render() {
    if (!this.state.isLoggedOut) return null;
    return <Redirect to="/" />;
  }
}
