import { Button, Grid, Input } from "@material-ui/core";
import gql from "graphql-tag";
import React, { ChangeEvent, Component } from "react";
import { Mutation } from "react-apollo";

const CREATE_USER = gql`
mutation CreateUserWeb($username: String!, $password: String!) {
  createUser(username: $username, password: $password) {
    id
  }
}`;

type RegisterSceneState = {
  username: string;
  password: string;
};

export class RegisterScene extends Component<{}, RegisterSceneState> {
  static readonly route = "/register";

  onInputChange = (property: "username" | "password") => (evt: ChangeEvent<HTMLInputElement>) =>
    this.setState({ [property]: evt.target.value } as RegisterSceneState);

  render() {
    return (
      <Grid container>
        <Input placeholder="Username" onChange={this.onInputChange("username")} />
        <Input placeholder="Password" onChange={this.onInputChange("password")} />
        <Mutation mutation={CREATE_USER}>
          {createUser =>
            <Button
              variant="contained"
              color="primary"
              onClick={() => createUser({
                variables: {
                  username: this.state.username,
                  password: this.state.password
                }
              })}
            >Submit
            </Button>
          }
        </Mutation>
      </Grid>
    );
  }
}
