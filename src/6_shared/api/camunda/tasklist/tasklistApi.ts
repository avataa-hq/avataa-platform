import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import camunda from 'camunda';

import config from 'config';
import { gql } from 'graphql-request';
import { Task } from './types';

const baseQuery = graphqlRequestBaseQuery({
  url: config._camundaTasklist,
  prepareHeaders: (headers) => {
    const camundaToken = camunda.getToken();
    if (camundaToken) {
      headers.set('Authorization', `${camundaToken.token_type} ${camundaToken.access_token}`);
    }
    return headers;
  },
});

export const tasklistApi = createApi({
  reducerPath: 'tasklist',
  tagTypes: ['Task'],
  baseQuery,
  keepUnusedDataFor: 600,
  refetchOnMountOrArgChange: 600,
  endpoints: (builder) => ({
    getTasksByProcessDefinition: builder.query<
      {
        tasks: Pick<
          Task,
          'id' | 'name' | 'assignee' | 'creationTime' | 'completionTime' | 'processDefinitionId'
        >[];
      },
      string
    >({
      query: (processDefinitionId) => ({
        document: gql`
          {
            tasks(query: { processDefinitionId: "${processDefinitionId}" }) {
              id
              name
              assignee
              creationTime
              completionTime
              processDefinitionId
            }
          }
        `,
      }),
    }),
  }),
});
