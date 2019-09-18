type Maybe<T> = T | undefined;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar represents a date and time following the ISO 8601 standard */
  DateTime: Date;
  Upload: File;
};

export type Campaign = {
  year: Scalars["Int"];
  candidate: CampaignCandidate;
  cashOnHand: CampaignCashOnHand;
  contributions: CampaignContributions;
  loans: CampaignLoans;
  refunds: CampaignRefunds;
  end: Scalars["DateTime"];
};

export type CampaignCandidate = {
  id: Scalars["String"];
  name: Scalars["String"];
  isIncumbent: Scalars["Boolean"];
  party: Scalars["String"];
  state: Scalars["String"];
  district: Scalars["String"];
};

export type CampaignCashOnHand = {
  initial: Scalars["Float"];
  final: Scalars["Float"];
};

export type CampaignContributions = {
  total: Scalars["Float"];
  candidate: Scalars["Float"];
  individual: Scalars["Float"];
  pac: Scalars["Float"];
  party: Scalars["Float"];
};

export type CampaignLoans = {
  candidate?: Maybe<CampaignLoansSource>;
  other?: Maybe<CampaignLoansSource>;
  owed: Scalars["Float"];
};

export type CampaignLoansSource = {
  given: Scalars["Float"];
  repaid: Scalars["Float"];
};

export type CampaignRefunds = {
  individual: Scalars["Float"];
  committee: Scalars["Float"];
};

export type CongressMember = {
  _id: Scalars["String"];
  name: CongressMemberName;
  birthday: Scalars["DateTime"];
  gender?: Maybe<Gender>;
  terms: Array<CongressMemberTerm>;
  party: CongressParty;
  state: Scalars["String"];
  type: CongressMemberTermType;
  averageCampaignContributions?: Maybe<Scalars["Float"]>;
};

export type CongressMemberName = {
  first: Scalars["String"];
  last: Scalars["String"];
  full: Scalars["String"];
};

export enum CongressMemberSortType {
  LastName = "LAST_NAME",
  AverageContributionsAsc = "AVERAGE_CONTRIBUTIONS_ASC",
  AverageContributionsDesc = "AVERAGE_CONTRIBUTIONS_DESC"
}

export type CongressMemberTerm = {
  type: CongressMemberTermType;
  start: Scalars["DateTime"];
  end: Scalars["DateTime"];
  state: Scalars["String"];
  district?: Maybe<Scalars["Int"]>;
  party: CongressParty;
  url?: Maybe<Scalars["String"]>;
  campaign?: Maybe<Campaign>;
};

export enum CongressMemberTermType {
  House = "HOUSE",
  Senate = "SENATE"
}

export enum CongressParty {
  Democrat = "DEMOCRAT",
  Independent = "INDEPENDENT",
  Republican = "REPUBLICAN"
}

export enum Gender {
  M = "M",
  F = "F"
}

export type Mutation = {
  createUser: User;
  createUserToken: Scalars["String"];
  reloadCampaigns: Scalars["Boolean"];
  reloadCongressMembers: Scalars["Boolean"];
  updateUserSettings: User;
};

export type MutationCreateUserArgs = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type MutationCreateUserTokenArgs = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type MutationReloadCampaignsArgs = {
  year: Scalars["Int"];
};

export type MutationUpdateUserSettingsArgs = {
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type PagedCongressMembers = {
  total: Scalars["Int"];
  members: Array<CongressMember>;
};

export type Query = {
  congressMembers: PagedCongressMembers;
  hello: Scalars["String"];
  user: User;
  temp__?: Maybe<Scalars["Boolean"]>;
};

export type QueryCongressMembersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  query?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<CongressMemberSortType>;
};

export type User = {
  id: Scalars["Int"];
  username: Scalars["String"];
};
