import gql from "graphql-tag";
import { MutationFn } from "react-apollo";
import { MutationCreateUserTokenArgs } from "./types";

export const CREATE_USER_TOKEN = gql`
mutation CreateUserTokenWeb($username: String!, $password: String!) {
  token: createUserToken(username: $username, password: $password)
}`;

export type CreateUserTokenMutation = MutationFn<{
  token: string
}, MutationCreateUserTokenArgs>;
