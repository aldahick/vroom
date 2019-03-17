import * as nest from "@nestjs/common";
import * as dotenv from "dotenv";
import { LoggingModule, LoggingService } from "./LoggingService";

@nest.Injectable()
export class ConfigService {
  private static instance?: ConfigService;

  @ConfigService.required() readonly AUTH_SIGNING_SECRET!: string;

  @ConfigService.required() readonly DB_TYPE!: string;
  @ConfigService.required() readonly DB_USER!: string;
  @ConfigService.required() readonly DB_HOST!: string;
  @ConfigService.required() readonly DB_PASSWORD!: string;
  @ConfigService.required() readonly DB_PORT!: string;
  @ConfigService.required() readonly DB_DATABASE!: string;

  @ConfigService.optional() readonly ENV: string = "development";

  constructor(
    private logger: LoggingService
  ) {
    if (ConfigService.instance) {
      Object.assign(this, ConfigService.instance);
      return;
    }
    dotenv.load({
      path: __dirname + "/../../.env"
    });
    this.load();
    ConfigService.instance = this;
  }

  load() {
    const keys: {[key in keyof ConfigService]: boolean} = Reflect.getMetadata("keys", this);
    for (const key in keys) {
      this[key] = process.env[key];
      if (!this[key]) {
        if (keys[key]) { // isRequired
          throw new Error(`Required environment variable ${key} was not defined.`);
        } else {
          this.logger.warn(`Optional environment variable ${key} was not defined.`);
        }
      }
    }
  }

  get inDevelopment(): boolean {
    return this.ENV === "development";
  }

  private static required(): PropertyDecorator {
    return this.key(true);
  }

  private static optional(): PropertyDecorator {
    return this.key(false);
  }

  private static key(isRequired: boolean): PropertyDecorator {
    return (target, key) => {
      let keys: {[key: string]: boolean} = {};
      if (Reflect.hasMetadata("keys", target)) {
        keys = Reflect.getMetadata("keys", target);
      }
      keys[key.toString()] = isRequired;
      Reflect.defineMetadata("keys", keys, target);
    };
  }
}

@nest.Module({
  providers: [ConfigService],
  imports: [LoggingModule],
  exports: [ConfigService]
})
export class ConfigModule { }
