import { IFilterSetModel, IHierarchyChildrenData, IHierarchyParentData } from '6_shared';

export interface IFilterSetModelItem extends IFilterSetModel {
  count?: number;
  color?: string;
  maxSeverity?: number;
}

export interface IHierarchyData {
  showHierarchyChildCount?: boolean;

  parentData?: IHierarchyParentData;
  childrenData?: IHierarchyChildrenData;
}
