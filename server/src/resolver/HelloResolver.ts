import * as gql from "@nestjs/graphql";
import { LoggingService } from "../service";

export class HelloResolver {
  constructor(
    private logger: LoggingService
  ) { }

  @gql.Query("hello")
  async hello() {
    this.logger.log("Hello, world!");
    return "Hello, world!";
  }
}
