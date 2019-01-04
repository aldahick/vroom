import * as nest from "@nestjs/common";
import * as path from "path";
import * as stackTrace from "stack-trace";

const BASE_DIR = path.dirname(path.dirname(__dirname));

@nest.Injectable()
export class LoggingService extends nest.Logger {
  log(message: any) {
    super.log(message, this.getCallingInfo());
  }
  warn(message: any) {
    super.warn(message, this.getCallingInfo());
  }
  error(err?: Error | string) {
    super.error(err, undefined, this.getCallingInfo());
  }

  private getCallingInfo() {
    const parsed = stackTrace.parse(new Error());
    const stack = parsed.find(stack =>
      stack.getFileName().startsWith(BASE_DIR) &&
      stack.getTypeName() !== "LoggingService"
    );
    if (!stack) {
      return undefined;
    }
    return `${stack.getFunctionName()}():${stack.getLineNumber()}`;
  }
}

@nest.Module({
  providers: [LoggingService],
  exports: [LoggingService]
})
export class LoggingModule { }
