import { createApi } from '@reduxjs/toolkit/query/react';
import {
  GetExportedObjectsBody,
  GetExportedProcessesBody,
  IChildNodesOfParentIdWithFilterConditionBody,
  IChildNodesOfParentIdWithFilterConditionModel,
  IHierarchyAndInventoryResultBody,
  IHierarchyAndInventoryResultModel,
  IncMoLinkModelForObjectsList,
  IPointsEvenlyBody,
  IPointsEvenlyModel,
  ObjectByFilters,
  OutMoLinkModel,
  SearchHierarchyBody,
  SearchHierarchyModel,
  SearchHierarchyModelItem,
} from '6_shared';
import { generateDynamicBaseQuery, setDefaultApiSettings } from '../config';
import {
  IInventorySearchObjectModel,
  IGetObjectsByCoordsBody,
  SearchForObjectsInSpecificTmoParams,
  SearchObjectModel,
  IGetInventoryObjectsByValueRequestBody,
  IGetInventoryObjectsByValueModel,
  IGetObjectsByFiltersBody,
  IGetObjectsByFiltersModel,
  MoLinkInfoParams,
  GetOperatorType,
  IGetAvailableSearchOperatorsForSpecialMoAttrOrTprmBody,
  IGetAvailableSearchOperatorsForSpecialMoAttrOrTprmModel,
  MoLinkInfoResponse,
  IGetObjectsByNameWithMisspelledWordsOrTypoMistakesBody,
  IGetObjectsByNameWithMisspelledWordsOrTypoMistakesModel,
} from './types';
import {
  GetSeverityByFiltersBody,
  GetSeverityByRangesBody,
  GetSeverityProcessBody,
  SeverityCount,
  SeverityProcessModel,
} from '../zeebe';
import { transformExport } from '../utils/transformExport';
import { HierarchyObject } from '../hierarchy/types';

const dynamicBaseQuery = generateDynamicBaseQuery('_apiBaseSearchV2');

const searchApiOptions = { apiName: 'searchApi' };

const joinTmo = (tmoIds?: number[]) => {
  if (!tmoIds || !tmoIds.length) return `inventory/get_objects_by_coords`;
  const queryTmo = tmoIds.reduce((acc, item) => {
    // eslint-disable-next-line no-param-reassign
    acc += `tmo_ids=${item}&`;
    return acc;
  }, ``);
  return `inventory/get_objects_by_coords?${queryTmo}`;
};

