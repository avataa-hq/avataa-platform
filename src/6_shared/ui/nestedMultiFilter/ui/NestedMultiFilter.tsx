import { forwardRef, ReactNode, useEffect, useImperativeHandle } from 'react';
import { Button, Typography, Divider } from '@mui/material';
import { useForm, SubmitHandler, FormProvider, FormState } from 'react-hook-form';

import { ActionTypes } from '6_shared/lib';
import { useTranslate } from '6_shared/localization';

import {
  INestedData,
  INestedFilterColumn,
  INestedMultiFilterForm,
  NestedMultiFilterOperators,
} from '../types';
import { NestedMultiFilterStyled, Body, Footer } from './NestedMultiFilter.styled';
import { Header } from './header/Header';
import { FilterList } from './filterList/FilterList';

const defaultValues: INestedMultiFilterForm = {
  columnFilters: [],
  name: '',
  selectedTmo: { name: '', id: null },
  isPublic: false,
};

interface IMultiFilterData {
  columnsData?: INestedData<INestedFilterColumn>;
  operatorsData?: NestedMultiFilterOperators;
  filterState?: INestedMultiFilterForm | null;
}
interface IProps {
  headerRightSlot?: ReactNode;
  withName?: boolean;
  withSharingSettings?: boolean;
  multiFilterData: IMultiFilterData;
  onApply?: (filterForm: INestedMultiFilterForm) => void;
  onClear?: () => void;
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  disableResetWhenApply?: boolean;
  disableTitle?: boolean;
  disableClearAllButton?: boolean;
  disableExpandAllButton?: boolean;
  disableApplyButton?: boolean;
  forceReset?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}
export type INestedFilterForwardRef = {
  onApply?: () => void;
  onClearAll?: () => void;
  getFormState?: () => FormState<INestedMultiFilterForm>;
  getFiltersState?: () => INestedMultiFilterForm | null;
  onFormTrigger: () => void;
};

export const NestedMultiFilter = forwardRef<INestedFilterForwardRef, IProps>(
  (
    {
      withName = false,
      withSharingSettings = false,
      headerRightSlot,
      multiFilterData: { filterState, columnsData, operatorsData },
      onApply,
      onChange,
      onClear,
      disableResetWhenApply,
      disableTitle,
      disableClearAllButton,
      disableExpandAllButton,
      disableApplyButton,
      forceReset,
      permissions,
    },
    ref?,
  ) => {
    const translate = useTranslate();
    const form = useForm<INestedMultiFilterForm>({
      defaultValues,
      mode: 'onChange',
    });

    const { formState } = form;

    useEffect(() => {
      if (filterState) form.reset(filterState);
    }, [filterState]);

    useEffect(() => {
      if (forceReset) form.resetField('columnFilters');
    }, [forceReset]);

    const onSubmit: SubmitHandler<INestedMultiFilterForm> = (data) => {
      if (Object.keys(formState.errors).length > 0) {
        Object.keys(formState.errors).forEach((key: any) => {
          // @ts-ignore
          return form.setError(`${key}`, { message: formState.errors[key].message as string });
        });
      }
      onApply?.(data);
      if (!disableResetWhenApply) {
        form.reset(defaultValues);
      }
    };
    const onClearAll = () => {
      form.setValue('columnFilters', []);
      onClear?.();
    };

    const isHasColumns = columnsData?.list && columnsData.list.length > 0 && !columnsData.isError;

    const isWithoutHeader = !withName && !headerRightSlot && !withSharingSettings;
    useImperativeHandle<unknown, INestedFilterForwardRef>(ref, () => ({
      onApply: form.handleSubmit(onSubmit),
      onFormTrigger: form.trigger,
      onClearAll: () => onClearAll(),
      getFormState: () => form.formState,
    }));

    return (
      <NestedMultiFilterStyled>
        {!disableTitle && (
          <Typography variant="h2" align="center">
            {translate('MultiFilter')}
          </Typography>
        )}

        {isWithoutHeader && !disableTitle && <Divider sx={{ width: '100%', p: 1.5 }} />}
        {!isWithoutHeader && (
          <Header
            withName={withName}
            withSharingSettings={withSharingSettings}
            control={form.control}
            rightSlotContent={headerRightSlot}
            readonly={filterState?.readonly}
          />
        )}
        <Body>
          <FormProvider {...form}>
            <FilterList
              columnsData={columnsData}
              operatorsData={operatorsData}
              onChange={onChange}
              readonly={filterState?.readonly}
              disableExpandAllButton={disableExpandAllButton}
            />
          </FormProvider>
        </Body>
        {onApply && isHasColumns && !filterState?.readonly && (
          <Footer sx={{ justifyContent: disableClearAllButton ? 'end' : 'space-between' }}>
            {!disableClearAllButton && (
              <Button
                disabled={!(permissions?.view ?? true)}
                variant="contained"
                onClick={onClearAll}
              >
                {translate('Clear All')}
              </Button>
            )}
            {!disableApplyButton && (
              <Button
                disabled={!(permissions?.view ?? true) || Object.keys(formState.errors).length > 0}
                variant="contained"
                onClick={form.handleSubmit(onSubmit)}
              >
                {translate('Apply')}
              </Button>
            )}
          </Footer>
        )}
      </NestedMultiFilterStyled>
    );
  },
);
