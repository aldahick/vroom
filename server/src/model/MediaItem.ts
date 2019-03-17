import { Omit } from "lodash";
import * as orm from "typeorm";
import { User } from "./User";

@orm.Index(["user", "key"], { unique: true })
@orm.Entity("media_items")
export class MediaItem {
  constructor(init?: Omit<MediaItem, "id" | "createdAt">) {
    Object.assign(this, init);
  }

  @orm.PrimaryGeneratedColumn()
  id!: number;

  @orm.ManyToOne(() => User, u => u.mediaItems, { nullable: false })
  user!: Promise<User>;

  @orm.Column()
  key!: string;

  @orm.Column()
  mimeType!: string;

  @orm.Column({ type: "bytea" })
  data!: Buffer;

  @orm.CreateDateColumn()
  createdAt!: Date;
}
