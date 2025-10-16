import { useEffect, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Settings, Visibility } from '@mui/icons-material';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import {
  hierarchyLevels,
  LoadingContainer,
  searchApiV2,
  SearchHierarchyModelItem,
  useTranslate,
} from '6_shared';
import { HierarchyLevel } from '6_shared/api/hierarchy/types';
import { ListItemIconButton } from './ListItem.styled';

type HierarchiesData = {
  Selected: { id: string; name: string };
  SelectedLevel: { id: string; name: string };
};

export const TopViewHierarchies = ({
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
  const { useGetLevelsQuery } = hierarchyLevels;
  const translate = useTranslate();
  const { control } = form;

  const [selectedHierrachy, setSelectedHierrachy] = useState<SearchHierarchyModelItem | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<HierarchyLevel | null>(null);

  const { data: hierarchies, isFetching: isHierarchiesFetching } = useGetAllHierarchyQuery({});

  const { data: hierarchyLevelsData } = useGetLevelsQuery(
    Number(currentHierarchies?.Selected?.id!),
    {
      skip: !currentHierarchies?.Selected?.id,
    },
  );

  useEffect(() => {
    setSelectedHierrachy(
      hierarchies?.items?.find((el) => String(el.id) === currentHierarchies?.Selected?.id) ?? null,
    );
  }, [currentHierarchies?.Selected?.id, hierarchies?.items]);

  useEffect(() => {
    setSelectedLevel(
      hierarchyLevelsData?.find((el) => String(el.id) === currentHierarchies?.SelectedLevel?.id) ??
        null,
    );
  }, [currentHierarchies?.SelectedLevel?.id, hierarchyLevelsData]);

  const handleInputChange = (type: string, id: string, key: string) => {
    let newValue:
      | string
      | number
      | boolean
      | Record<string, unknown>
      | (string | Record<string, unknown>)[]
      | undefined;

    if (type === 'Add' && key === 'Selected') {
      const hierarchieToAdd = hierarchies?.items.find((el) => String(el.id) === id);
      newValue = { id: String(hierarchieToAdd?.id), name: hierarchieToAdd?.name };
    }

    if (type === 'Add' && key === 'SelectedLevel') {
      const hierarchieLevelToAdd = hierarchyLevelsData?.find((el) => String(el.id) === id);
      newValue = { id: String(hierarchieLevelToAdd?.id), name: hierarchieLevelToAdd?.name };
    }

    editModuleData({ defaultModuleName, groupName, key, newValue });
  };

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
        <Box component="div">
          <Controller
            control={control}
            defaultValue={currentHierarchies ?? {}}
            name={`${defaultModuleName}/${groupName}/Selected`}
            render={() => {
              return (
                <Box
                  component="div"
                  sx={{
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <Typography sx={{ minWidth: '200px' }}>Selected Hierarchy</Typography>

                  <Autocomplete
                    value={selectedHierrachy}
                    options={hierarchies?.items ?? []}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(_, newValue) => {
                      setSelectedHierrachy(newValue ?? null);
                      handleInputChange('Add', newValue?.id.toString() ?? '0', 'Selected');
                    }}
                    sx={{ width: '200px' }}
                  />

                  <Box component="div">
                    <ListItemIconButton
                      data-testid={`"admin-module-settings__${selectedHierrachy?.name}_edit-hierarchy"`}
                      onClick={() =>
                        selectedHierrachy?.id &&
                        setOpenItemModal({
                          id: selectedHierrachy?.id ? selectedHierrachy.id.toString() : '0',
                          type: 'kpiSettings',
                        })
                      }
                    >
                      <Settings />
                    </ListItemIconButton>
                    <ListItemIconButton
                      data-testid={`"admin-module-settings__${selectedHierrachy?.name}_preview-hierarchy"`}
                      onClick={() =>
                        selectedHierrachy?.id &&
                        setOpenItemModal({
                          id: selectedHierrachy?.id ? selectedHierrachy.id.toString() : '0',
                          type: 'preview',
                        })
                      }
                    >
                      <Visibility />
                    </ListItemIconButton>
                  </Box>
                </Box>
              );
            }}
          />

          <Controller
            control={control}
            defaultValue={currentHierarchies ?? {}}
            name={`${defaultModuleName}/${groupName}/SelectedLevel`}
            render={() => {
              return (
                <Box
                  component="div"
                  sx={{
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <Typography sx={{ minWidth: '200px' }}>Selected Hierarchy Level</Typography>

                  <Autocomplete
                    value={selectedLevel}
                    options={hierarchyLevelsData ?? []}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} />}
                    onChange={(_, newValue) => {
                      setSelectedLevel(newValue ?? null);
                      handleInputChange('Add', newValue?.id.toString() ?? '0', 'SelectedLevel');
                    }}
                    sx={{ width: '200px' }}
                  />
                </Box>
              );
            }}
          />
        </Box>
      )}
    </Paper>
  );
};
