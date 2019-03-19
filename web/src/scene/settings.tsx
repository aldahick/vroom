import { createStyles, Typography, withStyles, WithStyles } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { Form } from "../component/Form";
import { GET_USER_SETTINGS, GetUserSettingsResult } from "../graphql/getUserSettings";
import { UPDATE_USER_SETTINGS, UpdateUserSettingsMutation } from "../graphql/updateUserSettings";

const styles = createStyles({

});

interface SettingsSceneState {
  successMessage?: string;
  errorMessage?: string;
}

export const SettingsScene = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>, SettingsSceneState> {
  readonly state: SettingsSceneState = {};

  onSubmit = (updateUserSettings: UpdateUserSettingsMutation) =>
    async (fields: { [key in "username" | "password" | "password2"]?: string }) => {
      if (fields.password !== fields.password2) {
        return this.setState({
          errorMessage: "Password fields must match."
        });
      }
      (Object.keys(fields) as (keyof typeof fields)[]).forEach(key => {
        if (fields[key] === undefined) {
          delete fields[key];
        }
      });
      delete fields.password2;
      const res = await updateUserSettings({
        variables: fields
      });
      if (!res) return;
      if (res.errors || !res.data) {
        return this.setState({
          errorMessage: res.errors ? res.errors.map(e => e.message).join(", ") : "No data available."
        });
      }
      this.setState({
        successMessage: `Successfully updated: ${Object.keys(fields).join(", ")}`
      });
  };

  render() {
    return (
      <Mutation mutation={UPDATE_USER_SETTINGS}>
        {updateUserSettings => (
          <Query<GetUserSettingsResult> query={GET_USER_SETTINGS}>
            {({ data, error, loading }) => {
              if (loading) return <Typography>Loading...</Typography>;
              if (error || !data) {
                return (
                  <Typography color="error">
                    {error ? error.message : "No data available."}
                  </Typography>
                );
              }
              return (
                <Form
                  errorMessage={this.state.errorMessage}
                  successMessage={this.state.successMessage}
                  fields={{
                    username: {
                      defaultValue: data.user.username
                    },
                    password: {
                      type: "password",
                      placeholder: "Password"
                    },
                    password2: {
                      type: "password",
                      placeholder: "Repeat password"
                    }
                  }}
                  onSubmit={this.onSubmit(updateUserSettings)}
                />
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
});
