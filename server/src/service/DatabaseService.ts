import * as nest from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import * as _ from "lodash";
import * as orm from "typeorm";
import * as models from "../model";

@nest.Injectable()
export class DatabaseService {
  @DatabaseService.repository(models.MediaItem)
  mediaItems!: orm.Repository<models.MediaItem>;

  @DatabaseService.repository(models.User)
  users!: orm.Repository<models.User>;

  constructor(
    @InjectConnection()
    connection: orm.Connection
  ) {
    const models: {[key in keyof DatabaseService]: boolean} = Reflect.getMetadata("models", this);
    for (const key in models) {
      this[key] = connection.getRepository(models[key]);
    }
  }

  private static repository(model: Function): PropertyDecorator {
    return (target, key) => {
      let models: {[key: string]: Function} = {};
      if (Reflect.hasMetadata("models", target)) {
        models = Reflect.getMetadata("models", target);
      }
      models[key.toString()] = model;
      Reflect.defineMetadata("models", models, target);
    };
  }
}
