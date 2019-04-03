import gql from "graphql-tag";
import { User } from "./types";

export const GET_USER_SETTINGS = gql`
query GetUserSettingsWeb {
  user {
    username
  }
}`;

export type GetUserSettingsResult = {
  user: Pick<User, "username">
};
