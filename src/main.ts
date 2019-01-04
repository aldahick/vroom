// tslint:disable no-console

import "source-map-support/register";
import { register } from "tsconfig-paths";
register({
    baseUrl: __dirname,
    paths: {}
});
import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

async function main() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.API_PORT || 8080);
}

main().catch(console.error);
