import * as nest from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as express from "express";

import { AuthTokenManager } from "../manager";

@nest.Injectable()
export class AuthBearerGuard implements nest.CanActivate {
  constructor(
    private tokenManager: AuthTokenManager
  ) { }

  async canActivate(context: nest.ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext<{ req: express.Request }>();
    if (!(req && req.headers && req.headers.authorization)) {
      return false;
    }
    const tokens = req.headers.authorization.split(" ");
    return tokens.length > 1 && tokens[0].toLowerCase() === "bearer" && this.tokenManager.isTokenValid(tokens[1]);
  }
}
