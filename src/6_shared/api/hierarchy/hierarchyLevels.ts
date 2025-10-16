import { hierarchyBaseApi, hierarchyApiOptions } from './hierarchyApi';
import { HierarchyLevel, NewHierarchyLevel } from './types';

export const hierarchyLevels = hierarchyBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getLevels: build.query<HierarchyLevel[], number>({
      query: (hierarchyId) => `hierarchy/${hierarchyId}/level`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'HierarchyLevel' as const,
                id,
              })),
              { type: 'HierarchyLevel', id: 'LIST' },
            ]
          : [{ type: 'HierarchyLevel', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    addLevel: build.mutation<HierarchyLevel, { body: NewHierarchyLevel; hierarchyId: number }>({
      query: ({ body, hierarchyId }) => ({
        url: `hierarchy/${hierarchyId}/level`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HierarchyLevel', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    updateLevel: build.mutation<
      HierarchyLevel,
      {
        body: NewHierarchyLevel;
        hierarchyId: number;
        levelId: number;
      }
    >({
      query: ({ body, hierarchyId, levelId }) => ({
        url: `hierarchy/${hierarchyId}/level/${levelId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'HierarchyLevel', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
    deleteLevel: build.mutation<null, { hierarchyId: number; levelId: number }>({
      query: ({ hierarchyId, levelId }) => ({
        url: `hierarchy/${hierarchyId}/level/${levelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HierarchyLevel', id: 'LIST' }],
      extraOptions: hierarchyApiOptions,
    }),
  }),
});
