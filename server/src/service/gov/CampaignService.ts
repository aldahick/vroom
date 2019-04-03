import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as _ from "lodash";
import { Campaign } from "../../collection/Campaign";
import { RandomService } from "../RandomService";
import { ZipService } from "../ZipService";

@Injectable()
export class CampaignService {
  constructor(
    private randomService: RandomService,
    private zipService: ZipService
  ) { }

  async getForYear(year: number): Promise<Campaign[]> {
    // based on https://www.fec.gov/files/bulk-downloads/2018/weball18.zip
    const baseFilename = "weball" + year.toString().slice(2);
    const url = `https://www.fec.gov/files/bulk-downloads/${year}/${baseFilename}.zip`;
    const res = await axios.get(url, {
      responseType: "arraybuffer"
    });
    if (res.status === 404) {
        throw new Error("Couldn't find FEC data for " + year);
    }
    const rawData = await this.zipService.unzipSingleFile(res.data, baseFilename + ".txt");
    return rawData.split("\n").map(line => this.mapRawRow(year, line.split("|")));
  }

  private mapRawRow(year: number, tokens: string[]): Campaign {
    const campaign: Campaign = {
      _id: this.randomService.id(),
      year,
      candidate: {
        id: tokens[0],
        name: tokens[1],
        isIncumbent: tokens[2] === "I",
        party: tokens[4],
        state: tokens[18],
        district: tokens[19]
      },
      totalReceipts: Number(tokens[5]),
      authorizedCommitteeTransfers: {
        from: Number(tokens[6]),
        to: Number(tokens[8])
      },
      disbursements: Number(tokens[7]),
      cashOnHand: {
        initial: Number(tokens[9]),
        final: Number(tokens[10])
      },
      contributions: {
        total: 0,
        candidate: Number(tokens[11]),
        individual: Number(tokens[17]),
        pac: Number(tokens[25]),
        party: Number(tokens[26])
      },
      loans: {
        candidate: {
          given: Number(tokens[12]),
          repaid: Number(tokens[14])
        },
        other: {
          given: Number(tokens[13]),
          repaid: Number(tokens[15])
        },
        owed: Number(tokens[16])
      },
      refunds: {
        individual: Number(tokens[28]),
        committee: Number(tokens[29])
      },
      end: new Date(tokens[27])
    };
    campaign.contributions.total = _.sum(Object.values(campaign.contributions));
    return campaign;
  }
}
