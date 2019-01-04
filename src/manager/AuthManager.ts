import * as nest from "@nestjs/common";
import * as crypto from "crypto";
import * as dateFns from "date-fns";
import { UserToken } from "model";
import { DatabaseService } from "service";

@nest.Injectable()
export class AuthManager {
  constructor(
    private db: DatabaseService
  ) { }

  private hashToken(raw: string): string {
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  async isTokenValid(token?: string | UserToken): Promise<boolean> {
    if (typeof(token) === "string") {
      token = await this.db.userTokens.findOne({
        token: this.hashToken(token)
      });
    }
    return token && !dateFns.isAfter(token.createdAt, dateFns.addDays(new Date(), 1)) || false;
  }
}
