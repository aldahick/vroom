import { Injectable } from "@nestjs/common";
import axios from "axios";
import { CongressMember, CongressMemberTermType, CongressParty } from "../../collection/CongressMember";

const MEMBERS_URL = "https://theunitedstates.io/congress-legislators/legislators-current.json";

@Injectable()
export class CongressMemberService {
  async getMembers(): Promise<CongressMember[]> {
    return ((await axios.get(MEMBERS_URL)).data as RawCongressMember[]).map(m => ({
      _id: m.id.bioguide,
      externalIds: m.id,
      name: {
        first: m.name.first,
        last: m.name.last,
        full: m.name.official_full
      },
      birthday: new Date(m.bio.birthday),
      gender: m.bio.gender,
      terms: m.terms.map(t => ({
        memberId: m.id.bioguide,
        type: t.type,
        state: t.state,
        party: t.party,
        start: new Date(t.start),
        end: new Date(t.end),
        district: t.district,
        url: t.url
      })).sort((a, b) => a.start.getTime() - b.start.getTime())
    }));
  }
}

interface RawCongressMember {
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
