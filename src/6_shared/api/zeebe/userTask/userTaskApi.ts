import { zeebeApi, zeebeApiOptions } from '../zeebeApi';
import {
  IClaimUserTaskBody,
  ICompleteUserTaskBody,
  IGetActiveElementsBody,
  IGetActiveElementsResponse,
  IGetIncidentsBody,
  IGetIncidentsResponse,
  IGetProcessHistoryBody,
  IGetProcessHistoryResponse,
  IGetUserTaskBody,
  IGetUserTaskHistoryBody,
  IGetUserTaskHistoryResponse,
  IGetUserTaskResponse,
} from './types';

export const userTaskApi = zeebeApi.injectEndpoints({
  endpoints: (build) => ({
    getUserTask: build.query<IGetUserTaskResponse, IGetUserTaskBody>({
      query: (body) => ({
        url: 'task_router/search_user_task',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),
    completeUserTask: build.mutation<void, ICompleteUserTaskBody>({
      query: (body) => ({
        url: 'task_router/complete_user_task',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),

    claimUserTask: build.mutation<void, IClaimUserTaskBody>({
      query: (body) => ({
        url: 'task_router/claim_user_task',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),

    unclaimUserTask: build.mutation<void, { user_task_key: number }>({
      query: (body) => ({
        url: 'task_router/unclaim_user_task',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),

    getActiveElements: build.query<IGetActiveElementsResponse, IGetActiveElementsBody>({
      query: (body) => ({
        url: 'task_router/get_active_elements',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),

    getIncidents: build.query<IGetIncidentsResponse, IGetIncidentsBody>({
      query: (body) => ({
        url: 'task_router/incidents',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),
    getProcessHistory: build.query<IGetProcessHistoryResponse, IGetProcessHistoryBody>({
      query: (body) => ({
        url: 'task_router/process_history',
        method: 'POST',
        body,
        cache: 'no-cache',
      }),
      providesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
      keepUnusedDataFor: 0,
    }),
    getUserTaskHistory: build.query<IGetUserTaskHistoryResponse, IGetUserTaskHistoryBody>({
      query: (body) => ({
        url: 'task_router/user_task_history',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'UserTask', id: 'LIST' }],
      extraOptions: zeebeApiOptions,
    }),
  }),
});
