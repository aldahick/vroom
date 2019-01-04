import * as orm from "typeorm";
import { UserAuthStrategy } from "./auth/UserAuthStrategy";
import { UserToken } from "./auth/UserToken";

@orm.Entity("users")
export class User {
  @orm.PrimaryGeneratedColumn()
  id!: number;

  @orm.Column({ unique: true })
  username!: string;

  @orm.OneToOne(() => UserAuthStrategy, uas => uas.user, { nullable: false })
  authStrategy!: Promise<UserAuthStrategy>;

  @orm.OneToMany(() => UserToken, ut => ut.user)
  tokens?: UserToken[];
}
