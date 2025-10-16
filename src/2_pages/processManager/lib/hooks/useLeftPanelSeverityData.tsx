import { useCallback, useEffect, useMemo, useState } from 'react';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import { ItemRightSideElement } from '4_features';
import {
  IFilterSetModel,
  InventoryObjectTypesModel,
  SeverityCount,
  useHierarchy,
  useProcessManager,
} from '6_shared';
import { Typography } from '@mui/material';
import { getColorForSeverity } from '5_entites';

interface IProps {
  severityData?: SeverityCount[];
  isErrorSeverityData?: boolean;
  isFetchingSeverityData?: boolean;
  severityId?: number | null;
}

export const useLeftPanelSeverityData = ({
  isFetchingSeverityData,
  severityData,
  isErrorSeverityData,
  severityId,
}: IProps) => {
  const { parentItems, selectedParentId } = useHierarchy();
  const { colorRangesData } = useProcessManager();

  // region GET SEVERITY FOR BREADCRUMBS FOLDERS
  const [breadcrumbsSeverity, setBreadcrumbsSeverity] = useState<SeverityCount[]>([]);

  const currentColorRanges = useMemo(
    () => colorRangesData?.find(({ tprmId }) => +tprmId === severityId),
    [colorRangesData, severityId],
  );

  useEffect(() => {
    if (parentItems.length <= 1) setBreadcrumbsSeverity([]);
  }, [parentItems]);
  // endregion

  const severityCountByName = useMemo(() => {
    if (!severityData) return null;
    return severityData.reduce((acc, item) => {
      if (item.filter_name === selectedParentId) {
        setBreadcrumbsSeverity((p) => [...p, item]);
      }

      acc[item.filter_name] = { ...item };
      return acc;
    }, {} as Record<string, SeverityCount>);
  }, [severityData, selectedParentId]);

  // region SEVERITY FOR CHILDREN NODES
  const getChildRightSideElements = useCallback(
    (item: HierarchyObject | InventoryObjectTypesModel) => {
      const count = (item as HierarchyObject)?.aggregation_doc_count ?? null;
      const maxSeverity = (item as HierarchyObject)?.aggregation_value ?? 0;
      const color = getColorForSeverity(maxSeverity, currentColorRanges);

      if (!count) return <ItemRightSideElement />;
      return (
        <ItemRightSideElement>
          <Typography>{count}</Typography>
          <FiberManualRecordRoundedIcon fontSize="small" sx={{ color: `${color}` }} />
        </ItemRightSideElement>
      );
    },
    [currentColorRanges],
  );
  // endregion

  // region SEVERITY FOR BREADCRUMBS
  const getParentRightSideElements = useCallback(
    (item: HierarchyObject | InventoryObjectTypesModel) => {
      // const currentSeverityParams = breadcrumbsSeverity.find((i) => i.filter_name === item.id);
      // if (!currentSeverityParams) return <ItemRightSideElement />;
      // const { max_severity, count } = currentSeverityParams;
      // const color = getColorForSeverity(max_severity, currentColorRanges);
      // return (
      //   <ItemRightSideElement>
      //     {count}
      //     <FiberManualRecordRoundedIcon fontSize="small" sx={{ color: `${color}` }} />
      //   </ItemRightSideElement>
      // );
    },
    [],
  );
  // endregion

  const getFilterItemRightElement = (item: IFilterSetModel) => {
    const tmoId = item.tmo_info.id;
    const colorRangesForTmoId = colorRangesData?.find((range) => +range.tmoId === tmoId);
    const count = severityCountByName?.[item.name]?.count || 0;
    const maxSeverity = severityCountByName?.[item.name]?.max_severity || 0;
    const color = getColorForSeverity(maxSeverity, colorRangesForTmoId);
    return (
      <ItemRightSideElement>
        <Typography>{count}</Typography>
        <FiberManualRecordRoundedIcon fontSize="small" sx={{ color }} />
      </ItemRightSideElement>
    );
  };

  return {
    getParentRightSideElements,
    getChildRightSideElements,
    getFilterItemRightElement,
  };
};
