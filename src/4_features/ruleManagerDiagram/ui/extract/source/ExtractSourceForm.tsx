import { BaseSyntheticEvent, useCallback, useMemo, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  Autocomplete,
  Checkbox,
  Typography,
  CircularProgress,
  useTheme,
  Box,
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

import { ExtractSource, Source } from '6_shared/api/dataview/types';
import {
  useTranslate,
  FormContainer,
  dataviewGroupsApi,
  NestedMultiFilter,
  INestedMultiFilterForm,
  sourcesManagementApi,
  dataflowGroupsApi,
  INestedFilterForwardRef,
  ErrorPage,
  LoadingAvataa,
} from '6_shared';

import { useLabeledOperators } from '4_features/ruleManagerDiagram/lib';

const { useGetSourceConfigQuery } = sourcesManagementApi;
const { useGetAllGroupsQuery, useGetGroupSourcesQuery } = dataviewGroupsApi;
const { useGetGroupSourcesQuery: useGetDataflowGroupSourcesQuery } = dataflowGroupsApi;

interface ExtractSourceFormInputs {
  groupId: number;
  source?: Source;
  name: string;
  filters?: INestedMultiFilterForm;
  columns?: string[];
}

type ExtractSourceFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (
    source: Omit<ExtractSource, 'location'> & { sourceId: number },
    event?: BaseSyntheticEvent,
    filterRef?: INestedFilterForwardRef | null,
  ) => Promise<void>;
  onSourceChange?: (sourceId: Source | null) => void;
  sourceId?: number;
};

