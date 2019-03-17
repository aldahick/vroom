import * as nest from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { User } from "../model";
import { ConfigService, DatabaseService } from "../service";

type AuthTokenPayload = {
  subjectType: "user";
  subjectId: number;
};

@nest.Injectable()
export class AuthTokenManager {
  constructor(
    private config: ConfigService,
    private db: DatabaseService
  ) { }

  createToken(payload: AuthTokenPayload): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      jwt.sign(payload, this.config.AUTH_SIGNING_SECRET, (err, token) =>
        err ? reject(err) : resolve(token)
      )
    );
  }

  async getTokenSubject(payload: AuthTokenPayload): Promise<User | undefined> {
    if (payload.subjectType === "user") {
      return this.db.users.findOne({ id: payload.subjectId });
    }
    throw new nest.UnprocessableEntityException(`can't handle payload subject ${payload.subjectType}`);
  }

  getPayload(token: string): Promise<AuthTokenPayload> {
    return new Promise<AuthTokenPayload>((resolve, reject) =>
      jwt.verify(token, this.config.AUTH_SIGNING_SECRET, (err, payload) =>
        err ? reject(err) : resolve(typeof(payload) === "string" ? JSON.parse(payload) : payload)
      )
    );
  }
}
