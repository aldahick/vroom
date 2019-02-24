import { Grid } from "@material-ui/core";
import React from "react";
import { Mutation } from "react-apollo";
import { Redirect, RouteComponentProps } from "react-router";
import { UserState } from "../component";
import { Form } from "../component/Form";
import { CREATE_USER_TOKEN, CreateUserTokenMutation } from "../graphql/createUserToken";
import "./login.css";

type LoginSceneState = {
  shouldRedirect: boolean;
  errorMessage?: string;
};

export class LoginScene extends React.Component<RouteComponentProps<{}>, LoginSceneState> {
  static readonly route = "/login";
  static readonly isPrivate = false;

  readonly state: LoginSceneState = {
    shouldRedirect: UserState.isAuthenticated,
    errorMessage: undefined
  };

  submit = (createUserToken: CreateUserTokenMutation) => async (fields: {
    [key in "username" | "password"]: string;
  }) => {
    const res = await createUserToken({
      variables: {
        username: fields.username,
        password: fields.password
      }
    });
    if (!res) {
      return;
    } else if (res.errors) {
      const statusCodes: number[] = res.errors.map(e => (e.message as any).statusCode);
      if (statusCodes.includes(404) || statusCodes.includes(403)) {
        this.setState({ errorMessage: "Invalid username or password." });
      } else {
        throw new Error(res.errors.map(e => e.message).join("\n"));
      }
    } else if (res.data) {
      UserState.setToken(res.data.token);
      this.setState({ shouldRedirect: true });
    }
  };

  render() {
    if (UserState.isAuthenticated || this.state.shouldRedirect) {
      return <Redirect to={(this.props.location.state || { from: "/" }).from} />;
    }
    return (
      <Grid container justify="center">
        <Grid item xs={12} sm={9} md={6} lg={4}>
          <Grid container direction="column">
            <Mutation mutation={CREATE_USER_TOKEN}>{createUserToken => (
              <Form
                fields={{
                  username: {
                    placeholder: "Username"
                  },
                  password: {
                    placeholder: "Password",
                    type: "password"
                  }
                }}
                submitText="Log In"
                onSubmit={this.submit(createUserToken)}
              >
                {this.state.errorMessage && <p className="error-message">
                  An error occurred: {this.state.errorMessage}
                </p>}
              </Form>
            )}</Mutation>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
