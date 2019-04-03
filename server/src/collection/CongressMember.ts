import { ObjectId } from "bson";

export interface CongressMember {
  /** bioguide ID */
  _id: string;
  externalIds: {
    bioguide: string;
    thomas: string;
    lis: string;
    govtrack: number;
    opensecrets: string;
    votesmart: number;
    fec: string[];
    cspan: number;
    wikipedia: string;
    ballotpedia: string;
    maplight: number;
    icpsr: number;
    wikidata: string;
  };
  name: {
    first: string;
    last: string;
    full: string;
  };
  birthday: Date;
  gender: "M" | "F";
  terms: CongressMemberTerm[];

  averageCampaignContributions?: number;
}

export interface CongressMemberTerm {
  campaignId?: ObjectId;
  type: CongressMemberTermType;
  start: Date;
  end: Date;
  state: string;
  district?: number;
  party: CongressParty;
  url?: string;
}

export enum CongressMemberTermType {
  House = "rep",
  Senate = "sen"
}

export enum CongressParty {
  Democrat = "Democrat",
  Independent = "Independent",
  Republican = "Republican"
}
