import * as nest from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../model";

@nest.Injectable()
export class AuthManager {
  async isLoginValid(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, (await user.authStrategy).password);
  }
}
