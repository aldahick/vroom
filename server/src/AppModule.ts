import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import GraphQLDateTime = require("graphql-type-datetime");
import { GraphQLContext } from "./lib/GraphQLContext";
import { OrmNamingStrategy } from "./lib/OrmNamingStrategy";
import { app } from "./main";
import * as managers from "./manager";
import * as models from "./model";
import * as resolvers from "./resolver";
import * as services from "./service";

@Module({
  imports: [
    services.LoggingService,
    services.ConfigService,
    GraphQLModule.forRootAsync({
      inject: [services.ConfigService],
      imports: [services.ConfigModule],
      useFactory: async (config: services.ConfigService) => ({
        debug: config.inDevelopment,
        playground: config.inDevelopment,
        typePaths: [
          __dirname + "/../assets/graphql/**/*.gql"
        ],
        resolvers: {
          DateTime: GraphQLDateTime
        },
        context: ({ req }: any) => app.get(GraphQLContext).init(req)
      })
    }),
    TypeOrmModule.forRootAsync({
      inject: [services.ConfigService],
      imports: [services.ConfigModule],
      useFactory: (config: services.ConfigService) => ({
        type: config.DB_TYPE as any,
        host: config.DB_HOST,
        port: Number(config.DB_PORT),
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE,
        entities: Object.values(models),
        synchronize: true,
        namingStrategy: new OrmNamingStrategy()
      })
    })
  ],
  providers: [
    services.ConfigService,
    services.DatabaseService,
    services.LoggingService,
    GraphQLContext,
    ...Object.values(managers),
    ...Object.values(resolvers)
  ]
})
export class AppModule {}
