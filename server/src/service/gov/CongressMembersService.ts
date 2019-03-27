import { Injectable } from "@nestjs/common";
import Axios from "axios";
import { CongressMemberTermType, CongressParty } from "../../collection/CongressMember";

const MEMBERS_URL = "https://theunitedstates.io/congress-legislators/legislators-current.json";

@Injectable()
export class CongressMemberService {
  async getMembers(): Promise<RawCongressMember[]> {
    return Axios.get(MEMBERS_URL).then(r => r.data);
  }
}

export interface RawCongressMember {
  id: {
    bioguide: string;
    thomas: string;
    lis: string;
    govtrack: number;
    opensecrets: string;
    votesmart: number;
    fec: string[];
    cspan: number;
    wikipedia: string;
    house_history: number;
    ballotpedia: string;
    maplight: number;
    icpsr: number;
    wikidata: string;
    google_entity_id: string;
  };
  name: {
    first: string;
    last: string;
    official_full: string;
  };
  bio: {
    birthday: string;
    gender: "M" | "F";
  };
  terms: {
    type: CongressMemberTermType;
    start: string;
    end: string;
    state: string;
    district?: number;
    party: CongressParty;
    class?: number;
    url?: string;
    address?: string;
    phone?: string;
    fax?: string;
    contact_form?: string;
    office?: string;
  }[];
}
