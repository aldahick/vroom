import * as orm from "typeorm";

import { UserToken } from "./auth/UserToken";

@orm.Entity("users")
export class User {
  @orm.PrimaryGeneratedColumn()
  id!: number;

  @orm.Column({ unique: true })
  username!: string;

  @orm.OneToMany(() => UserToken, ut => ut.user)
  tokens?: UserToken[];
}
