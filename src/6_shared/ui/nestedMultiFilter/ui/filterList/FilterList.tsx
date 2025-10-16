import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslate } from '6_shared/localization';
import { FilterListStyled, Header, Body } from './FilterList.styled';
import { FilterItem } from '../filterItem/FilterItem';
import { LoadingAvataa } from '../../../loadingAvataa';
import {
  INestedData,
  INestedFilterColumn,
  INestedMultiFilterForm,
  INestedMultiFilterItem,
  NestedMultiFilterOperators,
} from '../../types';

const createEmptyColumnFilter = (
  id: string,
  columnName?: string,
  type?: string,
  selectOptions?: string[],
): INestedMultiFilterItem => {
  return {
    column: { name: columnName || '', type: type ?? 'string', id, selectOptions },
    logicalOperator: 'and',
    filters: [],
  };
};

interface IProps {
  columnsData?: INestedData<INestedFilterColumn>;
  operatorsData?: NestedMultiFilterOperators;
  onChange?: (filterForm: INestedMultiFilterForm) => void;
  readonly?: boolean;
  disableExpandAllButton?: boolean;
}
export const FilterList = ({
  operatorsData,
  columnsData,
  onChange,
  readonly,
  disableExpandAllButton,
}: IProps) => {
  const translate = useTranslate();
  const columnList = columnsData?.list;

  const [expanded, setExpanded] = useState<string[]>([]);
  const [uniqueColumnList, setUniqueColumnList] = useState<INestedFilterColumn[]>([]);
  const [currentFilterIndex, setCurrentFilterIndex] = useState<number | null>(null);

  const form = useFormContext<INestedMultiFilterForm>();
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'columnFilters',
  });

  useEffect(() => {
    if (!columnsData || !columnsData.list) return;

    const updatedFields = form.getValues('columnFilters').map((filter) => {
      const fullColumn = columnsData.list?.find((col) => col?.id === filter?.column?.id);
      if (!fullColumn) return filter;

      return {
        ...filter,
        column: {
          ...filter?.column,
          type: fullColumn?.type || filter?.column?.type,
          selectOptions: fullColumn?.selectOptions || filter?.column?.selectOptions,
        },
      };
    });

    form.setValue('columnFilters', updatedFields);
  }, [columnsData]);

  const watchedColumns = form.watch('columnFilters');
  const watchField =
    currentFilterIndex !== null && form.watch(`columnFilters.${currentFilterIndex}.column`);

  useEffect(() => {
    if (!columnList || !watchedColumns) return;
    const usedNames = watchedColumns.flatMap(({ column }) => (!column ? [] : column.name));
    const unique = columnList.filter((c) => !usedNames.includes(c.name));
    setUniqueColumnList(unique);
  }, [watchedColumns, columnList, watchField]);

  const onAddNewFilter = useCallback(() => {
    if (uniqueColumnList && uniqueColumnList.length) {
      if (uniqueColumnList[0]) {
        const { id, name, type, selectOptions } = uniqueColumnList[0];
        append(createEmptyColumnFilter(id, name, type, selectOptions));
      }
    }
    onChange?.(form.getValues());
  }, [append, uniqueColumnList]);

  const onRemoveFilter = useCallback(
    (filterIndex: number) => {
      remove(filterIndex);
      onChange?.(form.getValues());
    },
    [remove],
  );

  const isColumnFiltersLength = fields.length > 0;
  const isHasColumns =
    columnsData && columnsData.list && columnsData.list.length > 0 && !columnsData.isError;

  const isDisableHeader = disableExpandAllButton && isColumnFiltersLength && isHasColumns;

  if (columnsData && !columnsData.isError && columnsData.isLoading) {
    return (
      <FilterListStyled>
        <LoadingAvataa />
      </FilterListStyled>
    );
  }

  return (
    <FilterListStyled>
      {!isDisableHeader && (
        <Header>
          {isColumnFiltersLength && !disableExpandAllButton && (
            <Button
              onClick={() =>
                setExpanded(expanded.length === 0 ? fields.map((field) => field.column.id) : [])
              }
            >
              {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
            </Button>
          )}
          {!isColumnFiltersLength && isHasColumns && !readonly && (
            <Button onClick={onAddNewFilter} data-testid="multifilter__add-filter-button">
              <AddIcon />
              {translate('Add filter')}
            </Button>
          )}
          {!isHasColumns && uniqueColumnList.length === 0 && (
            <Typography sx={{ opacity: 0.5, mt: 5 }}>
              {translate('No columns for installing filters')}
            </Typography>
          )}
        </Header>
      )}
      <Body>
        {fields.map((columnFilter, i) => {
          const { id, ...other } = columnFilter;
          return (
            <FilterItem
              key={id}
              currentColumnIndex={i}
              expanded={expanded}
              setExpanded={setExpanded}
              columnFilter={other}
              onRemoveAllFilter={onRemoveFilter}
              columnsData={{ ...columnsData, list: uniqueColumnList }}
              setCurrentColumnIndex={setCurrentFilterIndex}
              operatorsData={operatorsData}
              onChange={onChange}
              readonly={readonly}
            />
          );
        })}
      </Body>
      {isColumnFiltersLength && uniqueColumnList.length > 0 && !readonly && (
        <IconButton onClick={onAddNewFilter} data-testid="multifilter__add-another-filter-button">
          <AddIcon />
        </IconButton>
      )}
    </FilterListStyled>
  );
};
