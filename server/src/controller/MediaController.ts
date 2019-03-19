import * as nest from "@nestjs/common";
import { Response } from "express";
import * as fs from "fs-extra";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { ConfigService, DatabaseService } from "../service";

@nest.Controller()
export class MediaController {
  constructor(
    private config: ConfigService,
    private db: DatabaseService
  ) { }

  @nest.Get("/media/content")
  async getContent(
    @nest.Headers() headers: {[key: string]: string},
    @nest.Res() res: Response,
    @nest.Query("token") token?: string
  ): Promise<void> {
    if (!token) throw new nest.ForbiddenException("No token provided.");
    const payload = await new Promise<{
      subjectId: number,
      subjectType: string
    }>((resolve, reject) =>
      jwt.verify(token, this.config.AUTH_SIGNING_SECRET, (err, data) =>
        err ? reject(err) : resolve(data as any)
      )
    );
    if (payload.subjectType !== "media.access") {
      throw new nest.ForbiddenException(`Wrong token type "${payload.subjectType}"`);
    }
    const mediaItem = await this.db.mediaItems.findOne({ id: payload.subjectId });
    if (!mediaItem) throw new nest.NotFoundException();
    res.setHeader("Content-Type", mediaItem.mimeType);
    if (mediaItem.data) {
      res.send(mediaItem.data);
      return;
    }
    if (!this.config.MEDIA_DIR) throw new nest.ForbiddenException("No MEDIA_DIR is set.");
    const filename = path.resolve(this.config.MEDIA_DIR, mediaItem.fileKey);
    let start = 0;
    let end: number | undefined = undefined;
    if (mediaItem.mimeType.startsWith("video/")) {
      const stats = await fs.stat(filename);
      [start, end] = headers.range.replace(/bytes=/, "").split("-").map(Number);
      if (!end) {
        end = stats.size - 1;
      }
      res.writeHead(206, {
        "Accept-Range": "bytes",
        "Content-Length": (end - start) + 1,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Content-Type": mediaItem.mimeType
      });
    }
    fs.createReadStream(filename, { start, end }).pipe(res);
  }
}
