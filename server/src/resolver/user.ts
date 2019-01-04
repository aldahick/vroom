import * as nest from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import { AuthTokenManager } from "../manager";
import { AuthManager } from "../manager/AuthManager";
import { DatabaseService } from "../service";

@gql.Resolver("User")
export class UserResolver {
  constructor(
    private authManager: AuthManager,
    private authTokenManager: AuthTokenManager,
    private db: DatabaseService
  ) { }

  @gql.Mutation("createUser")
  async createUser(
    @gql.Args("username") username: string,
    @gql.Args("password") password: string
  ) {
    const existingUser = await this.db.users.findOne({ username });
    if (existingUser) {
      throw new nest.UnauthorizedException("username is already taken");
    }
    return this.db.users.save(this.db.users.create({
      username,
      password: await this.authManager.hashPassword(password)
    }));
  }

  @gql.Mutation("createUserToken")
  async createUserToken(
    @gql.Args("username") username: string,
    @gql.Args("password") password: string
  ) {
    const user = await this.db.users.findOne({ username });
    if (!user) {
      throw new nest.NotFoundException();
    }
    if (!await this.authManager.isLoginValid(user, password)) {
      throw new nest.ForbiddenException();
    }
    return this.authTokenManager.createToken(user).then(ut => ut.token);
  }
}
