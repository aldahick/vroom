import { Stream } from "stream";

export interface GraphQLUpload {
  /** @deprecated */
  stream: Stream;
  createReadStream(): Stream;
  filename: string;
  mimetype: string;
  encoding: string;
}
