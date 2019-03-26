import * as nest from "@nestjs/common";
import * as express from "express";
import { app } from "../main";
import { AuthTokenManager } from "../manager";
import { User } from "../model";
import { DatabaseService } from "../service";

@nest.Injectable()
export class RequestContext {
  public req!: express.Request;
  public userId?: number;
  private mUser?: User;

  constructor(
    readonly authTokenManager: AuthTokenManager,
    readonly db: DatabaseService
  ) { }

  async init(req: express.Request): Promise<RequestContext> {
    this.req = req;
    const token = await this.authTokenManager.getTokenFromRequest(req);
    if (!token) return this;
    const payload = await this.authTokenManager.getPayload(token);
    if (payload.subjectType === "user") {
      this.userId = payload.subjectId;
    }
    return this;
  }

  async user(): Promise<User | undefined> {
    if (!this.userId) return undefined;
    if (!this.mUser) {
      this.mUser = await this.db.users.findOne({ id: this.userId });
    }
    return this.mUser;
  }

  static fromRequest(req: express.Request): Promise<RequestContext> {
    return app.get(RequestContext).init(req);
  }
}
