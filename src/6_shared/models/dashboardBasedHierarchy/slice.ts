import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { HierarchyLevel } from '6_shared/api/hierarchy/types';
import { AggregationType } from '6_shared/api/clickhouse/constants';
import {
  DBHHierarchyModel,
  DBHLeftAreaType,
  InventoryAndHierarchyObjectTogether,
  KpiSettings,
  MapColumnsSelectData,
  SortValueType,
} from './types';
import { IObjectTypeCustomizationParams } from '../inventoryMapWidget/types';

interface IInitialState {
  leftAreaType: DBHLeftAreaType;

  dateRange: DateRange<Dayjs> | [null, null];

  selectedHierarchy: DBHHierarchyModel | null;
  selectHierarchyNodeObject?: InventoryAndHierarchyObjectTogether | null;
  hierarchyBreadcrumbs: InventoryAndHierarchyObjectTogether[];
  selectedNoVirtualHierarchyObject: InventoryAndHierarchyObjectTogether | null;

  currentHierarchyLevelId: number | null;
  hierarchyLevels: HierarchyLevel[];

  selectedEventColumn: MapColumnsSelectData | undefined;

  kpiData: KpiSettings;
  objectTypeCustomizationParams: Record<number, IObjectTypeCustomizationParams>; // objectType сustomization params
  legendCustomizationParams: Record<number, IObjectTypeCustomizationParams>; // legend сustomization params

  mainSpeedometerAggregationType: AggregationType;

  selectedClusterSort: SortValueType | null;
  searchDashboard: string;

  topLevelAggregationKPIData: Record<string, { min: number; max: number; value: number }>;

  isMultipleSelectMode: boolean;
  multipleSelectedObjects: InventoryAndHierarchyObjectTogether[];
}

const initialState: IInitialState = {
  leftAreaType: 'root',

  dateRange: [null, null],

  selectedHierarchy: null,
  selectHierarchyNodeObject: null,
  hierarchyBreadcrumbs: [],
  selectedNoVirtualHierarchyObject: null,

  currentHierarchyLevelId: null,
  hierarchyLevels: [],

  kpiData: {},
  selectedEventColumn: undefined,
  objectTypeCustomizationParams: {},
  legendCustomizationParams: {},

  mainSpeedometerAggregationType: 'SUM' as const,

  selectedClusterSort: null,

  searchDashboard: '',

  topLevelAggregationKPIData: {},

  isMultipleSelectMode: false,
  multipleSelectedObjects: [],
};

const dashboardBasedHierarchySlice = createSlice({
  name: 'dashboardBasedHierarchy',
  initialState,
  reducers: {
    setLeftAreaType(s, a: PayloadAction<DBHLeftAreaType>) {
      s.leftAreaType = a.payload;
    },
    setDateRange(s, a: PayloadAction<DateRange<Dayjs>>) {
      s.dateRange = a.payload;
    },
    setSelectedHierarchy(s, a: PayloadAction<DBHHierarchyModel | null>) {
      s.selectedHierarchy = a.payload;
    },
    setSelectHierarchyNodeObject(s, a: PayloadAction<InventoryAndHierarchyObjectTogether | null>) {
      s.selectHierarchyNodeObject = a.payload;
    },
    setHierarchyLevels(s, a: PayloadAction<HierarchyLevel[]>) {
      s.hierarchyLevels = a.payload;
    },
    setCurrentHierarchyLevelId(s, a: PayloadAction<number | null>) {
      s.currentHierarchyLevelId = a.payload;
    },
    setHierarchyBreadcrumbs(
      s,
      a: PayloadAction<InventoryAndHierarchyObjectTogether | InventoryAndHierarchyObjectTogether[]>,
    ) {
      if (Array.isArray(a.payload)) {
        s.hierarchyBreadcrumbs = a.payload;
      } else {
        const hasObject = s.hierarchyBreadcrumbs.find((el) => {
          const { hierarchy_id, id } = a.payload as InventoryAndHierarchyObjectTogether;
          return el.id === id && el.hierarchy_id === hierarchy_id;
        });
        if (!hasObject) s.hierarchyBreadcrumbs.push(a.payload);
      }
      const lastHierarchy = s.hierarchyBreadcrumbs[s.hierarchyBreadcrumbs.length - 1];
      if (!lastHierarchy || lastHierarchy.parent_id === 'root') {
        s.selectHierarchyNodeObject = null;
        s.hierarchyBreadcrumbs = [];
      } else {
        s.selectHierarchyNodeObject = lastHierarchy;

        if (lastHierarchy.object_id == null) {
          s.selectedNoVirtualHierarchyObject = lastHierarchy;
        } else {
          s.selectedNoVirtualHierarchyObject = null;
        }
      }
    },
    setSelectedEventColumn(s, a: PayloadAction<MapColumnsSelectData>) {
      s.selectedEventColumn = a.payload;
    },
    setKpiData(s, a: PayloadAction<KpiSettings>) {
      s.kpiData = a.payload;
    },
    setObjectTypeCustomizationParams(
      s,
      a: PayloadAction<Record<number, IObjectTypeCustomizationParams>>,
    ) {
      s.objectTypeCustomizationParams = a.payload;
    },
    setLegendCustomizationParams(
      s,
      a: PayloadAction<Record<number, IObjectTypeCustomizationParams>>,
    ) {
      s.legendCustomizationParams = a.payload;
    },
    setMainSpeedometerAggregationType(s, a: PayloadAction<AggregationType>) {
      s.mainSpeedometerAggregationType = a.payload;
    },
    setSelectedClusterSort(s, a: PayloadAction<SortValueType | null>) {
      s.selectedClusterSort = a.payload;
    },
    setSearchDashboard: (state, { payload }: PayloadAction<string>) => {
      state.searchDashboard = payload;
    },
    setTopLevelAggregationKPIData(
      s,
      a: PayloadAction<Record<string, { min: number; max: number; value: number }>>,
    ) {
      s.topLevelAggregationKPIData = a.payload;
    },
    setIsMultipleSelectMode(s, a: PayloadAction<boolean>) {
      s.isMultipleSelectMode = a.payload;
    },
    setMultipleSelectedObjects(s, a: PayloadAction<InventoryAndHierarchyObjectTogether[]>) {
      s.multipleSelectedObjects = a.payload;
    },

    restore: (_, { payload }: PayloadAction<IInitialState>) => payload,
  },
});

export const dashboardBasedHierarchyActions = dashboardBasedHierarchySlice.actions;
export const dashboardBasedHierarchyReducer = dashboardBasedHierarchySlice.reducer;
export const dashboardBasedHierarchySliceName = dashboardBasedHierarchySlice.name;
