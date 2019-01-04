import * as gql from "@nestjs/graphql";

@gql.Resolver("User")
export class UsersResolver {
  @gql.Query("hello")
  async hello() {
    return "Hello, world!";
  }
}
