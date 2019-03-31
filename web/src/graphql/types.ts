type Maybe<T> = T | null;
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

export type CongressMember = {
  _id: Scalars["String"];
  name: CongressMemberName;
  birthday: Scalars["DateTime"];
  gender?: Maybe<Gender>;
  terms: Array<CongressMemberTerm>;
  party: CongressParty;
  state: Scalars["String"];
  type: CongressMemberTermType;
};

export type CongressMemberName = {
  first: Scalars["String"];
  last: Scalars["String"];
  full: Scalars["String"];
};

export type CongressMemberTerm = {
  type: CongressMemberTermType;
  start: Scalars["DateTime"];
  end: Scalars["DateTime"];
  state: Scalars["String"];
  district?: Maybe<Scalars["Int"]>;
  party: CongressParty;
  url?: Maybe<Scalars["String"]>;
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

export type File = {
  filename: Scalars["String"];
  mimetype: Scalars["String"];
  encoding: Scalars["String"];
};

export enum Gender {
  M = "M",
  F = "F"
}

export type MediaItem = {
  id: Scalars["Int"];
  user: User;
  key: Scalars["String"];
  mimeType: Scalars["String"];
  createdAt: Scalars["DateTime"];
  token: Scalars["String"];
};

export type Mutation = {
  createMediaItem: MediaItem;
  createUser: User;
  createUserToken: Scalars["String"];
  markTimesheet: TimesheetEntry;
  reloadCongressMembers: Scalars["Boolean"];
  updateUserSettings: User;
};

export type MutationCreateMediaItemArgs = {
  key: Scalars["String"];
  file?: Maybe<Scalars["Upload"]>;
  data?: Maybe<Scalars["String"]>;
};

export type MutationCreateUserArgs = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type MutationCreateUserTokenArgs = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type MutationUpdateUserSettingsArgs = {
  username?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type Query = {
  congressMembers: Array<CongressMember>;
  hello: Scalars["String"];
  user: User;
  temp__?: Maybe<Scalars["Boolean"]>;
};

export type TimesheetEntry = {
  id: Scalars["Int"];
  user: User;
  start: Scalars["DateTime"];
  end?: Maybe<Scalars["DateTime"]>;
};

export type User = {
  id: Scalars["Int"];
  username: Scalars["String"];
  isClockedIn: Scalars["Boolean"];
  mediaItems: Array<MediaItem>;
  timesheets: Array<TimesheetEntry>;
};
