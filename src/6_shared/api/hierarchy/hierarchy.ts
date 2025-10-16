import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { PromiseWithKnownReason } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { hierarchyBaseApi, hierarchyApiOptions, searchApiV2, IHerarchyModel } from '6_shared';

import {
  Hierarchy,
  HierarchyObject,
  HierarchyObjectWithChild,
  NewHierarchy,
  IChildNodesOfParentIdWithFilterConditionRqParam,
  HierarchyObjectWithConditionModel,
} from './types';

const refetchHierarchy = async (
  dispatch: ThunkDispatch<any, any, AnyAction>,
  queryFulfilled: PromiseWithKnownReason<{ data: any; meta: FetchBaseQueryMeta | undefined }, any>,
) => {
  try {
    await queryFulfilled;
    dispatch(searchApiV2.endpoints.getAllHierarchy.initiate({}, { forceRefetch: true }));
  } catch (error) {
    console.error(error);
  }
};

export const hierarchyApi = hierarchyBaseApi.injectEndpoints({
  endpoints: (build) => ({
    refresh: build.mutation({
      query: (hierarchyId) => ({
        url: 'refresh',
        method: 'POST',
        params: { hierarchy_id: hierarchyId },
      }),
      extraOptions: hierarchyApiOptions,
    }),
    getHierarchies: build.query<IHerarchyModel[], void>({
      query: () => `hierarchy`,
      extraOptions: hierarchyApiOptions,
    }),
    addHierarchy: build.mutation<Hierarchy, { body: NewHierarchy; signal?: AbortSignal }>({
      query: ({ body, signal }) => ({
        url: 'hierarchy',
        method: 'POST',
        body,
        signal,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await refetchHierarchy(dispatch, queryFulfilled);
      },
      extraOptions: hierarchyApiOptions,
    }),
    updateHierarchy: build.mutation<
      Hierarchy,
      { body: NewHierarchy; hierarchyId: number; signal?: AbortSignal }
    >({
      query: ({ body, hierarchyId, signal }) => ({
        url: `hierarchy/${hierarchyId}`,
        method: 'PUT',
        body,
        signal,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await refetchHierarchy(dispatch, queryFulfilled);
      },
      extraOptions: hierarchyApiOptions,
    }),
    deleteHierarchy: build.mutation<null, { hierarchyId: number; signal?: AbortSignal }>({
      query: ({ hierarchyId, signal }) => ({
        url: `hierarchy/${hierarchyId}`,
        method: 'DELETE',
        signal,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await refetchHierarchy(dispatch, queryFulfilled);
      },
      extraOptions: hierarchyApiOptions,
    }),
    getChildrenItem: build.query<HierarchyObjectWithChild[], string>({
      query: (parentId) => `hierarchy_child/${parentId}`,
      extraOptions: hierarchyApiOptions,
    }),
    getChildren: build.query<
      HierarchyObject[],
      { hierarchyId: number; parentId: string; with_lifecycle?: boolean }
    >({
      query: ({ hierarchyId, parentId, ...params }) => ({
        url: `hierarchy/${hierarchyId}/parent/${parentId}`,
        params,
      }),
      extraOptions: hierarchyApiOptions,
    }),
    getHierarchyObjectBreadcrumbs: build.query<HierarchyObject[], string>({
      query: (parentId) => `hierarchy_object/${parentId}/breadcrumbs`,
      extraOptions: hierarchyApiOptions,
    }),
    getHierarchyNodeNearestRealChildren: build.query<number[], string>({
      query: (parentId) => `hierarchy_object/${parentId}/mo_ids_of_first_real_children_nodes`,
      extraOptions: hierarchyApiOptions,
    }),
    getChildNodesOfParentIdWithFilterCondition: build.query<
      HierarchyObjectWithConditionModel[],
      IChildNodesOfParentIdWithFilterConditionRqParam
    >({
      query: ({ hierarchy_id, parent_id, filters, ...params }) => ({
        url: `hierarchy/${hierarchy_id}/parent/${parent_id}/with_conditions`,
        method: 'POST',
        params,
        body: filters,
      }),
      extraOptions: hierarchyApiOptions,
    }),
  }),
});
