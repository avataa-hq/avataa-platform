import { useEffect, useState } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ActionTypes, searchApiV2, useHierarchy } from '6_shared';
import { Hierarchy } from '6_shared/api/hierarchy/types';

const { useGetAllHierarchyQuery } = searchApiV2;

interface IProps {
  withLifecycle?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const HierarchySelect = ({ withLifecycle, permissions }: IProps) => {
  const {
    activeHierarchy,
    searchUsingHierarchy,

    setResetParentItems,
    setActiveHierarchy,
    setSelectedIHierarchyItem,
    setHierarchyFilter,
  } = useHierarchy();

  const [hierarchyName, setHierarchyName] = useState('');

  const { data: listOfHierarchies } = useGetAllHierarchyQuery({ with_lifecycle: withLifecycle });
  const [hierarchiesInSelect, setHierarchiesInSelect] = useState<Hierarchy[]>([]);

  useEffect(() => {
    if (!listOfHierarchies) return;
    setHierarchiesInSelect(listOfHierarchies.items);
  }, [listOfHierarchies]);

  useEffect(() => {
    if (!searchUsingHierarchy) return;

    const selectedHierarchy = hierarchiesInSelect.find(
      (hierarchy) => hierarchy.name.toLowerCase() === searchUsingHierarchy.toLocaleLowerCase(),
    );
    if (selectedHierarchy) {
      setActiveHierarchy(selectedHierarchy);
    }
  }, [hierarchiesInSelect, searchUsingHierarchy]);

  useEffect(() => {
    if (listOfHierarchies && listOfHierarchies.items.length > 0) {
      const hierarchyExists = listOfHierarchies.items.some(
        (hierarchy) => hierarchy.id === activeHierarchy?.id,
      );

      if (!activeHierarchy || !hierarchyExists) {
        setActiveHierarchy(listOfHierarchies.items[0]);
      }
    }
  }, [activeHierarchy, listOfHierarchies]);

  const handleChange = (event: SelectChangeEvent) => {
    setHierarchyFilter(null);

    const selectedHierarchy = hierarchiesInSelect.find(
      (hierarchy) => hierarchy.name === event.target.value,
    );

    if (selectedHierarchy) {
      setResetParentItems();
      setActiveHierarchy(selectedHierarchy);
      setSelectedIHierarchyItem(null);
    }
  };

  useEffect(() => {
    if (activeHierarchy) setHierarchyName(activeHierarchy.name);
  }, [activeHierarchy]);

  return (
    <Select
      sx={{ margin: '0.5rem 0' }}
      disabled={!(permissions?.view ?? true)}
      value={hierarchyName}
      onChange={handleChange}
      data-testid="left-panel__hierarchy-select"
    >
      {hierarchiesInSelect.map((item) => (
        <MenuItem key={item.id} value={item.name}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
};
