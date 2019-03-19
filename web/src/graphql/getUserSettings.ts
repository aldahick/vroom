import gql from "graphql-tag";

export const GET_USER_SETTINGS = gql`
query GetUserSettingsWeb {
  user {
    username
  }
}`;

export type GetUserSettingsResult = {
  user: {
    username: string;
  }
};
