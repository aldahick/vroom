import * as orm from "typeorm";
import { User } from "../User";

@orm.Entity("user_auth_strategies")
export class UserAuthStrategy {
  @orm.PrimaryColumn()
  userId!: number;

  @orm.OneToOne(() => User, u => u.authStrategy, { nullable: false })
  user!: User;

  @orm.Column()
  password!: string;

  @orm.UpdateDateColumn()
  updatedAt!: Date;
}
