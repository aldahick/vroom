import * as nest from "@nestjs/common";
import { RequestContext } from "../lib/RequestContext";
import { MediaItem } from "../model";
import { DatabaseService } from "../service";

@nest.Controller()
export class MediaController {
  constructor(
    private db: DatabaseService
  ) { }

  @nest.UseInterceptors(nest.FileInterceptor("file"))
  @nest.Post("/media")
  async create(
    @nest.Body("key") key: string,
    @nest.UploadedFile("file") file: Express.Multer.File,
    @nest.Req() req,
    @RequestContext.from() context: RequestContext
  ): Promise<void> {
    // tslint:disable-next-line
    console.log(req.files, file);
    const user = await context.user();
    if (!user) return;
    await this.db.mediaItems.save(new MediaItem({
      user: Promise.resolve(user),
      key,
      mimeType: ""
    }));
  }
}
