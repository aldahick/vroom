import gql from "graphql-tag";
import { MutationFn } from "react-apollo";
import { MutationCreateUserArgs } from "./types";

export const CREATE_USER = gql`
mutation CreateUserWeb($username: String!, $password: String!) {
  createUser(username: $username, password: $password) {
    id
  }
}`;

export type CreateUserMutation = MutationFn<{
  id: string;
}, MutationCreateUserArgs>;
