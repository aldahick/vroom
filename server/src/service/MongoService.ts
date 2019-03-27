import { Injectable } from "@nestjs/common";
import * as mongo from "mongodb";
import { CongressMember } from "../collection/CongressMember";
import { ConfigService } from "./ConfigService";
import { LoggingService } from "./LoggingService";

@Injectable()
export class MongoService {
  public congressMembers!: mongo.Collection<CongressMember>;

  private db!: mongo.Db;

  constructor(
    private config: ConfigService,
    private logger: LoggingService
  ) {
    this.connect().catch(err => this.logger.error(err));
  }

  private async connect() {
    if (!this.config.MONGO_URL) return;
    const client = await new mongo.MongoClient(this.config.MONGO_URL, {
      useNewUrlParser: true
    }).connect();
    this.db = client.db();
    this.congressMembers = this.db.collection("congressMembers");
  }
}
