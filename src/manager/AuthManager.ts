import * as nest from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../model";

@nest.Injectable()
export class AuthManager {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async isLoginValid(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
