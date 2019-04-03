declare interface GraphQLUpload {
  createReadStream(): Stream;
  filename: string;
  mimetype: string;
  encoding: string;
}
