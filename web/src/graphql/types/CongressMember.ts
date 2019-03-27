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

  party: CongressParty;
  state: string;
  type: CongressMemberTermType;
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
  House = "HOUSE",
  Senate = "SENATE"
}

export enum CongressParty {
  Democrat = "DEMOCRAT",
  Independent = "INDEPENDENT",
  Republican = "REPUBLICAN"
}
