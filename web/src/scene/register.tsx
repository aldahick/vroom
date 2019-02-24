import { Grid } from "@material-ui/core";
import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router";
import { Form } from "../component/Form";
import { CREATE_USER, CreateUserMutation } from "../graphql/createUser";

type RegisterSceneState = {
  shouldRedirect: boolean;
  errorMessage: string;
};

export class RegisterScene extends Component<{}, RegisterSceneState> {
  static readonly route = "/register";
  static readonly isPrivate = false;

  readonly state: RegisterSceneState = {
    shouldRedirect: false,
    errorMessage: ""
  };

  submit = (createUser: CreateUserMutation) => async (fields: {
    [key in "username" | "password" | "password2"]: string;
  }) => {
    if (fields.password !== fields.password2) {
      return this.setState({
        errorMessage: "Passwords do not match."
      });
    }
    const res = await createUser({
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
      this.setState({ shouldRedirect: true });
    }
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Redirect to="/login" />;
    }
    return (
      <Grid container justify="center">
        <Grid item xs={12} sm={9} md={6} lg={4}>
          <Grid container direction="column">
            <Mutation mutation={CREATE_USER}>{createUser =>
              <Form
                fields={{
                  username: {
                    placeholder: "Username",
                    isRequired: true
                  },
                  password: {
                    placeholder: "Password",
                    type: "password",
                    isRequired: true
                  },
                  password2: {
                    placeholder: "Password Again",
                    type: "password",
                    isRequired: true
                  }
                }}
                submitText="Register"
                onSubmit={this.submit(createUser)}
              >
                {this.state.errorMessage && <p className="error-message">
                  An error occurred: {this.state.errorMessage}
                </p>}
              </Form>
            }</Mutation>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
