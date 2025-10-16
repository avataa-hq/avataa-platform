import { BaseSyntheticEvent, createRef, useCallback, useEffect, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, FormControl, FormHelperText, TextField } from '@mui/material';
import { AddRounded } from '@mui/icons-material';

import {
  useTranslate,
  FormContainer,
  NestedMultiFilter,
  INestedMultiFilterForm,
  sourcesManagementApi,
  INestedFilterForwardRef,
} from '6_shared';

import { useLabeledOperators } from '4_features/ruleManagerDiagram/lib';

const { useGetSourceConfigQuery } = sourcesManagementApi;

const emptyMultiFilter = {
  columnFilters: [],
  name: '',
  selectedTmo: { name: '', id: null },
};

export interface AddSplitFormInputs {
  name: string;
  branches: INestedMultiFilterForm[];
}

type AddSplitFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (
    data: AddSplitFormInputs,
    event?: BaseSyntheticEvent,
    filterRef?: INestedFilterForwardRef | null,
  ) => void;
  sourceId?: number;
};

export const AddSplitForm = ({
  onSubmit: onExternalSubmit,
  sourceId = 0,
  ...props
}: AddSplitFormProps) => {
  const translate = useTranslate();

  const {
    watch,
    reset,
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSplitFormInputs>();

  const filterRefs = useRef<React.RefObject<INestedFilterForwardRef>[]>([]);

  useEffect(() => {
    filterRefs.current = watch('branches')?.map(
      (_, i) => filterRefs.current?.[i] || createRef<INestedFilterForwardRef>(),
    );
  }, [watch('branches')]);

  const {
    data: sourceConfigs,
    isFetching: isSourceConfigsFetching,
    isError: isSourceConfigsError,
  } = useGetSourceConfigQuery(sourceId);

  const {
    data: labeledOperators,
    isError: isOperatorsError,
    isFetching: isOperatorsFetching,
  } = useLabeledOperators();

  const onSubmit: SubmitHandler<AddSplitFormInputs> = (data, event) => {
    const error = data.branches.map((_, i) => {
      filterRefs.current[i].current?.onApply?.();
      return filterRefs.current[i].current?.getFormState?.().isValid === false;
    });

    if (error.includes(true)) return;

    onExternalSubmit?.(data, event, filterRefs.current?.[0]?.current || null);
  };

  useEffect(() => {
    reset({ branches: [emptyMultiFilter] });
  }, [reset]);

  const handleMultiFilterChange = useCallback(
    (data: INestedMultiFilterForm, index: number) => {
      setValue(`branches.${index}`, data);
    },
    [setValue],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormContainer sx={{ justifyContent: 'center' }}>
        <TextField
          label={`${translate('Name')}*`}
          {...register('name', { required: translate('This field is required') })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <FormControl error={!!errors.branches}>
          <Box component="div" display="flex" flexDirection="column" gap="10px">
            {watch('branches')?.map((branch, i) => (
              <Controller
                name={`branches.${i}`}
                control={control}
                rules={{ required: translate('This field is required') }}
                render={() => (
                  <NestedMultiFilter
                    disableTitle
                    disableResetWhenApply
                    onChange={(data) => handleMultiFilterChange(data, i)}
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
                    ref={filterRefs.current?.[i]}
                  />
                )}
              />
            ))}
            <Button
              variant="contained"
              sx={{ alignSelf: 'flex-end' }}
              onClick={() => setValue('branches', [...getValues('branches'), emptyMultiFilter])}
            >
              <AddRounded fontSize="small" /> {translate('Add branch')}
            </Button>
            <FormHelperText>{errors.branches?.message}</FormHelperText>
          </Box>
        </FormControl>
      </FormContainer>
    </form>
  );
};
