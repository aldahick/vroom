import React from "react";

export class IndexScene extends React.Component {
  static readonly route = "/";
  static readonly isPrivate = true;

  render() {
    return "Hello, world!";
  }
}
