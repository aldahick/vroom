import { Injectable } from "@nestjs/common";
import * as mongo from "mongodb";
import * as randomstring from "randomstring";

@Injectable()
export class RandomService {
  id() {
    return new mongo.ObjectId(randomstring.generate({
      length: 24,
      charset: "hex"
    }));
  }
}
