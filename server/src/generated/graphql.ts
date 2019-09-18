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

export type CampaignResolvers<Context = any, ParentType = Campaign> = {
  year?: Resolver<Scalars["Int"], ParentType, Context>;
  candidate?: Resolver<CampaignCandidate, ParentType, Context>;
  cashOnHand?: Resolver<CampaignCashOnHand, ParentType, Context>;
  contributions?: Resolver<CampaignContributions, ParentType, Context>;
  loans?: Resolver<CampaignLoans, ParentType, Context>;
  refunds?: Resolver<CampaignRefunds, ParentType, Context>;
  end?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type CampaignCandidateResolvers<
  Context = any,
  ParentType = CampaignCandidate
> = {
  id?: Resolver<Scalars["String"], ParentType, Context>;
  name?: Resolver<Scalars["String"], ParentType, Context>;
  isIncumbent?: Resolver<Scalars["Boolean"], ParentType, Context>;
  party?: Resolver<Scalars["String"], ParentType, Context>;
  state?: Resolver<Scalars["String"], ParentType, Context>;
  district?: Resolver<Scalars["String"], ParentType, Context>;
};

export type CampaignCashOnHandResolvers<
  Context = any,
  ParentType = CampaignCashOnHand
> = {
  initial?: Resolver<Scalars["Float"], ParentType, Context>;
  final?: Resolver<Scalars["Float"], ParentType, Context>;
};

export type CampaignContributionsResolvers<
  Context = any,
  ParentType = CampaignContributions
> = {
  total?: Resolver<Scalars["Float"], ParentType, Context>;
  candidate?: Resolver<Scalars["Float"], ParentType, Context>;
  individual?: Resolver<Scalars["Float"], ParentType, Context>;
  pac?: Resolver<Scalars["Float"], ParentType, Context>;
  party?: Resolver<Scalars["Float"], ParentType, Context>;
};

export type CampaignLoansResolvers<
  Context = any,
  ParentType = CampaignLoans
> = {
  candidate?: Resolver<Maybe<CampaignLoansSource>, ParentType, Context>;
  other?: Resolver<Maybe<CampaignLoansSource>, ParentType, Context>;
  owed?: Resolver<Scalars["Float"], ParentType, Context>;
};

export type CampaignLoansSourceResolvers<
  Context = any,
  ParentType = CampaignLoansSource
> = {
  given?: Resolver<Scalars["Float"], ParentType, Context>;
  repaid?: Resolver<Scalars["Float"], ParentType, Context>;
};

export type CampaignRefundsResolvers<
  Context = any,
  ParentType = CampaignRefunds
> = {
  individual?: Resolver<Scalars["Float"], ParentType, Context>;
  committee?: Resolver<Scalars["Float"], ParentType, Context>;
};

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
  averageCampaignContributions?: Resolver<
    Maybe<Scalars["Float"]>,
    ParentType,
    Context
  >;
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
  campaign?: Resolver<Maybe<Campaign>, ParentType, Context>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["DateTime"], any> {
  name: "DateTime";
}

export type MutationResolvers<Context = any, ParentType = Mutation> = {
  createUser?: Resolver<User, ParentType, Context, MutationCreateUserArgs>;
  createUserToken?: Resolver<
    Scalars["String"],
    ParentType,
    Context,
    MutationCreateUserTokenArgs
  >;
  reloadCampaigns?: Resolver<
    Scalars["Boolean"],
    ParentType,
    Context,
    MutationReloadCampaignsArgs
  >;
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

export type UserResolvers<Context = any, ParentType = User> = {
  id?: Resolver<Scalars["Int"], ParentType, Context>;
  username?: Resolver<Scalars["String"], ParentType, Context>;
};

export type Resolvers<Context = any> = {
  Campaign?: CampaignResolvers<Context>;
  CampaignCandidate?: CampaignCandidateResolvers<Context>;
  CampaignCashOnHand?: CampaignCashOnHandResolvers<Context>;
  CampaignContributions?: CampaignContributionsResolvers<Context>;
  CampaignLoans?: CampaignLoansResolvers<Context>;
  CampaignLoansSource?: CampaignLoansSourceResolvers<Context>;
  CampaignRefunds?: CampaignRefundsResolvers<Context>;
  CongressMember?: CongressMemberResolvers<Context>;
  CongressMemberName?: CongressMemberNameResolvers<Context>;
  CongressMemberTerm?: CongressMemberTermResolvers<Context>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<Context>;
  PagedCongressMembers?: PagedCongressMembersResolvers<Context>;
  Query?: QueryResolvers<Context>;
  User?: UserResolvers<Context>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<Context = any> = Resolvers<Context>;
