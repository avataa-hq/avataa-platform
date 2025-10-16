import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as Types from '../../../types/graphqlTypes';

const defaultOptions = {} as const;
export type GetSeverityAllSubscriptionVariables = Types.Exact<{
  filters: Types.SeverityInput;
}>;

export type GetSeverityAllSubscription = {
  __typename?: 'Subscription';
  severity: {
    __typename?: 'SeverityResponse';
    byFilters?: Array<{
      __typename?: 'ResponseSeverityItem';
      count: number;
      filterName: string;
      maxSeverity: number;
    }> | null;
    byRanges?: Array<{
      __typename?: 'ResponseSeverityItem';
      count: number;
      filterName: string;
      maxSeverity: number;
    }> | null;
    processes?: {
      __typename?: 'ResponseSeverityProcesses';
      rows: Array<string>;
      totalCount: number;
    } | null;
  };
};

const GetSeverityAllDocument = gql`
  subscription getSeverityAll($filters: SeverityInput!) {
    severity(filters: $filters) {
      byFilters {
        count
        filterName
        maxSeverity
      }
      byRanges {
        count
        filterName
        maxSeverity
      }
      processes {
        rows
        totalCount
      }
    }
  }
`;

export function useGetSeverityAllSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    GetSeverityAllSubscription,
    GetSeverityAllSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<GetSeverityAllSubscription, GetSeverityAllSubscriptionVariables>(
    GetSeverityAllDocument,
    options,
  );
}
