import { Injectable } from "@nestjs/common";
import * as express from "express";
import { AuthTokenManager } from "../manager";
import { User } from "../model";
import { DatabaseService } from "../service";

@Injectable()
export class GraphQLContext {
  public userId?: number;

  constructor(
    readonly authTokenManager: AuthTokenManager,
    readonly db: DatabaseService
  ) { }

  async init(req: express.Request): Promise<GraphQLContext> {
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
    return this.db.users.findOne({ id: this.userId });
  }
}
