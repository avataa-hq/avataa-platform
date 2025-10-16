import { ListItemButton, List, ListItem, LinearProgress } from '@mui/material';
import { Box, parameterTypesApi, useSettingsObject } from '6_shared';
import { useEffect, useMemo } from 'react';
import { IGroup } from '../../utilities/interface';
import {
  ObjectGroupsStyled,
  ListItemContainer,
  GroupName,
  GroupCount,
} from './ObjectGroups.styled';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

const ObjectGroups = () => {
  const { objType, arrayOfGroupsObjects, nameOfSelectedGroup, setNameOfSelectedGroup } =
    useSettingsObject();

  const { data: objectTypeItemJSON, isFetching: isParamFetching } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    {
      skip: !objType?.id,
    },
  );

  useEffect(() => {
    if (arrayOfGroupsObjects.length > 0) {
      setNameOfSelectedGroup(arrayOfGroupsObjects[0].group);
    }
  }, [arrayOfGroupsObjects]);

  const numberOfValuesInGroup = useMemo(() => {
    const counts: Record<string, number> = {};
    objectTypeItemJSON?.forEach((item) => {
      const group = item.group || 'No group';
      counts[group] = (counts[group] || 0) + 1;
    });
    return counts;
  }, [objectTypeItemJSON]);

  return (
    <ObjectGroupsStyled>
      <List className="group-list">
        {isParamFetching ? (
          <>
            <Box className="loading-text">Loading...</Box>
            <LinearProgress sx={{ marginX: '20px' }} />
          </>
        ) : (
          <>
            {arrayOfGroupsObjects.map((itemGroup: IGroup) => (
              <ListItem key={itemGroup.id} className="group-item" disablePadding>
                <ListItemButton
                  className={
                    itemGroup.group === nameOfSelectedGroup
                      ? 'group-item__btn--active'
                      : 'group-item__btn'
                  }
                  onClick={() => {
                    setNameOfSelectedGroup(itemGroup.group);
                  }}
                >
                  <ListItemContainer>
                    <GroupName>{!itemGroup.group ? '_Blank' : itemGroup.group}</GroupName>
                    <GroupCount>{` (${numberOfValuesInGroup[itemGroup.group]}) `}</GroupCount>
                  </ListItemContainer>
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </ObjectGroupsStyled>
  );
};

export default ObjectGroups;
