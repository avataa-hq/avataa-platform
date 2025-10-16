import {
  Dispatch,
  memo,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Autocomplete,
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Button,
  useTheme,
  Typography,
  Checkbox,
  Tooltip,
} from '@mui/material';
import { Control, Controller, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { EditDashboardKpiData } from '2_pages/adminSystemManagement/model';
import { Modal, ModuleSettingsType, useColorsConfigure, useTabs, useTranslate } from '6_shared';
import {
  Delete,
  PlayArrow,
  Settings,
  AddRounded,
  ChevronRight,
  // TableChart,
} from '@mui/icons-material';
import { GranularityResponse } from '6_shared/api/objectState/types';
import { AGGREGATION_TYPES } from '6_shared/api/clickhouse/constants';
import type { EventValue } from './GroupedKpiSettings';

type SettingsField = {
  value: string;
  label: string;
  granularity: string;
  color: string;
  isZeroPoint: boolean;
};

interface IProps {
  type: 'main' | 'additional';
  kpiGroupName: string;
  kpiGroup: Record<string, string>;
  control: Control<FieldValues, any>;
  defaultModuleName: string;
  hierarchyId: string;
  tmoId: string;
  lvlId: string;
  tmoName: string;
  subgroup: string;
  groupName: string;
  kpiValues: EventValue[];
  granularityValues: GranularityResponse[];
  editRow: ModuleSettingsType[] | null;
  setEditRow: Dispatch<SetStateAction<ModuleSettingsType[] | null>>;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  handleExpandRow?: (key: string, action: string) => void;
  expandedRows?: Record<string, boolean>;
  additionalKpiGroup?: string;
}

export const TableRowComponent = memo(
  ({
    type,
    kpiGroupName,
    kpiGroup,
    defaultModuleName,
    hierarchyId,
    tmoId,
    lvlId,
    tmoName,
    groupName,
    subgroup,
    kpiValues,
    granularityValues,
    editRow,
    control,
    setEditRow,
    editDashboardKpiData,
    handleExpandRow,
    expandedRows,
    additionalKpiGroup,
  }: IProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();
    const translate = useTranslate();

    const { toggleIsOpenColorSelecting } = useColorsConfigure();
    const { selectedAdminTab } = useTabs();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [settingFields, setSettingFields] = useState<SettingsField[]>(
      kpiGroup?.tics ? JSON.parse(kpiGroup.tics) : [],
    );
    const [trimmedSettingsGranularityOptions, setTrimmedSettingsGranularityOptions] = useState<
      string[]
    >(['year']);

    const handleDelete = (key: any) => {
      handleExpandRow?.(key[0].replace(/ additional$/, ''), 'delete');
      editDashboardKpiData({
        module: defaultModuleName,
        hierarchyId,
        subgroup,
        groupId: `${tmoId}-${lvlId}`,
        kpiConsecutiveValue: key[0],
        action: 'delete',
      });
    };

    const handleSettingsClick = () => {
      // const currentKpiGranularity = kpiValues?.find((kpi) => kpi.id === kpiGroup.ID)?.granularity;
      // const currentKpiGranularityIndex = GRANULARITY_OPTIONS.findIndex(
      //   (option) => option === currentKpiGranularity,
      // );

      // if (currentKpiGranularityIndex > 1) {
      //   const settingsGranularityOptions = GRANULARITY_OPTIONS.toSpliced(
      //     1,
      //     currentKpiGranularityIndex - 1,
      //   );

      //   setTrimmedSettingsGranularityOptions(settingsGranularityOptions);
      // }

      setIsModalOpen(true);
    };

    const onAddSettingField = () => {
      setSettingFields((prev) => [
        ...prev,
        { value: '', label: '', granularity: '', color: '', isZeroPoint: false },
      ]);
    };

    const onDeleteSettingField = (index: number) => {
      setSettingFields((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = useCallback(
      (key: string[], newValue: string) => {
        editDashboardKpiData({
          module: defaultModuleName,
          hierarchyId,
          subgroup,
          groupId: `${tmoId}-${lvlId}`,
          kpiConsecutiveValue: key[0],
          key: key[1],
          newValue,
          tmoName,
          action: 'modify',
        });
      },
      [editDashboardKpiData, defaultModuleName, hierarchyId, lvlId, subgroup, tmoId, tmoName],
    );

    const onFieldChange = useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement>,
        field: ControllerRenderProps<FieldValues, `${string}/${string}/${string}`>,
      ) => {
        field.onChange(e);
      },
      [],
    );

    const handleEditStart = useCallback(
      (key: string[]) => {
        const editObject: ModuleSettingsType = {
          module_name: defaultModuleName,
          settings: {
            [groupName]: {
              [key[0]]: key[1],
            },
          },
        };

        setEditRow([editObject]);

        const textField = inputRef.current;
        if (textField) {
          textField.focus();
        }
      },
      [defaultModuleName, groupName, setEditRow],
    );

    const handleEditEnd = () => {
      setEditRow(null);
    };

    const keys = ['ID', 'min', 'max', 'decimals', 'aggregation', 'Direction'];
    // const keys = ['ID', 'min', 'max', 'decimals', 'Granularity ID', 'aggregation', 'Direction'];

    const keyValuePairs = keys.reduce((acc, key) => {
      acc[`${key}Key`] = [kpiGroupName, key];
      acc[`${key}Value`] = [kpiGroup?.[key]];
      return acc;
    }, {} as Record<string, string[]>);

    const {
      IDKey,
      IDValue,
      minKey,
      minValue,
      maxKey,
      maxValue,
      decimalsKey,
      decimalsValue,
      // 'Granularity IDKey': granularityKey,
      // 'Granularity IDValue': granularityValue,
      aggregationKey,
      aggregationValue,
      DirectionKey: directionKey,
      DirectionValue: directionValue,
    } = keyValuePairs;

    const onSaveSettingsClick = () => {
      handleInputChange([IDKey[0], 'tics'], JSON.stringify(settingFields));
      setIsModalOpen(false);
    };

    useEffect(() => {
      if (!additionalKpiGroup) {
        handleExpandRow?.(IDKey[0], 'delete');
      }
    }, [additionalKpiGroup]);

    return (
      <TableRow key={`${lvlId}-${kpiGroupName}`}>
        {/* <TableCell>{kpiGroupName}</TableCell> */}
        {type === 'main' && (
          <TableCell>
            {expandedRows && (
              <IconButton
                onClick={() => handleExpandRow?.(kpiGroupName, 'add')}
                sx={{
                  transform: expandedRows?.[`${kpiGroupName}`] ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <ChevronRight />
              </IconButton>
            )}
          </TableCell>
        )}
        {/* KPI ID */}
        <TableCell>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${IDKey}`}
            rules={{
              required: 'This field is required',
            }}
            defaultValue={IDValue[0] ?? ''}
            render={({ field }) => {
              return (
                <Autocomplete
                  options={kpiValues.map((el) => el.id)}
                  getOptionLabel={(option) =>
                    kpiValues?.find((kpi) => kpi.id === option)?.name ?? option
                  }
                  isOptionEqualToValue={(option, value) => option === value}
                  autoComplete
                  disableClearable
                  includeInputInList
                  value={kpiValues?.find((kpi) => kpi.id === field.value)?.id ?? field.value}
                  onChange={(e: SyntheticEvent<Element, Event>, value) => {
                    const val = kpiValues?.find((kpi) => kpi.id === value)?.id?.toString();
                    if (val) {
                      handleInputChange(IDKey, val);
                      onFieldChange(val as any, field);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} variant="standard" />}
                />
              );
            }}
          />
        </TableCell>

        {/* KPI MIN */}
        <TableCell sx={{ textAlignLast: 'center' }}>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${minKey}`}
            rules={{
              required: 'This field is required',
            }}
            defaultValue={minValue ?? ''}
            render={({ field }) => {
              return (
                <TextField
                  ref={inputRef}
                  variant="standard"
                  value={minValue}
                  fullWidth
                  size="small"
                  // disabled={editRow !== `${defaultModuleName}/${groupName}/${minKey}`}
                  InputProps={{
                    ...field,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(minKey, e.target.value);
                      onFieldChange(e, field);
                    },
                    autoFocus:
                      editRow?.some(
                        (row) =>
                          row.module_name === defaultModuleName &&
                          row.settings[groupName]?.hasOwnProperty(minKey),
                      ) || false,
                    disableUnderline: true,
                    onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                      if (event.key === 'Enter') {
                        setEditRow(null);
                        event.preventDefault();
                      }
                    },
                    onDoubleClick: () => {
                      if (
                        editRow?.some(
                          (row) =>
                            row.module_name === defaultModuleName &&
                            row.settings[groupName]?.hasOwnProperty(minKey),
                        )
                      ) {
                        handleEditEnd();
                      } else {
                        handleEditStart(minKey);
                      }
                    },
                    onClick: () => {
                      setEditRow((prev) => [
                        ...(prev || []),
                        {
                          module_name: defaultModuleName,
                          group_name: groupName,
                          key: minKey,
                          settings: {},
                        },
                      ]);
                    },
                  }}
                />
              );
            }}
          />
        </TableCell>

        {/* KPI MAX */}
        <TableCell sx={{ textAlignLast: 'center' }}>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${maxKey}`}
            rules={{
              required: 'This field is required',
            }}
            defaultValue={maxValue ?? ''}
            render={({ field }) => {
              return (
                <TextField
                  ref={inputRef}
                  variant="standard"
                  value={maxValue}
                  fullWidth
                  size="small"
                  // disabled={editRow !== `${defaultModuleName}/${groupName}/${maxKey}`}
                  InputProps={{
                    ...field,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(maxKey, e.target.value);
                      onFieldChange(e, field);
                    },
                    autoFocus:
                      editRow?.some(
                        (row) =>
                          row.module_name === defaultModuleName &&
                          row.settings?.[groupName]?.hasOwnProperty(maxKey),
                      ) || false,
                    disableUnderline: true,
                    onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                      if (event.key === 'Enter') {
                        setEditRow(null);
                        event.preventDefault();
                      }
                    },
                    onDoubleClick: () => {
                      if (
                        editRow?.some(
                          (row) =>
                            row.module_name === defaultModuleName &&
                            row.settings[groupName]?.hasOwnProperty(maxKey),
                        )
                      ) {
                        handleEditEnd();
                      } else {
                        handleEditStart(maxKey);
                      }
                    },
                    onClick: () => {
                      if (maxKey.length > 0) {
                        const newRow: ModuleSettingsType = {
                          module_name: defaultModuleName,
                          settings: {
                            [groupName]: { [maxKey[0]]: '' },
                          },
                        };

                        setEditRow((prev) => [...(prev || []), newRow]);
                      }
                    },
                  }}
                />
              );
            }}
          />
        </TableCell>

        {/* KPI GRANULARITY TYPE */}
        {/* <TableCell>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${granularityKey}`}
            rules={{
              required: 'This field is required',
            }}
            // defaultValue={granularityValue ?? ''}
            render={({ field }) => {
              return (
                <Autocomplete
                  options={GRANULARITY_TYPES}
                  isOptionEqualToValue={(option, value) =>
                    `${option} - ${
                      kpiValues?.find((kpi) => kpi.id === IDValue[0])?.name ?? IDValue[0]
                    }` === value
                  }
                  getOptionLabel={(option) => option}
                  disableClearable
                  // autoComplete
                  // includeInputInList
                  value={granularityValue[0]}
                  onChange={(e: SyntheticEvent<Element, Event>, value) => {
                    handleInputChange(granularityKey, value);
                    onFieldChange(value as any, field);
                  }}
                  renderInput={(params) => <TextField {...params} variant="standard" />}
                />
              );
            }}
          />
        </TableCell>  */}

        {/* KPI AGGREGATION TYPE */}
        <TableCell>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${aggregationKey}`}
            rules={{
              required: 'This field is required',
            }}
            // defaultValue={aggregationValue ?? ''}
            render={({ field }) => {
              return (
                <Autocomplete
                  options={AGGREGATION_TYPES}
                  isOptionEqualToValue={(option, value) =>
                    `${option} - ${
                      kpiValues?.find((kpi) => kpi.id === IDValue[0])?.name ?? IDValue[0]
                    }` === value
                  }
                  getOptionLabel={(option) => option}
                  disableClearable
                  // autoComplete
                  // includeInputInList
                  value={aggregationValue[0]}
                  onChange={(e: SyntheticEvent<Element, Event>, value) => {
                    handleInputChange(aggregationKey, value);
                    onFieldChange(value as any, field);
                  }}
                  renderInput={(params) => <TextField {...params} variant="standard" />}
                />
              );
            }}
          />
        </TableCell>

        {/* KPI NUMBER OF DECIMALS */}
        <TableCell sx={{ textAlignLast: 'center' }}>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${decimalsKey}`}
            rules={{
              required: 'Field is required',
              validate: (value) => {
                if (value < 0 || value > 6) {
                  return 'Only numbers between 0 and 6 are allowed';
                }
                return true;
              },
            }}
            defaultValue={decimalsValue ?? 2}
            render={({ field, fieldState }) => {
              return (
                <Tooltip title="Value must be between 0 and 6" placement="top">
                  <TextField
                    ref={inputRef}
                    variant="standard"
                    value={decimalsValue}
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    FormHelperTextProps={{
                      sx: { fontSize: '0.5rem' },
                    }}
                    InputProps={{
                      ...field,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value;
                        if (/^[0-6]$/.test(inputValue) || inputValue === '') {
                          handleInputChange(decimalsKey, inputValue);
                          onFieldChange(e, field);
                        }
                      },
                      autoFocus:
                        editRow?.some(
                          (row) =>
                            row.module_name === defaultModuleName &&
                            row.settings[groupName]?.hasOwnProperty(decimalsKey),
                        ) || false,
                      disableUnderline: true,
                      onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                        if (event.key === 'Enter') {
                          setEditRow(null);
                          event.preventDefault();
                        }
                      },
                      onDoubleClick: () => {
                        if (
                          editRow?.some(
                            (row) =>
                              row.module_name === defaultModuleName &&
                              row.settings[groupName]?.hasOwnProperty(decimalsKey),
                          )
                        ) {
                          handleEditEnd();
                        } else {
                          handleEditStart(decimalsKey);
                        }
                      },
                      onClick: () => {
                        if (typeof decimalsKey === 'string') {
                          setEditRow([
                            {
                              module_name: defaultModuleName,
                              settings: {
                                [groupName]: {
                                  [decimalsKey]: '',
                                },
                              },
                            },
                          ]);
                        }
                      },
                    }}
                  />
                </Tooltip>
              );
            }}
          />
        </TableCell>

        {/* KPI Direction */}
        <TableCell sx={{ justifyItems: 'center' }}>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${directionKey}`}
            rules={{
              required: 'This field is required',
            }}
            defaultValue={directionValue ?? ''}
            render={({ field }) => {
              return (
                <Button
                  value={field.value}
                  onClick={() => {
                    const value = directionValue[0] === 'up' ? 'down' : 'up';
                    handleInputChange(directionKey, value);
                    onFieldChange(value as any, field);
                  }}
                  sx={{ backgroundColor: `${theme.palette.neutral.surface}` }}
                >
                  <PlayArrow
                    sx={{
                      color: `${theme.palette.primary.main}`,
                      rotate: directionValue[0] === 'up' ? '270deg' : '90deg',
                    }}
                  />
                </Button>
              );
            }}
          />
        </TableCell>

        <TableCell sx={{ padding: 0 }}>
          <IconButton
            // sx={{ visibility: type === 'additional' ? 'inherit' : 'hidden' }}
            onClick={() => handleDelete(IDKey)}
          >
            <Delete />
          </IconButton>
        </TableCell>

        {type === 'main' && (
          <TableCell sx={{ padding: 0 }}>
            <IconButton onClick={handleSettingsClick}>
              <Settings />
            </IconButton>
          </TableCell>
        )}

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Tics Configuration</Typography>
              <Tooltip title="Color settings">
                <IconButton
                  sx={{ width: '40px', height: '40px' }}
                  onClick={() => toggleIsOpenColorSelecting({ module: selectedAdminTab })}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          }
          width={800}
          actions={
            <>
              <Button onClick={() => setIsModalOpen(false)}>{translate('Cancel')}</Button>
              <Button variant="contained" onClick={() => onSaveSettingsClick()}>
                {translate('Save')}
              </Button>
            </>
          }
        >
          <Box
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {settingFields.map((item, idx) => (
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} key={idx}>
                <Box component="div">
                  <Typography variant="body2">Comparison Zero Point</Typography>
                  <Checkbox
                    sx={{ padding: '7px' }}
                    checked={item.isZeroPoint}
                    onChange={(e) => {
                      const { checked } = e.target;

                      setSettingFields((prevState) => {
                        return prevState.map((field, i) => ({
                          ...field,
                          isZeroPoint: i === idx ? checked : false,
                        }));
                      });
                    }}
                  />
                </Box>
                <Box component="div">
                  <Typography variant="body2">{`Min: ${minValue}, Max: ${maxValue}`}</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    type="number"
                    inputProps={{ min: minValue, max: maxValue }}
                    sx={{
                      minWidth: 120,
                      '.MuiFormHelperText-root': {
                        fontSize: '8px',
                      },
                    }}
                    error={
                      Number(item.value) < Number(minValue?.[0]) ||
                      Number(item.value) > Number(maxValue?.[0])
                    }
                    helperText={
                      Number(item.value) < Number(minValue?.[0]) ||
                      Number(item.value) > Number(maxValue?.[0])
                        ? `Value must be between ${minValue?.[0]} and ${maxValue?.[0]}`
                        : ''
                    }
                    onChange={(e) => {
                      setSettingFields((prevState) => {
                        const newState = [...prevState];
                        newState[idx] = { ...newState[idx], value: e.target.value };
                        return newState;
                      });
                    }}
                    value={item.value}
                  />
                </Box>
                <Box component="div">
                  <Typography variant="body2">{translate('Label')}</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ minWidth: 120 }}
                    onChange={(e) => {
                      setSettingFields((prevState) => {
                        const newState = [...prevState];
                        newState[idx] = { ...newState[idx], label: e.target.value };
                        return newState;
                      });
                    }}
                    value={item.label}
                  />
                </Box>
                <Box component="div">
                  <Typography variant="body2">{translate('Granularity')}</Typography>
                  <Autocomplete
                    options={trimmedSettingsGranularityOptions}
                    disableClearable
                    value={item.granularity || 'year'}
                    onChange={(e, value) => {
                      setSettingFields((prevState) => {
                        const newState = [...prevState];
                        newState[idx] = { ...newState[idx], granularity: value };
                        return newState;
                      });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ minWidth: 120 }}
                  />
                </Box>
                {/* <Box component="div">
                  <Typography variant="body2">{translate('Color')}</Typography>
                  <input
                    id="colorPicker"
                    type="color"
                    style={{ height: '37px' }}
                    value={item.color}
                    onChange={(e) =>
                      setSettingFields((prevState) => {
                        const newState = [...prevState];
                        newState[idx] = { ...newState[idx], color: e.target.value };
                        return newState;
                      })
                    }
                  />
                </Box> */}

                <Box component="div">
                  <Typography variant="body2" sx={{ opacity: 0 }}>
                    Delete
                  </Typography>
                  <IconButton onClick={() => onDeleteSettingField(idx)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <IconButton onClick={onAddSettingField}>
              <AddRounded />
            </IconButton>
          </Box>
        </Modal>
      </TableRow>
    );
  },
);
