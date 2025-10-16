import { useMemo, useState } from 'react';
import { CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Add, Delete, Settings, StarRounded, Visibility } from '@mui/icons-material';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import { LoadingContainer, searchApiV2, useTranslate } from '6_shared';
import { ListItem, ListItemIconButton } from './ListItem.styled';
import { AddHierarchies } from './AddHierarchies';

type HierarchiesData = {
  Default: { id: string; name: string };
  All: { id: string; name: string }[];
};

export const Hierarchies = ({
  groupName,
  currentHierarchies,
  defaultModuleName,
  form,
  editModuleData,
  setOpenItemModal,
}: {
  groupName: string;
  currentHierarchies: HierarchiesData;
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editModuleData: ({ defaultModuleName, groupName, key, newValue }: EditModuleDataType) => void;
  setOpenItemModal: (item: { id: string; type: string } | null) => void;
}) => {
  const { useGetAllHierarchyQuery } = searchApiV2;
  const translate = useTranslate();

  const [isAddHierarchies, setIsAddHierarchies] = useState(false);

  const { data: hierarchies, isFetching: isHierarchiesFetching } = useGetAllHierarchyQuery({});

  const { control } = form;

  const addHierarchiesOptions = useMemo(() => {
    if (!hierarchies?.items || !currentHierarchies?.All) return [];

    const currentIds = new Set(currentHierarchies.All.map((h) => String(h.id)));

    return hierarchies.items
      .filter((el) => !currentIds.has(String(el.id)))
      .map((el) => ({ id: String(el.id), name: el.name }));
  }, [hierarchies?.items, currentHierarchies?.All]);

  const defaultId = useMemo(() => {
    return currentHierarchies.Default.id;
  }, [currentHierarchies?.Default]);

  const handleInputChange = (type: string, ids: string[]) => {
    let newValue:
      | string
      | number
      | boolean
      | Record<string, unknown>
      | (string | Record<string, unknown>)[]
      | undefined;
    let key = 'All';

    if (type === 'Delete') {
      newValue = currentHierarchies.All.filter((el) => el.id !== ids[0]);
    }

    if (type === 'Add') {
      const hierarchiesToAdd =
        hierarchies?.items
          ?.map((el) => (ids.includes(String(el.id)) ? { id: Number(el.id), name: el.name } : null))
          .filter((el): el is { id: number; name: string } => el !== null) ?? [];

      newValue = [...currentHierarchies.All, ...hierarchiesToAdd];
    }

    if (type === 'Default') {
      key = type;
      newValue = currentHierarchies?.All?.find((el) => el.id === ids[0]);
    }

    editModuleData({ defaultModuleName, groupName, key, newValue });
  };

  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  return (
    <Paper sx={{ padding: '1rem' }}>
      <Box component="div">{translate(groupName as any)}</Box>
      <Divider />
      {(isHierarchiesFetching || !currentHierarchies) && (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      )}
      {currentHierarchies && (
        <Controller
          control={control}
          defaultValue={currentHierarchies ?? {}}
          name={`${defaultModuleName}/${groupName}/All`}
          render={() => {
            return (
              <Box
                component="div"
                sx={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {hierarchies?.items &&
                  currentHierarchies?.All?.map((item, index) => (
                    <ListItem
                      onMouseEnter={() => setHoveredItemIndex(index)}
                      onMouseLeave={() => setHoveredItemIndex(null)}
                      key={item.id}
                    >
                      <Typography variant="h3" overflow="hidden">
                        {item.name}
                      </Typography>
                      <Box component="div">
                        <ListItemIconButton
                          data-testid={`"admin-module-settings__${item.name}_default-hierarchy"`}
                          selected={item.id === defaultId}
                          sx={{
                            visibility:
                              hoveredItemIndex === index || item.id === defaultId
                                ? 'visible'
                                : 'hidden',
                          }}
                          onClick={() => handleInputChange('Default', [item.id])}
                        >
                          <StarRounded />
                        </ListItemIconButton>
                        <ListItemIconButton
                          data-testid={`"admin-module-settings__${item.name}_edit-hierarchy"`}
                          sx={{
                            visibility: hoveredItemIndex === index ? 'visible' : 'hidden',
                          }}
                          onClick={() =>
                            item?.id && setOpenItemModal({ id: item.id, type: 'kpiSettings' })
                          }
                        >
                          <Settings />
                        </ListItemIconButton>
                        <ListItemIconButton
                          data-testid={`"admin-module-settings__${item.name}_preview-hierarchy"`}
                          sx={{
                            visibility: hoveredItemIndex === index ? 'visible' : 'hidden',
                          }}
                          onClick={() =>
                            item?.id && setOpenItemModal({ id: item.id, type: 'preview' })
                          }
                        >
                          <Visibility />
                        </ListItemIconButton>
                        <ListItemIconButton
                          data-testid={`"admin-module-settings__${item.name}_delete-hierarchy"`}
                          sx={{
                            visibility: hoveredItemIndex === index ? 'visible' : 'hidden',
                          }}
                          onClick={() => handleInputChange('Delete', [item.id])}
                        >
                          <Delete />
                        </ListItemIconButton>
                      </Box>
                    </ListItem>
                  ))}
                <ListItemIconButton>
                  <Add onClick={() => setIsAddHierarchies(true)} />
                </ListItemIconButton>
                <AddHierarchies
                  isAddHierarchies={isAddHierarchies}
                  setIsAddHierarchies={setIsAddHierarchies}
                  listElements={addHierarchiesOptions}
                  handleInputChange={handleInputChange}
                />
              </Box>
            );
          }}
        />
      )}
    </Paper>
  );
};
