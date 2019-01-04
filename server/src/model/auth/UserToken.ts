import * as orm from "typeorm";

import { User } from "../User";

@orm.Entity("user_tokens")
export class UserToken {
  constructor(init?: Partial<UserToken>) {
    Object.assign(this, init);
  }

  @orm.PrimaryGeneratedColumn()
  id!: number;

  @orm.ManyToOne(() => User, u => u.tokens, { nullable: false })
  user!: User;

  @orm.Column({ unique: true })
  token!: string;

  @orm.CreateDateColumn()
  createdAt!: Date;
}
