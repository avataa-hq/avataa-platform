import {
  Dispatch,
  memo,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Autocomplete, TableCell, TableRow, TextField, useTheme } from '@mui/material';
import { Control, Controller, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { Button, ModuleSettingsType } from '6_shared';
import { PlayArrow } from '@mui/icons-material';
import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import { GranularityResponse, kpiResponse } from '6_shared/api/objectState/types';

const transformOperator = (operator: string) => {
  if (operator === 'Regulator') return 'all';
  if (operator === 'Ooredoo') return 'ooredoo';
  if (operator === 'VFQ') return 'vodafone';
  return '';
};

interface IProps {
  parentGroupName: string;
  kpiGroupName: string;
  kpiGroup: Record<string, string>;
  control: Control<FieldValues, any>;
  defaultModuleName: string;
  groupName: string;
  moduleSettings: ModuleSettingsType;
  kpiValues: kpiResponse[];
  granularityValues: GranularityResponse[];
  editRow: ModuleSettingsType[] | null;
  setEditRow: Dispatch<SetStateAction<ModuleSettingsType[] | null>>;
  editModuleData: ({ defaultModuleName, groupName, key, newValue }: EditModuleDataType) => void;
}

export const TableRowComponent = memo(
  ({
    parentGroupName,
    kpiGroupName,
    kpiGroup,
    defaultModuleName,
    groupName,
    moduleSettings,
    kpiValues,
    granularityValues,
    editRow,
    control,
    setEditRow,
    editModuleData,
  }: IProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const handleInputChange = useCallback(
      (key: string, newValue: string) => {
        editModuleData({
          defaultModuleName,
          groupName: parentGroupName,
          key: groupName,
          nestedKey: key,
          newNestedValue: newValue,
        });
      },
      [defaultModuleName, editModuleData, groupName, parentGroupName],
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

    const getKpiIdOptions = useCallback(
      (literal: string, operator: string) => {
        const tmoId =
          (
            moduleSettings?.settings?.['Objects Settings'] as unknown as { [key: string]: string }
          )?.[`${literal} ID`] ?? '';

        if (!tmoId) return [];

        const isNeutralKpi = literal === 'Operator' || literal === 'Site' || literal === 'Cell';

        const value = kpiValues
          .filter((kpi) =>
            isNeutralKpi
              ? kpi.object_type === Number(tmoId)
              : kpi.object_type === Number(tmoId) &&
                kpi.branch?.toLowerCase() === transformOperator(operator),
          )
          .map((kpi) => kpi.id);

        return value;
      },
      [kpiValues, moduleSettings?.settings],
    );

    const getGranularityOptions = useCallback(
      (
        kpiId: number,
        granularityId: number,
        granularityKey: string,
        field: ControllerRenderProps<FieldValues, `${string}/${string}/${string}`>,
      ) => {
        if (!granularityValues) return [];
        const values = granularityValues.filter((obj) => obj.kpi_id === kpiId);
        const granularityFound = values.find((v) => v.id === granularityId);
        if (values?.[0]?.id && !granularityFound) {
          handleInputChange(granularityKey, values[0].id.toString());
          onFieldChange(values[0].id.toString() as any, field);
        }
        const res = values.map((granularity) => granularity.name);
        return res;
      },
      [granularityValues, handleInputChange, onFieldChange],
    );

    const handleEditStart = useCallback(
      (key: string) => {
        const newEditRow: ModuleSettingsType[] = [
          {
            module_name: `${defaultModuleName}/${groupName}/${key}`,
            settings: {
              [key]: moduleSettings.settings[key] ?? '',
            },
          },
        ];
        setEditRow(newEditRow);

        const textField = inputRef.current;
        if (textField) {
          textField.focus();
        }
      },
      [defaultModuleName, groupName, moduleSettings.settings, setEditRow],
    );

    const handleEditEnd = () => {
      setEditRow(null);
    };

    const keys = ['ID', 'min', 'max', 'decimals', 'Granularity ID', 'Direction'];

    const keyValuePairs = keys.reduce((acc, key) => {
      const keyName = `${kpiGroupName} ${key}`;
      acc[`${key}Key`] = keyName;
      acc[`${key}Value`] = kpiGroup[keyName];
      return acc;
    }, {} as Record<string, string>);

    const {
      IDKey: idKey,
      IDValue: idValue,
      minKey,
      minValue,
      maxKey,
      maxValue,
      decimalsKey,
      decimalsValue,
      'Granularity IDKey': granularityKey,
      'Granularity IDValue': granularityValue,
      DirectionKey: directionKey,
      DirectionValue: directionValue,
    } = keyValuePairs;

    const memoizedKpiIdOptions = useMemo(
      () => getKpiIdOptions(idKey?.split(' ')?.[0] ?? '', groupName),
      [idKey, groupName, getKpiIdOptions],
    );

    return (
      <TableRow key={kpiGroupName}>
        <TableCell>{kpiGroupName}</TableCell>

        {/* KPI ID */}
        <TableCell>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${idKey}`}
            rules={{
              required: 'This field is required',
            }}
            defaultValue={idValue ?? ''}
            render={({ field }) => {
              return (
                <Autocomplete
                  options={memoizedKpiIdOptions}
                  getOptionLabel={(option) =>
                    kpiValues?.find((kpi) => kpi.id === option)?.name ?? option
                  }
                  isOptionEqualToValue={(option, value) => option === value}
                  autoComplete
                  includeInputInList
                  value={
                    kpiValues?.find((kpi) => kpi.id === Number(field.value))?.id ?? field.value
                  }
                  onChange={(e: SyntheticEvent<Element, Event>, value) => {
                    const val = kpiValues?.find((kpi) => kpi.id === value)?.id?.toString();
                    if (val) {
                      handleInputChange(idKey, val);
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
        <TableCell>
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
                      typeof editRow === 'string' &&
                      editRow === `${defaultModuleName}/${groupName}/${minKey}`,
                    disableUnderline: true,
                    onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                      if (event.key === 'Enter') {
                        setEditRow(null);
                        event.preventDefault();
                      }
                    },
                    onDoubleClick: () => {
                      if (
                        typeof editRow === 'string' &&
                        editRow === `${defaultModuleName}/${groupName}/${minKey}`
                      ) {
                        handleEditEnd();
                      } else {
                        handleEditStart(minKey);
                      }
                    },
                    onClick: () => {
                      setEditRow([
                        {
                          module_name: `${defaultModuleName}/${groupName}/${minKey}`,
                          settings: {
                            [minKey]: moduleSettings.settings[minKey] ?? '',
                          },
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
        <TableCell>
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
                      typeof editRow === 'string' &&
                      editRow === `${defaultModuleName}/${groupName}/${maxKey}`,
                    disableUnderline: true,
                    onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                      if (event.key === 'Enter') {
                        setEditRow(null);
                        event.preventDefault();
                      }
                    },
                    onDoubleClick: () => {
                      if (
                        typeof editRow === 'string' &&
                        editRow === `${defaultModuleName}/${groupName}/${maxKey}`
                      ) {
                        handleEditEnd();
                      } else {
                        handleEditStart(maxKey);
                      }
                    },
                    onClick: () => {
                      setEditRow([
                        {
                          module_name: `${defaultModuleName}/${groupName}/${maxKey}`,
                          settings: { key: maxKey },
                        },
                      ]);
                    },
                  }}
                />
              );
            }}
          />
        </TableCell>

        {/* KPI GRANULARITY ID */}
        <TableCell>
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
                  options={getGranularityOptions(
                    +idValue,
                    +granularityValue,
                    granularityKey,
                    field,
                  )}
                  isOptionEqualToValue={(option, value) =>
                    `${option} - ${
                      kpiValues?.find((kpi) => kpi.id === Number(idValue))?.name ?? idValue
                    }` === value
                  }
                  getOptionLabel={(option) =>
                    `${
                      granularityValues?.find((granularity) => granularity.id === +option)?.name ??
                      option
                    } - ${kpiValues?.find((kpi) => kpi.id === Number(idValue))?.name ?? idValue}`
                  }
                  // autoComplete
                  // includeInputInList
                  value={`${
                    granularityValues?.find(
                      (granularity) => granularity.id === Number(granularityValue),
                    )?.name ?? granularityValue
                  } - ${kpiValues?.find((kpi) => kpi.id === Number(idValue))?.name ?? idValue}`}
                  onChange={(e: SyntheticEvent<Element, Event>, value) => {
                    const val = granularityValues
                      ?.find(
                        (granularity) =>
                          granularity.name === value && granularity.kpi_id === +idValue,
                      )
                      ?.id?.toString();
                    if (val) {
                      handleInputChange(granularityKey, val);
                      onFieldChange(val as any, field);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} variant="standard" />}
                />
              );
            }}
          />
        </TableCell>

        <TableCell>
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${decimalsKey}`}
            rules={{
              required: 'This field is required',
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
                <TextField
                  ref={inputRef}
                  variant="standard"
                  value={decimalsValue}
                  fullWidth
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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
                      typeof editRow === 'string' &&
                      editRow === `${defaultModuleName}/${groupName}/${decimalsKey}`,
                    disableUnderline: true,
                    onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                      if (event.key === 'Enter') {
                        setEditRow(null);
                        event.preventDefault();
                      }
                    },
                    onDoubleClick: () => {
                      if (
                        typeof editRow === 'string' &&
                        editRow === `${defaultModuleName}/${groupName}/${decimalsKey}`
                      ) {
                        handleEditEnd();
                      } else {
                        handleEditStart(decimalsKey);
                      }
                    },
                    onClick: () => {
                      setEditRow([
                        {
                          module_name: `${defaultModuleName}/${groupName}/${decimalsKey}`,
                          settings: { key: decimalsKey },
                        },
                      ]);
                    },
                  }}
                />
              );
            }}
          />
        </TableCell>

        {/* KPI Direction */}
        <TableCell>
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
                    const value = directionValue === 'up' ? 'down' : 'up';
                    handleInputChange(directionKey, value);
                    onFieldChange(value as any, field);
                  }}
                  sx={{ backgroundColor: `${theme.palette.neutral.surface}` }}
                >
                  <PlayArrow
                    sx={{
                      color: `${theme.palette.primary.main}`,
                      rotate: directionValue === 'up' ? '270deg' : '90deg',
                    }}
                  />
                </Button>
              );
            }}
          />
        </TableCell>
      </TableRow>
    );
  },
);
