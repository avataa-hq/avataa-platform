import { useEffect, useMemo, useRef, useState } from 'react';
import { Divider, IconButton, Paper, Switch, Tooltip, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Edit as EditIcon, Check as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';
import { Controller, ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { DarkDisabledTextField, InputField, ModuleSettingsType, useTranslate } from '6_shared';
import { useInputsConfig } from '4_features/systemAnalysis/capacity/createNewProjection/lib/useInputsConfig';
import { EditModuleDataType } from '../model';

export const GroupedSettings = ({
  groupName,
  strings,
  defaultModuleName,
  form,
  editModuleData,
  editRow,
  setEditRow,
}: {
  groupName: string;
  strings: Record<string, string>;
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editModuleData: ({ defaultModuleName, groupName, key, newValue }: EditModuleDataType) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const translate = useTranslate();

  const [isMapOfflineMode, setIsMapOfflineMode] = useState(
    Boolean(strings?.isMapOfflineMode ?? false),
  );

  const handleMapModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMapOfflineMode(event.target.checked);
    editModuleData({
      defaultModuleName,
      groupName,
      key: 'isMapOfflineMode',
      newValue: event.target.checked,
    });
  };

  const {
    control,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = form;

  const {
    additionalInputLeftFields,
    additionalInputRightFields,
    targetsInputLeftFields,
    targetsInputRightFields,
  } = useInputsConfig({
    errors,
  });

  const handleEditStart = (key: string) => {
    const editObject: ModuleSettingsType = {
      module_name: defaultModuleName,
      settings: {
        [groupName]: {
          [key]: strings[key],
        },
      },
    };
    setEditRow([editObject]);
    const textField = inputRef.current;
    if (textField) {
      textField.focus();
    }
  };

  const handleEditEnd = () => {
    setEditRow(null);
  };

  const handleInputChange = (key: string, newValue: string) => {
    editModuleData({ defaultModuleName, groupName, key, newValue });
  };

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, `${string}/${string}/${string}`>,
  ) => {
    field.onChange(e);
  };

  // commented because of {temporary} disabling the minTraffic value settings from the Admin Panel
  const traffic = watch('Smarter CAPEX/Common Settings/traffic');
  // const minTraffic = watch('Smarter CAPEX/Common Settings/minTraffic');
  const maxTraffic = watch('Smarter CAPEX/Common Settings/maxTraffic');

  useEffect(() => {
    // if (+traffic > +maxTraffic || +traffic < +minTraffic) {
    if (+traffic > +maxTraffic) {
      setError('Smarter CAPEX/Common Settings/traffic', {
        message: 'Please enter a number between the edge values',
      });
    }
    // if (+minTraffic > +maxTraffic) {
    //   setError('Smarter CAPEX/Common Settings/minTraffic', {
    //     message: 'Please enter a valid range',
    //   });
    //   setError('Smarter CAPEX/Common Settings/maxTraffic', {
    //     message: 'Please enter a valid range',
    //   });
    // }
    // if (+minTraffic < +traffic && +traffic < +maxTraffic) {
    if (+traffic < +maxTraffic) {
      clearErrors([
        'Smarter CAPEX/Common Settings/traffic',
        'Smarter CAPEX/Common Settings/minTraffic',
        'Smarter CAPEX/Common Settings/maxTraffic',
      ]);
    }
    // if (+minTraffic > +traffic) {
    //   setError('Smarter CAPEX/Common Settings/minTraffic', {
    //     message: 'Please ensure that the traffic value is inside the range',
    //   });
    // }
    if (+maxTraffic < +traffic) {
      setError('Smarter CAPEX/Common Settings/maxTraffic', {
        message: 'Please ensure that the traffic value is inside the range',
      });
    }
  }, [errors, traffic, maxTraffic, setError, clearErrors]);

  const findPattern = (key: any) => {
    let matchedPattern;
    if (defaultModuleName === 'Projections') {
      let errorPatterns: InputField[];
      if (groupName === 'Additional') {
        errorPatterns = [...additionalInputLeftFields, ...additionalInputRightFields];
      } else {
        errorPatterns = [...targetsInputLeftFields, ...targetsInputRightFields];
      }
      matchedPattern = errorPatterns.find((pattern) => pattern.label === key);
    }

    if (defaultModuleName === 'Smarter CAPEX') {
      let errorPatterns: any[];
      if (groupName === 'Common Settings') {
        errorPatterns = [
          {
            name: 'traffic',
            label: 'Traffic',
            pattern: /^(?:500|[1-4]\d{2}|[1-9]\d?|0)$/,
            errorMessage: 'Please enter a number between 0 and 500',
          },
          {
            name: 'minTraffic',
            label: 'Min Traffic',
            pattern: /^(?:500|[1-4]\d{2}|[1-9]\d?|0)$/,
            errorMessage: 'Please enter a number between 0 and 500',
          },
          {
            name: 'maxTraffic',
            label: 'Max Traffic',
            pattern: /^(?:500|[1-4]\d{2}|[1-9]\d?|0)$/,
            errorMessage: 'Please enter a number between 0 and 500',
          },
          {
            name: 'cluster',
            label: 'Cluster',
            pattern: /^(cost|profitScore|size|traffic)$/,
            errorMessage: 'Please enter one of the next values: cost, profitScore, size, traffic',
          },
          {
            name: 'constructionMonths',
            label: 'Construction Months',
            pattern: /^(6|12|24)$/,
            errorMessage: 'Please enter one of the next values: 6, 12, 24',
          },
        ];
        matchedPattern = errorPatterns.find((pattern) => pattern.name === key);
      }
    }

    if (!matchedPattern?.pattern) return undefined;
    return { value: matchedPattern?.pattern, message: matchedPattern?.errorMessage ?? '' };
  };

  const filteredStrings = useMemo(
    () => Object.fromEntries(Object.entries(strings).filter(([key]) => key !== 'isMapOfflineMode')),
    [strings],
  );

  return (
    <Paper sx={{ padding: '1rem' }}>
      <Box component="div">{translate(groupName as any)}</Box>
      <Divider />
      {Object.entries(filteredStrings).map(([key, value]) => (
        <Stack
          direction="row"
          divider={
            <Divider orientation="vertical" sx={{ paddingBottom: '5px' }} flexItem>
              :
            </Divider>
          }
          style={{ display: 'flex', alignItems: 'center' }}
          key={key}
        >
          <DarkDisabledTextField
            InputProps={{
              disableUnderline: true,
            }}
            variant="standard"
            value={key}
            fullWidth
            size="small"
            disabled
          />
          <Controller
            control={control}
            name={`${defaultModuleName}/${groupName}/${key}`}
            rules={{
              required: 'This field is required',
              pattern: findPattern(key),
            }}
            defaultValue={value ?? ''}
            render={({ field, fieldState: { error } }) => {
              return (
                <DarkDisabledTextField
                  ref={inputRef}
                  variant="standard"
                  value={value}
                  fullWidth
                  size="small"
                  disabled={
                    !editRow?.some(
                      (module) =>
                        module.module_name === defaultModuleName &&
                        module.settings[groupName]?.hasOwnProperty(key),
                    )
                  }
                  InputProps={{
                    ...field,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(key, e.target.value);
                      onFieldChange(e, field);
                    },
                    autoFocus:
                      editRow?.some(
                        (module) =>
                          module.module_name === defaultModuleName &&
                          module.settings[groupName]?.hasOwnProperty(key),
                      ) ?? false,
                    disableUnderline: true,
                    onKeyPress: (event: { key: string; preventDefault: () => void }) => {
                      if (event.key === 'Enter') {
                        setEditRow(null);
                        event.preventDefault();
                      }
                    },
                    onDoubleClick: () => {
                      handleEditStart(key);
                    },
                    endAdornment: (
                      <>
                        {error && (
                          <Tooltip title={error.message}>
                            <ErrorIcon color="error" />
                          </Tooltip>
                        )}
                        <IconButton
                          onClick={
                            editRow?.some(
                              (module) =>
                                module.module_name === defaultModuleName &&
                                module.settings[groupName]?.hasOwnProperty(key),
                            )
                              ? () => handleEditEnd()
                              : () => handleEditStart(key)
                          }
                          style={{ float: 'right' }}
                        >
                          {editRow?.some(
                            (module) =>
                              module.module_name === defaultModuleName &&
                              module.settings[groupName]?.hasOwnProperty(key),
                          ) ? (
                            <CheckIcon />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                      </>
                    ),
                  }}
                />
              );
            }}
          />
        </Stack>
      ))}

      {[
        'Top View Dashboard',
        'Dashboard',
        'Regulator Eye',
        'Dashboard Pres',
        'Smarter CAPEX',
      ].includes(defaultModuleName) && (
        <>
          <Divider />
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Typography sx={{ fontSize: '14px' }}>Map mode:</Typography>

            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Online</Typography>
              <Switch checked={isMapOfflineMode} onChange={handleMapModeChange} />
              <Typography variant="body2">Offline</Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};
