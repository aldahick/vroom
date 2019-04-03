import { Injectable } from "@nestjs/common";
import * as yauzl from "yauzl-promise";

@Injectable()
export class ZipService {
  async unzipSingleFile(buffer: Buffer, filename: string): Promise<string> {
    const zipFile = await yauzl.fromBuffer(buffer);
    const entry = (await zipFile.readEntries()).find(e => e.fileName === filename);
    if (!entry) throw new Error(`no filename ${filename} found in zip`);
    const stream = await zipFile.openReadStream(entry);
    stream.setEncoding("utf-8");
    let data = "";
    stream.on("data", chunk => data += chunk as string);
    await new Promise(resolve => stream.on("end", resolve));
    return data;
  }
}