export const searchApiV2 = createApi({
  ...setDefaultApiSettings('inventorySearch', dynamicBaseQuery),
  endpoints: (builder) => ({
    getObjectsByCoords: builder.query<
      { objects: IInventorySearchObjectModel[] },
      IGetObjectsByCoordsBody
    >({
      query: ({ tmo_ids, signal, ...params }) => ({
        url: joinTmo(tmo_ids),
        params,
        signal,
      }),
      providesTags: [{ type: 'Objects', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    globalSearchForObjectsInTheSpecialTmoScope: builder.query<
      { objects: SearchObjectModel[]; total_hit: number },
      SearchForObjectsInSpecificTmoParams
    >({
      query: (params) => ({
        url: 'inventory/global_search_for_objects_in_the_special_tmo_scope',
        params,
      }),
      providesTags: [{ type: 'Objects', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    getInventoryObjectsByValue: builder.query<
      IGetInventoryObjectsByValueModel,
      IGetInventoryObjectsByValueRequestBody
    >({
      query: ({ search_value, tmo_ids = [], signal, ...params }) => {
        const tmoIdsParams = tmo_ids.map((id) => `tmo_ids=${id}`).join('&');

        return {
          url: `inventory/get_inventory_objects_by_value?search_value=${search_value}&${tmoIdsParams}`,
          params,
          signal,
        };
      },
      keepUnusedDataFor: 0,
      extraOptions: searchApiOptions,
    }),
    getObjectsByFilters: builder.query<IGetObjectsByFiltersModel, IGetObjectsByFiltersBody>({
      query: (body) => ({
        url: 'inventory/get_inventory_objects_by_filters',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Objects', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    getMoLinkInfo: builder.query<MoLinkInfoResponse, MoLinkInfoParams>({
      query: ({ id, ...params }) => ({
        url: `inventory/mo_link_info?mo_id=${id}`,
        params,
      }),
      providesTags: [{ type: 'LinkedObjects', id: 'LIST' }],
      extraOptions: searchApiOptions,
    }),
    getSeverityByFilters: builder.query<SeverityCount[], GetSeverityByFiltersBody[]>({
      query: (body) => ({
        url: 'severity/by_filters',
        method: 'POST',
        body,
      }),
      extraOptions: searchApiOptions,
    }),
    getSeverityByRanges: builder.query<SeverityCount[], GetSeverityByRangesBody>({
      query: (body) => ({
        url: 'severity/by_ranges',
        method: 'POST',
        body,
      }),
      // providesTags: () => [{ type: 'Severity', id: 'LIST' }],
      extraOptions: searchApiOptions,
    }),
    getSeverityProcesses: builder.query<SeverityProcessModel, GetSeverityProcessBody>({
      query: (body) => ({
        url: 'severity/processes',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'Processes', id: 'LIST' }],
      keepUnusedDataFor: 5,
      extraOptions: searchApiOptions,
    }),
    // helpers
    getOperatorType: builder.query<GetOperatorType, void>({
      query: () => ({
        url: 'inventory/operator_type_helper',
      }),
    }),

    getAvailableSearchOperatorsForSpecialMoAttrOrTprm: builder.query<
      IGetAvailableSearchOperatorsForSpecialMoAttrOrTprmModel,
      IGetAvailableSearchOperatorsForSpecialMoAttrOrTprmBody
    >({
      query: (params) => ({
        url: 'inventory/get_available_search_operators_for_special_mo_attr_or_tprm',
        params,
      }),
      extraOptions: searchApiOptions,
    }),
    getExportedProcesses: builder.query<void, GetExportedProcessesBody>({
      query: (body) => ({
        url: 'severity/export',
        method: 'POST',
        body,
        responseHandler: (response) => transformExport(response, 'pm_report', body.file_type),
        cache: 'no-cache',
      }),
      extraOptions: searchApiOptions,
    }),
    getExportedObjects: builder.query<void, GetExportedObjectsBody>({
      query: (body) => ({
        url: 'inventory/export',
        method: 'POST',
        body,
        responseHandler: (response) => transformExport(response, 'pm_report', body.file_type),
        cache: 'no-cache',
      }),
      extraOptions: searchApiOptions,
    }),
    getObjectsByIds: builder.query<ObjectByFilters[], number[]>({
      query: (body) => ({
        url: 'inventory/get_objects_by_ids',
        method: 'POST',
        body,
        cache: 'no-cache',
      }),
      extraOptions: searchApiOptions,
    }),
    getChildrenGroupedByTmo: builder.query<Record<string, number>, number>({
      query: (id) => ({
        url: `inventory/get_children_grouped_by_tmo/${id}`,
      }),
      extraOptions: searchApiOptions,
    }),

    // ============================ HIERARCHY =======================================
    getAllHierarchy: builder.query<SearchHierarchyModel, SearchHierarchyBody>({
      query: (params) => ({
        url: `ms_hierarchy/hierarchy/`,
        params,
        providesTags: [{ type: 'SearchHierarchy', id: 'V2' }],
        extraOptions: searchApiOptions,
      }),
    }),
    getHierarchyById: builder.query<SearchHierarchyModelItem, number>({
      query: (hierarchyId) => ({
        url: `ms_hierarchy/hierarchy/${hierarchyId}`,
        providesTags: [{ type: 'SearchHierarchy', id: 'V2' }],
        extraOptions: searchApiOptions,
      }),
    }),
    getHierarchyAndInventoryResultByFilters: builder.query<
      IHierarchyAndInventoryResultModel,
      IHierarchyAndInventoryResultBody
    >({
      query: (body) => ({
        url: 'ms_hierarchy/hierarchy/get_hierarchy_and_inventory_results_by_filter',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'SearchHierarchy', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    getHierarchyAndInventoryResults: builder.query<
      IHierarchyAndInventoryResultModel,
      IHierarchyAndInventoryResultBody
    >({
      query: (body) => ({
        url: 'ms_hierarchy/hierarchy/get_hierarchy_and_inventory_results',
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'SearchHierarchy', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    getChildNodesOfParentIdWithFilterCondition: builder.query<
      IChildNodesOfParentIdWithFilterConditionModel,
      IChildNodesOfParentIdWithFilterConditionBody
    >({
      query: ({ hierarchy_id, parent_id, hierarchy_filter, aggregation_type, ...body }) => ({
        url: `ms_hierarchy/hierarchy/${hierarchy_id}/parent/${parent_id}/with_conditions`,
        method: 'POST',
        body,
        params: { hierarchy_filter, aggregation_type },
      }),
      providesTags: [{ type: 'SearchHierarchy', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    findMoIdInHierarchies: builder.query<HierarchyObject[], { mo_id: number }>({
      query: (body) => ({
        url: `ms_hierarchy/hierarchy/find_mo_id_in_hierarchies`,
        method: 'POST',
        body,
      }),
      providesTags: [{ type: 'SearchHierarchy', id: 'V2' }],
      extraOptions: searchApiOptions,
    }),
    // ============================ HIERARCHY INFO =======================================
    getChildrenObjectIdsOfParticularHierarchy: builder.query<number[], string[]>({
      query: (hierarchyIds) => ({
        url: 'ms_hierarchy/info/children_mo_ids_of_particular_hierarchy',
        params: { hierarchy_ids: hierarchyIds },
        // providesTags: [{ type: 'searchHierarchy', id: 'OBJECT' }],
        extraOptions: searchApiOptions,
      }),
    }),
    getCountChildrenWithLifecycleAndMaxSeverityByHierarchyIds: builder.query<number[], string[]>({
      query: (hierarchyIds) => ({
        url: 'ms_hierarchy/info/count_children_with_lifecycle_and_max_severity',
        params: { hierarchy_ids: hierarchyIds },
        // providesTags: [{ type: 'searchHierarchy', id: 'OBJECT' }],
        extraOptions: searchApiOptions,
      }),
    }),
    getObjectsByNameWithMisspelledWordsOrTypoMistakes: builder.query<
      IGetObjectsByNameWithMisspelledWordsOrTypoMistakesModel,
      IGetObjectsByNameWithMisspelledWordsOrTypoMistakesBody
    >({
      query: (body) => ({
        url: 'inventory/get_objects_by_name_with_misspelled_words_or_typo_mistakes',
        method: 'POST',
        body,
        extraOptions: searchApiOptions,
      }),
    }),
    lineUpThePointsEvenlyBetweenStartPointAndEndPoint: builder.mutation<
      IPointsEvenlyModel[],
      IPointsEvenlyBody
    >({
      query: (body) => ({
        url: 'inventory/reform_all_connected_points_between_start_point_and_end_point_into_line',
        method: 'POST',
        body,
        extraOptions: searchApiOptions,
      }),
    }),
    getOutMoLinks: builder.query<OutMoLinkModel, number[]>({
      query: (body) => ({
        url: 'inventory/out_mo_link',
        method: 'POST',
        body,
        keepUnusedDataFor: 0,
        extraOptions: searchApiOptions,
      }),
    }),
    getIncMoLinks: builder.query<IncMoLinkModelForObjectsList, number[]>({
      query: (body) => ({
        url: 'inventory/in_mo_link',
        method: 'POST',
        body,
        keepUnusedDataFor: 0,
        extraOptions: searchApiOptions,
      }),
    }),
  }),
});
