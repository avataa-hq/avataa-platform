import { ReactNode } from 'react';
import { HierarchyObject } from '6_shared/api/hierarchy/types';

export interface IHierarchyChildrenData {
  childrenItems?: HierarchyObject[];
  isLoadingChildrenItems?: boolean;
  isErrorChildrenItems?: boolean;
  errorMessageChildrenItems?: string;

  getChildRightSideElements?: (item: HierarchyObject) => ReactNode;
  getChildLeftSideElements?: (item: HierarchyObject) => ReactNode | JSX.Element;
}
export interface IHierarchyParentData {
  parentItems?: HierarchyObject[];
  isLoadingParentsItems?: boolean;
  isErrorParentsItems?: boolean;
  errorMessageParentsItems?: string;

  getParentRightSideElements?: (item: HierarchyObject) => ReactNode;
}
