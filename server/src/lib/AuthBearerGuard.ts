import * as nest from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as express from "express";
import { AuthTokenManager } from "../manager";
import { LoggingService } from "../service";

@nest.Injectable()
export class AuthBearerGuard implements nest.CanActivate {
  constructor(
    private tokenManager: AuthTokenManager,
    private logger: LoggingService
  ) { }

  async canActivate(context: nest.ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext<{ req: express.Request }>();
    if (!(req && req.headers && req.headers.authorization)) {
      return false;
    }
    const tokens = req.headers.authorization.split(" ");
    if (tokens.length !== 2 || tokens[0].toLowerCase() !== "bearer") {
      return false;
    }
    try {
      await this.tokenManager.getPayload(tokens[1]);
    } catch (err) {
      this.logger.error(err);
      return false;
    }
    return true;
  }

  async getTokenFromRequest(
    req: express.Request
  ): Promise<UserToken | undefined> {
    if (!(req && req.headers && req.headers.authorization)) {
      return undefined;
    }
    const tokens = req.headers.authorization.split(" ");
    if (tokens.length !== 2 || tokens[0].toLowerCase() !== "bearer") {
      return undefined;
    }
    return this.tokenManager.getToken(tokens[1]);
  }
}
