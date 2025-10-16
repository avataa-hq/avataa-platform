import { createApi } from '@reduxjs/toolkit/query/react';

import { setDefaultApiSettings, generateDynamicBaseQuery } from '6_shared/api/config';
import { processDefinitionApi } from '../zeebe';

const dynamicBaseQuery = generateDynamicBaseQuery('_camundaZeebeClient', undefined, null);

export const zeebeClientApi = createApi({
  ...setDefaultApiSettings('camunda-zeebe-client', dynamicBaseQuery),
  keepUnusedDataFor: 600,
  refetchOnMountOrArgChange: 600,
  endpoints: (builder) => ({
    deployProcessDefinition: builder.mutation<void, FormData>({
      // TODO: Type the `body` for search params
      query: (body) => ({
        url: `connector`,
        formData: true,
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(processDefinitionApi.util.invalidateTags(['ProcessDefinition']));
          setTimeout(() => {
            dispatch(processDefinitionApi.util.invalidateTags(['ProcessDefinition']));
          }, 5000);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});
