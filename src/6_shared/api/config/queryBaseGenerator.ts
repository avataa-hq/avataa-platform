import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import keycloak from 'keycloak';
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';
import { ConfigType } from '6_shared/models';

type CustomHeadersFunction = (
  headers: Headers,
  api: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>,
) => MaybePromise<void | Headers>;

const generateBaseQuery = (
  baseUrl: string,
  customHeaders?: CustomHeadersFunction | null,
): BaseQueryFn<any, unknown, any, {}, FetchBaseQueryMeta> => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, api) => {
      if (customHeaders) {
        return customHeaders(headers, api);
      }
      if (customHeaders === null) {
        return headers;
      }
      const { token } = keycloak;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
};

function generateBaseUrlFromTemplate(template: string, config: ConfigType): string {
  const regex = /{([^}]+)}/g;
  let baseUrl = template;

  let match = regex.exec(template);
  while (match !== null) {
    const [placeholder, configKey] = match;
    if (configKey in config) {
      baseUrl = baseUrl.replace(placeholder, config[configKey as keyof ConfigType]);
    } else {
      throw new Error(`Key ${configKey} not found in config`);
    }
    match = regex.exec(template);
  }

  return baseUrl;
}

export const generateDynamicBaseQuery = (
  apiBase: keyof ConfigType | Array<keyof ConfigType>,
  queryStructure?: string,
  customHeaders?: CustomHeadersFunction | null,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> => {
  return async (args, store, extraOptions) => {
    if (!apiBase) {
      return {
        error: {
          status: 400,
          statusText: 'Bad Request',
          data: 'No apiBase provided',
        },
      };
    }

    let baseUrl: string = '';

    if (typeof apiBase === 'string' && apiBase in (store.getState() as RootState).config.config) {
      baseUrl = (store.getState() as RootState).config.config[apiBase];
    } else if (
      Array.isArray(apiBase) &&
      apiBase.every((key) => key in (store.getState() as RootState).config.config) &&
      queryStructure
    ) {
      const { config } = (store.getState() as RootState).config;
      baseUrl = generateBaseUrlFromTemplate(queryStructure, config);
    }

    const baseQuery = generateBaseQuery(baseUrl, customHeaders);

    const result = await baseQuery(args, store, extraOptions);
    return result;
  };
};
