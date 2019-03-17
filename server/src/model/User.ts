import * as orm from "typeorm";
import { MediaItem } from "./MediaItem";

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

  @orm.OneToMany(() => MediaItem, mi => mi.user)
  mediaItems!: Promise<MediaItem[]>;
}
