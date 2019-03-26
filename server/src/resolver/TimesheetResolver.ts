import { ForbiddenException, UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as _ from "lodash";
import { AuthBearerGuard } from "../lib/AuthBearerGuard";
import { RequestContext } from "../lib/RequestContext";
import { TimesheetManager } from "../manager";
import { TimesheetEntry } from "../model";
import { DatabaseService } from "../service";

@gql.Resolver("TimesheetEntry")
export class TimesheetResolver {
  constructor(
    private db: DatabaseService,
    private timesheetManager: TimesheetManager
  ) { }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("markTimesheet")
  async markTimesheet(
    @gql.Context() context: RequestContext
  ): Promise<TimesheetEntry> {
    const user = await context.user();
    if (!user) throw new ForbiddenException();
    let entry = await this.timesheetManager.getLatestEntry(user);
    if (!entry || entry.end) {
      entry = await this.db.timesheetEntries.save(new TimesheetEntry({
        user: Promise.resolve(user),
        start: new Date()
      }));
    } else {
      entry.end = new Date();
      await this.db.timesheetEntries.save(entry);
    }
    return entry;
  }
}
