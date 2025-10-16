import { createApi } from '@reduxjs/toolkit/query/react';
import { generateDynamicBaseQuery, setDefaultApiSettings } from '../config';

const dynamicBaseQuery = generateDynamicBaseQuery('_summaryApiBase');

export const summaryApi = createApi({
  ...setDefaultApiSettings('summaryApi', dynamicBaseQuery),
  endpoints: (builder) => ({
    summarizeText: builder.query<Uint8Array[], FormData>({
      query: (body) => ({
        url: 'summarize',
        method: 'POST',
        body,
        responseType: 'stream',
        cache: 'no-cache',
        responseHandler: async (response) => {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Failed to get reader for response body');
          }

          const chunks: Uint8Array[] = [];
          try {
            while (true) {
              // eslint-disable-next-line no-await-in-loop
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
            }
          } catch (error) {
            console.error('Error reading stream:', error);
            throw error;
          }

          return chunks;
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});
