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
  Upload: GraphQLUpload;
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

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export type CongressMemberResolvers<
  Context = any,
  ParentType = CongressMember
> = {
  _id?: Resolver<Scalars["String"], ParentType, Context>;
  name?: Resolver<CongressMemberName, ParentType, Context>;
  birthday?: Resolver<Scalars["DateTime"], ParentType, Context>;
  gender?: Resolver<Maybe<Gender>, ParentType, Context>;
  terms?: Resolver<Array<CongressMemberTerm>, ParentType, Context>;
  party?: Resolver<CongressParty, ParentType, Context>;
  state?: Resolver<Scalars["String"], ParentType, Context>;
  type?: Resolver<CongressMemberTermType, ParentType, Context>;
};

export type CongressMemberNameResolvers<
  Context = any,
  ParentType = CongressMemberName
> = {
  first?: Resolver<Scalars["String"], ParentType, Context>;
  last?: Resolver<Scalars["String"], ParentType, Context>;
  full?: Resolver<Scalars["String"], ParentType, Context>;
};

export type CongressMemberTermResolvers<
  Context = any,
  ParentType = CongressMemberTerm
> = {
  type?: Resolver<CongressMemberTermType, ParentType, Context>;
  start?: Resolver<Scalars["DateTime"], ParentType, Context>;
  end?: Resolver<Scalars["DateTime"], ParentType, Context>;
  state?: Resolver<Scalars["String"], ParentType, Context>;
  district?: Resolver<Maybe<Scalars["Int"]>, ParentType, Context>;
  party?: Resolver<CongressParty, ParentType, Context>;
  url?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["DateTime"], any> {
  name: "DateTime";
}

export type FileResolvers<Context = any, ParentType = File> = {
  filename?: Resolver<Scalars["String"], ParentType, Context>;
  mimetype?: Resolver<Scalars["String"], ParentType, Context>;
  encoding?: Resolver<Scalars["String"], ParentType, Context>;
};

export type MediaItemResolvers<Context = any, ParentType = MediaItem> = {
  id?: Resolver<Scalars["Int"], ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
  key?: Resolver<Scalars["String"], ParentType, Context>;
  mimeType?: Resolver<Scalars["String"], ParentType, Context>;
  createdAt?: Resolver<Scalars["DateTime"], ParentType, Context>;
  token?: Resolver<Scalars["String"], ParentType, Context>;
};

export type MutationResolvers<Context = any, ParentType = Mutation> = {
  createMediaItem?: Resolver<
    MediaItem,
    ParentType,
    Context,
    MutationCreateMediaItemArgs
  >;
  createUser?: Resolver<User, ParentType, Context, MutationCreateUserArgs>;
  createUserToken?: Resolver<
    Scalars["String"],
    ParentType,
    Context,
    MutationCreateUserTokenArgs
  >;
  markTimesheet?: Resolver<TimesheetEntry, ParentType, Context>;
  reloadCongressMembers?: Resolver<Scalars["Boolean"], ParentType, Context>;
  updateUserSettings?: Resolver<
    User,
    ParentType,
    Context,
    MutationUpdateUserSettingsArgs
  >;
};

export type PagedCongressMembersResolvers<
  Context = any,
  ParentType = PagedCongressMembers
> = {
  total?: Resolver<Scalars["Int"], ParentType, Context>;
  members?: Resolver<Array<CongressMember>, ParentType, Context>;
};

export type QueryResolvers<Context = any, ParentType = Query> = {
  congressMembers?: Resolver<
    PagedCongressMembers,
    ParentType,
    Context,
    QueryCongressMembersArgs
  >;
  hello?: Resolver<Scalars["String"], ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
  temp__?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
};

export type TimesheetEntryResolvers<
  Context = any,
  ParentType = TimesheetEntry
> = {
  id?: Resolver<Scalars["Int"], ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
  start?: Resolver<Scalars["DateTime"], ParentType, Context>;
  end?: Resolver<Maybe<Scalars["DateTime"]>, ParentType, Context>;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["Upload"], any> {
  name: "Upload";
}

export type UserResolvers<Context = any, ParentType = User> = {
  id?: Resolver<Scalars["Int"], ParentType, Context>;
  username?: Resolver<Scalars["String"], ParentType, Context>;
  isClockedIn?: Resolver<Scalars["Boolean"], ParentType, Context>;
  mediaItems?: Resolver<Array<MediaItem>, ParentType, Context>;
  timesheets?: Resolver<Array<TimesheetEntry>, ParentType, Context>;
};

export type Resolvers<Context = any> = {
  CongressMember?: CongressMemberResolvers<Context>;
  CongressMemberName?: CongressMemberNameResolvers<Context>;
  CongressMemberTerm?: CongressMemberTermResolvers<Context>;
  DateTime?: GraphQLScalarType;
  File?: FileResolvers<Context>;
  MediaItem?: MediaItemResolvers<Context>;
  Mutation?: MutationResolvers<Context>;
  PagedCongressMembers?: PagedCongressMembersResolvers<Context>;
  Query?: QueryResolvers<Context>;
  TimesheetEntry?: TimesheetEntryResolvers<Context>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<Context>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<Context = any> = Resolvers<Context>;
