import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

export const UPDATE_USER_SETTINGS = gql`
mutation UpdateUserSettingsWeb($username: String, $password: String) {
  updateUserSettings(username: $username, password: $password) {
    id
  }
}`;

export type UpdateUserSettingsMutation = MutationFn<{
  id: string;
}, {
  username?: string;
  password?: string;
}>;
