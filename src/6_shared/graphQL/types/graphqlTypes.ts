type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
};

type ByRangesInput = {
  filtersList?: InputMaybe<Array<FilterColumn>>;
  findByValue?: InputMaybe<Scalars['String']['input']>;
  rangesObject: RangesInput;
  tmoId: Scalars['Int']['input'];
};

export type FilterColumn = {
  columnName: Scalars['String']['input'];
  filters: Array<FilterItem>;
  rule: Scalars['String']['input'];
};

type FilterDataInput = {
  columnFilters?: InputMaybe<Array<FilterColumn>>;
  filterName: Scalars['String']['input'];
  severityDirection?: InputMaybe<Scalars['String']['input']>;
  tmoId: Scalars['Int']['input'];
};

type FilterItem = {
  operator: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

type FilterTprm = {
  filters: Array<FilterItem>;
  rule: Scalars['String']['input'];
  tprmId: Scalars['Int']['input'];
};

type FiltersInput = {
  filters: Array<FilterDataInput>;
};

type HierarchyInput = {
  filters: Array<FilterTprm>;
  hierarchyId: Scalars['Int']['input'];
  parentId: Scalars['String']['input'];
  tmoId: Scalars['Int']['input'];
};

type Limit = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type NamedFilterColumnsList = {
  filterName: Scalars['String']['input'];
  filters: Array<FilterColumn>;
};

type ProcessesInput = {
  filtersList?: InputMaybe<Array<FilterColumn>>;
  findByValue?: InputMaybe<Scalars['String']['input']>;
  limit: Limit;
  rangesObject?: InputMaybe<RangesInput>;
  sort?: InputMaybe<Array<SortColumn>>;
  tmoId: Scalars['Int']['input'];
  withGroups?: Scalars['Boolean']['input'];
};

type RangesInput = {
  ranges: Array<NamedFilterColumnsList>;
  severityDirection?: InputMaybe<Scalars['String']['input']>;
};

export type SeverityInput = {
  byFilters?: InputMaybe<FiltersInput>;
  byHierarchy?: InputMaybe<HierarchyInput>;
  byRanges?: InputMaybe<ByRangesInput>;
  processes?: InputMaybe<ProcessesInput>;
};

type SortColumn = {
  ascending?: Scalars['Boolean']['input'];
  columnName: Scalars['String']['input'];
};
