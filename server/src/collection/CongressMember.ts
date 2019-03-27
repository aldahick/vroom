export interface CongressMember {
  /** bioguide ID */
  _id: string;
  name: {
    first: string;
    last: string;
    full: string;
  };
  birthday: Date;
  gender: "M" | "F";
  terms: CongressMemberTerm[];
}

export interface CongressMemberTerm {
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