export const ExtractSourceForm = ({
  onSubmit: externalOnSubmit,
  onSourceChange: externalOnSourceChange,
  ...props
}: ExtractSourceFormProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const filterRef = useRef<INestedFilterForwardRef>(null);

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExtractSourceFormInputs>();

  const watchGroupId = watch('groupId');
  const watchSource = watch('source');

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();
  const {
    data: sourcesData,
    isFetching: isSourcesFetching,
    isError: isSourcesError,
  } = useGetGroupSourcesQuery(watchGroupId, {
    skip: !watchGroupId,
  });
  const {
    data: dataflowSources,
    isFetching: isDataflowSourcesFetching,
    isError: isDataflowSourcesError,
  } = useGetDataflowGroupSourcesQuery(watchGroupId, {
    skip: !watchGroupId,
  });

  const sources = useMemo(() => {
    return sourcesData?.filter((source) =>
      dataflowSources?.some((item) => item.id === source.source_id),
    );
  }, [dataflowSources, sourcesData]);

  const {
    data: sourceConfigs,
    isFetching: isSourceConfigsFetching,
    isError: isSourceConfigsError,
  } = useGetSourceConfigQuery(watchSource?.id!, { skip: !watchSource?.id });

  const {
    data: labeledOperators,
    isFetching: isOperatorsFetching,
    isError: isOperatorsError,
  } = useLabeledOperators();

  const isError =
    isGroupsError ||
    isSourcesError ||
    isDataflowSourcesError ||
    isSourceConfigsError ||
    isOperatorsError;

  const onSubmit: SubmitHandler<ExtractSourceFormInputs> = async (data, event) => {
    externalOnSubmit?.(
      {
        sourceId: data.source?.id ?? 0,
        name: data.name,
        columns: data.columns ?? [],
        filters:
          data.filters?.columnFilters.map((filter) => ({
            column: filter.column.name,
            rule: filter.logicalOperator,
            filters: filter.filters.map((columnFilter) => ({
              operator:
                columnFilter.operator as ExtractSource['filters'][number]['filters'][number]['operator'],
              value: columnFilter.value,
            })),
          })) ?? [],
      },
      event,
      filterRef.current,
    );
  };

  const { onChange: onGroupIdChange, ...registerGroupId } = register('groupId', {
    required: translate('This field is required'),
  });

  const handleMultiFilterChange = useCallback(
    (data: INestedMultiFilterForm) => {
      setValue('filters', data);
    },
    [setValue],
  );

  return (
    <>
      {!isGroupsFetching && isError && (
        <Box component="div" display="flex" alignItems="center" justifyContent="center">
          <ErrorPage
            error={{ message: translate('An error has occurred, please try again'), code: '404' }}
          />
        </Box>
      )}
      {isGroupsFetching && !isError && (
        <Box component="div" display="flex" alignItems="center" justifyContent="center">
          <LoadingAvataa />
        </Box>
      )}
      {!isGroupsFetching && !isError && (
        <form style={{ display: 'flex' }} onSubmit={handleSubmit(onSubmit)} {...props}>
          <FormContainer sx={{ justifyContent: 'center' }}>
            <TextField
              label={translate('Group')}
              {...registerGroupId}
              onChange={(e) => {
                setValue('source', undefined);
                onGroupIdChange(e);
                externalOnSourceChange?.(null);
              }}
              defaultValue=""
              error={!!errors.groupId}
              helperText={errors.groupId?.message}
              disabled={isGroupsFetching}
              select
            >
              <MenuItem value="" hidden />
              {groups?.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>
            <Controller
              control={control}
              name="source"
              rules={{ required: translate('This field is required') }}
              render={({ field: { ref, onChange, ...field } }) => (
                <TextField
                  label={translate('Source')}
                  inputRef={ref}
                  {...field}
                  onChange={(e) => {
                    const selectedSource = e.target.value as unknown as Source;
                    onChange(e);
                    externalOnSourceChange?.(selectedSource);
                    setValue('name', selectedSource.name);
                  }}
                  defaultValue=""
                  error={!!errors.source}
                  helperText={errors.source?.message}
                  disabled={
                    isSourcesFetching || isDataflowSourcesFetching || !sources || sources.length < 1
                  }
                  SelectProps={{ renderValue: (value) => (value as Source).name }}
                  InputProps={{
                    endAdornment:
                      isSourcesFetching || isDataflowSourcesFetching ? (
                        <CircularProgress size={20} sx={{ mr: '20px' }} />
                      ) : undefined,
                  }}
                  select
                >
                  <MenuItem value="" sx={{ display: 'none' }} />
                  {sources?.map((source) => (
                    // @ts-ignore - MenuItem value must be of Source type
                    <MenuItem key={source.id} value={source}>
                      {source.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <TextField
              {...register('name')}
              label={translate('Name')}
              value={watch('name') ?? watchSource?.name}
              error={!!errors.source}
              helperText={errors.source?.message}
            />
            <Controller
              name="filters"
              control={control}
              // rules={{ required: translate('This field is required') }}
              render={() => (
                <FormControl error={!!errors.filters}>
                  <NestedMultiFilter
                    disableTitle
                    onChange={handleMultiFilterChange}
                    multiFilterData={{
                      operatorsData: labeledOperators,
                      columnsData: {
                        list:
                          sourceConfigs?.map((config) => ({
                            id: config.id.toString(),
                            name: config.name,
                            type: config.val_type,
                          })) || [],
                        isError: isSourceConfigsError || isOperatorsError,
                        isLoading: isSourceConfigsFetching || isOperatorsFetching,
                      },
                    }}
                    ref={filterRef}
                  />
                  <FormHelperText>{errors.filters?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="columns"
              control={control}
              render={({ field: { ref, onChange, ...field } }) => (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  sx={{ flex: 1 }}
                  disabled={isSourceConfigsFetching}
                  options={sourceConfigs?.map((config) => config.name) ?? []}
                  onChange={(_, data) => onChange(data)}
                  renderOption={(autocompleteProps, option, { selected }) => (
                    <li {...autocompleteProps}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                        checkedIcon={<CheckBox />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </li>
                  )}
                  renderInput={({ InputLabelProps, ...params }) => (
                    <TextField
                      {...params}
                      {...field}
                      inputRef={ref}
                      label={
                        <span style={{ display: 'flex', gap: '5px' }}>
                          {translate('Columns')}
                          <Typography sx={{ color: theme.palette.text.disabled }}>
                            ({translate('leave empty to select all')})
                          </Typography>
                        </span>
                      }
                      placeholder={translate('Columns')}
                      error={!!errors.columns}
                      helperText={errors.columns?.message}
                    />
                  )}
                />
              )}
            />
          </FormContainer>
        </form>
      )}
    </>
  );
};
