import * as nest from "@nestjs/common";
import * as crypto from "crypto";
import * as dateFns from "date-fns";
import * as randomstring from "randomstring";

import { User, UserToken } from "../model";
import { DatabaseService } from "../service";

@nest.Injectable()
export class AuthTokenManager {
  constructor(
    private db: DatabaseService
  ) { }

  async createToken(user: User): Promise<UserToken> {
    const raw = randomstring.generate(32);
    const userToken = new UserToken({
      user,
      token: this.hashToken(raw)
    });
    return this.db.userTokens.save(userToken);
  }

  async isTokenValid(token?: string | UserToken): Promise<boolean> {
    if (typeof(token) === "string") {
      token = await this.db.userTokens.findOne({
        token: this.hashToken(token)
      });
    }
    return token && !dateFns.isAfter(token.createdAt, dateFns.addDays(new Date(), 1)) || false;
  }

  private hashToken(raw: string): string {
    return crypto.createHash("sha256").update(raw).digest("hex");
  }
}
