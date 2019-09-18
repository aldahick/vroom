import * as orm from "typeorm";

@orm.Entity("users")
export class User {
  constructor(init?: Pick<User, "username" | "password">) {
    Object.assign(this, init);
  }

  @orm.PrimaryGeneratedColumn()
  id!: number;

  @orm.Column({ unique: true })
  username!: string;

  @orm.Column()
  password!: string;
}
