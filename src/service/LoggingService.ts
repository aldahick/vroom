import * as nest from "@nestjs/common";

@nest.Injectable()
export class LoggingService extends nest.Logger { }

@nest.Module({
  providers: [LoggingService],
  exports: [LoggingService]
})
export class LoggingModule { }
