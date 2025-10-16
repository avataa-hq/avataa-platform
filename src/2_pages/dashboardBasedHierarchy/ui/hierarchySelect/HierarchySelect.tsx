import { MenuItem, Select, Typography } from '@mui/material';
import { useMemo } from 'react';
import { DBHHierarchyModel, searchApiV2, useDashboardBasedHierarchy } from '6_shared';

const { useFindMoIdInHierarchiesQuery } = searchApiV2;

interface IProps {
  hierarchies?: DBHHierarchyModel[];
}

export const HierarchySelect = ({ hierarchies }: IProps) => {
  const {
    selectedHierarchy,
    selectHierarchyNodeObject,
    setSelectedHierarchy,
    setSelectHierarchyNodeObject,
    setLeftAreaType,
    setHierarchyBreadcrumbs,
    setCurrentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const objectId = selectHierarchyNodeObject?.object_id
    ? +selectHierarchyNodeObject.object_id
    : null;

  const { data: hierarchyWithNeededMoId, isFetching } = useFindMoIdInHierarchiesQuery(
    { mo_id: objectId! },
    { skip: !objectId },
  );

  const correctList = useMemo(() => {
    return hierarchies?.map((h) => {
      const obj = hierarchyWithNeededMoId?.find(
        ({ hierarchy_id }) => +hierarchy_id === +h.hierarchy_id,
      );

      if (obj && selectHierarchyNodeObject?.object_id != null) {
        return { ...h, canSwitch: true, switchLevelId: obj?.level_id ?? null };
      }
      return { ...h, canSwitch: false, switchLevelId: null };
    });
  }, [hierarchies, hierarchyWithNeededMoId, selectHierarchyNodeObject]);

  return (
    <Select
      data-testid="dashboard-page__hierarchy-select"
      disabled={isFetching}
      fullWidth
      value={selectedHierarchy?.key ?? ''}
      sx={{ height: '36px' }}
      onChange={({ target: { value } }) => {
        const neededHierarchy = hierarchies?.find((el) => el.key === value);
        if (!neededHierarchy) return;
        setSelectedHierarchy(neededHierarchy);
      }}
    >
      {correctList?.map((item) => (
        <MenuItem
          sx={{ display: 'flex', justifyContent: 'space-between' }}
          key={item.hierarchy_id}
          value={item.key}
          onClick={() => {
            if (item.canSwitch && selectHierarchyNodeObject) {
              setHierarchyBreadcrumbs({
                ...selectHierarchyNodeObject,
                hierarchy_id: +item.hierarchy_id,
                level_id: item?.switchLevelId ?? selectHierarchyNodeObject?.level_id,
              });
              if (item.switchLevelId) {
                setCurrentHierarchyLevelId(+item.switchLevelId);
              }
            } else {
              setSelectHierarchyNodeObject(null);
              setHierarchyBreadcrumbs([]);
              setLeftAreaType('root');
              setCurrentHierarchyLevelId(null);
            }
          }}
        >
          <Typography color={item.canSwitch ? 'primary' : 'inherit'}>{item.key}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};
