import * as nest from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import { AuthBearerGuard } from "../lib/AuthBearerGuard";
import { GraphQLContext } from "../lib/GraphQLContext";
import { AuthTokenManager } from "../manager";
import { AuthManager } from "../manager/AuthManager";
import { User } from "../model";
import { MediaItem } from "../model/MediaItem";
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
    @gql.Args("username") username: string,
    @gql.Args("password") password: string
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
  @gql.Query("user")
  async user(
    @gql.Context() context: GraphQLContext
  ): Promise<User | undefined> {
    return context.user();
  }

  @gql.ResolveProperty("mediaItems")
  async mediaItems(
    @gql.Root() user: User,
    @gql.Context() context: GraphQLContext
  ): Promise<MediaItem[]> {
    const currentUser = await context.user();
    if (!currentUser || currentUser.id !== user.id) {
      return [];
    }
    return user.mediaItems;
  }
}
