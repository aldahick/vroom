import { Injectable } from "@nestjs/common";
import { TimesheetEntry, User } from "../model";
import { DatabaseService } from "../service";

@Injectable()
export class TimesheetManager {
  constructor(
    private db: DatabaseService
  ) { }

  getLatestEntry(user: User): Promise<TimesheetEntry | undefined> {
    return this.db.timesheetEntries.createQueryBuilder("timesheet")
      .innerJoin("timesheet.user", "user")
      .where("user.id = :userId", { userId: user.id })
      .orderBy("timesheet.start", "DESC")
      .limit(1).getOne();
  }
}
