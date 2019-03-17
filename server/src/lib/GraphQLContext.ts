import * as n from "@nestjs/core/injector";
import * as express from "express";
import { AuthTokenManager } from "../manager";
import { User } from "../model";
import { AuthBearerGuard } from "./AuthBearerGuard";

@Injectable()
export class GraphQLContext {
  public user?: User;

  constructor(
    @Inject() readonly authBearerGuard?: AuthBearerGuard,
    @Inject() readonly authTokenManager?: AuthTokenManager
  ) { }

  async init(req: express.Request): Promise<GraphQLContext> {
    const token = await this.authBearerGuard!.getTokenFromRequest(req);
    if (token && this.authTokenManager!.isTokenValid(token)) {
      this.user = await token.user;
    }
    return this;
  }
}
