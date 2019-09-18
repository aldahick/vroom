import * as nest from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { MutationCreateUserArgs, MutationCreateUserTokenArgs, MutationUpdateUserSettingsArgs } from "../generated/graphql";
import { AuthBearerGuard } from "../lib/AuthBearerGuard";
import { RequestContext } from "../lib/RequestContext";
import { AuthTokenManager } from "../manager";
import { AuthManager } from "../manager/AuthManager";
import { User } from "../model";
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
    @gql.Args() { username, password }: MutationCreateUserArgs
  ): Promise<User> {
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
    @gql.Args() { username, password }: MutationCreateUserTokenArgs
  ): Promise<string> {
    const user = await this.db.users.findOne({ username });
    if (!user) {
      throw new nest.NotFoundException();
    }
    if (!await this.authManager.isLoginValid(user, password)) {
      throw new nest.ForbiddenException();
    }
    return this.authTokenManager.createToken({
      subjectId: user.id,
      subjectType: "user"
    });
  }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("updateUserSettings")
  async updateUserSettings(
    @gql.Context() context: RequestContext,
    @gql.Args() fields: MutationUpdateUserSettingsArgs
  ): Promise<User> {
    if (!context.userId) throw new nest.ForbiddenException();
    fields = _.pick(fields, ["username", "password"]);
    if (Object.keys(fields).length === 0) {
      throw new nest.BadRequestException("No fields passed.");
    }
    if (fields.password) {
      fields.password = await this.authManager.hashPassword(fields.password);
    }
    await this.db.users.update(context.userId, fields);
    return (await context.user())!;
  }

  @UseGuards(AuthBearerGuard)
  @gql.Query("user")
  async user(
    @gql.Context() context: RequestContext
  ): Promise<User | undefined> {
    return context.user();
  }
}
