import * as nest from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import { AuthTokenManager } from "../../manager";
import { AuthManager } from "../../manager/AuthManager";
import { DatabaseService } from "../../service";

export class CreateUserTokenResolver {
  constructor(
    private authManager: AuthManager,
    private authTokenManager: AuthTokenManager,
    private db: DatabaseService
  ) { }

  @gql.Mutation("createUserToken")
  async createUserToken(
    @gql.Args() username: string,
    @gql.Args() password: string
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
