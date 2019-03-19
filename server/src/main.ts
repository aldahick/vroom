// tslint:disable no-console
import "source-map-support/register";
import { register } from "tsconfig-paths";
register({
    baseUrl: __dirname,
    paths: {}
});
import { INestApplication, INestExpressApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
export let app: INestApplication & INestExpressApplication;
import "reflect-metadata";
import { AppModule } from "./AppModule";
import { LoggingService } from "./service/LoggingService";

async function main() {
  if (app) {
    return;
  }
  app = await NestFactory.create(AppModule, {
    logger: LoggingService
  });
  app.enableCors();
  await app.listen(process.env.API_PORT || 8080);
}

if (require.main) {
  main().catch(console.error);
}
