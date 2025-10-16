import { BaseSyntheticEvent, useCallback, useRef } from 'react';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

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

export interface AddFilterFormInputs {
  name: string;
  filter: INestedMultiFilterForm;
}

type AddFilterFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (
    data: AddFilterFormInputs,
    event?: BaseSyntheticEvent,
    filterRef?: INestedFilterForwardRef | null,
  ) => Promise<void>;
  sourceId?: number;
};

export const AddFilterForm = ({
  onSubmit: onExternalSubmit,
  sourceId = 0,
  ...props
}: AddFilterFormProps) => {
  const translate = useTranslate();
  const filterRef = useRef<INestedFilterForwardRef>(null);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFilterFormInputs>();

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

  const onSubmit: SubmitHandler<AddFilterFormInputs> = async (data, event) => {
    await filterRef?.current?.onFormTrigger();
    onExternalSubmit?.(data, event, filterRef.current);
  };

  const handleMultiFilterChange = useCallback(
    (data: INestedMultiFilterForm) => {
      setValue('filter', data);
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
        <Controller
          name="filter"
          control={control}
          rules={{ required: translate('This field is required') }}
          render={() => (
            <FormControl error={!!errors.filter}>
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
              <FormHelperText>{errors.filter?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </FormContainer>
    </form>
  );
};
