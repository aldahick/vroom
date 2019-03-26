import { Omit } from "lodash";
import * as orm from "typeorm";
import { User } from "./User";

@orm.Entity("timesheet_events")
export class TimesheetEntry {
  constructor(init?: Omit<TimesheetEntry, "id">) {
    Object.assign(this, init);
  }

  @orm.PrimaryGeneratedColumn()
  id!: number;

  @orm.ManyToOne(() => User, u => u.timesheetEntries, { nullable: false })
  user!: Promise<User>;

  @orm.Column()
  start!: Date;

  @orm.Column({ nullable: true })
  end?: Date;
}
