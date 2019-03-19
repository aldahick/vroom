import * as nest from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import * as gql from "@nestjs/graphql";
import * as fs from "fs-extra";
import * as path from "path";
import { AuthBearerGuard } from "../lib/AuthBearerGuard";
import { RequestContext } from "../lib/RequestContext";
import { MediaItem } from "../model/MediaItem";
import { ConfigService, DatabaseService } from "../service";
import { GraphQLUpload } from "../types/GraphQLUpload";

@gql.Resolver("MediaItem")
export class MediaItemResolver {
  constructor(
    private config: ConfigService,
    private db: DatabaseService
  ) { }

  @UseGuards(AuthBearerGuard)
  @gql.Mutation("createMediaItem")
  async create(
    @RequestContext.from() context: RequestContext,
    @gql.Args("key") key: string,
    @gql.Args("file") file?: GraphQLUpload,
    @gql.Args("data") data?: string
  ): Promise<MediaItem | undefined> {
    const user = await context.user();
    if (!user) return;
    if (await this.db.mediaItems.count({
      userId: user.id, key
    }) > 0) throw new nest.ForbiddenException(`You already have a media item with key "${key}".`);
    const mediaItem = new MediaItem({
      key, userId: user.id,
      mimeType: file ? file.mimetype : "text/plain",
      data: file ? undefined : new Buffer(data || "")
    });
    if (file) {
      if (!this.config.MEDIA_DIR) throw new nest.ForbiddenException("No MEDIA_DIR is set.");
      const filename = path.resolve(this.config.MEDIA_DIR, mediaItem.fileKey);
      if (!await fs.pathExists(path.dirname(filename))) {
        await fs.mkdirp(path.dirname(filename));
      }
      await new Promise((resolve, reject) => {
        file.createReadStream()
          .on("end", resolve)
          .on("error", reject)
          .pipe(fs.createWriteStream(filename));
      });
    } else if (!data) {
      throw new nest.BadRequestException("Must send file or data");
    }
    return this.db.mediaItems.save(mediaItem);
  }
}
