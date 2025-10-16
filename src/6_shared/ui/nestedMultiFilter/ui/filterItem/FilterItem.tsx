import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconButton } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  INestedData,
  INestedFilterColumn,
  INestedMultiFilterForm,
  INestedMultiFilterItem,
  NestedMultiFilterOperators,
} from '../../types';
import { FilterItemStyled, Container, ContainerLeft, ContainerRight } from './FilterItem.styled';
import { defaultOperators } from '../../config';
import { ColumField } from './columField/ColumField';
import { OperatorField } from './operatorField/OperatorField';
import { LogicalOperatorField } from './logicalOperatorField/LogicalOperatorField';
import { ValueField } from './valueField/ValueField';
import { MultipleValueField } from './multipleValueField/MultipleValueField';

const isDisconnectingValueOperators = (operator: string | undefined) => {
  return [
    'isEmpty',
    'isNotEmpty',
    'isAnyOf',
    'isNotAnyOf',
    'is_empty',
    'is_not_empty',
    'is_any_of',
    'is_not_any_of',
  ].includes(operator ?? '');
};

const operatorsForNumericInput = ['more', 'moreOrEq', 'less', 'lessOrEq'];

const getCurrentValueType = (column: INestedMultiFilterItem, currentOperator?: string) => {
  // if (currentOperator && operatorsForNumericInput.includes(currentOperator)) {
  //   return 'number';
  // }
  if (!column || !column.column) return 'string';
  if (column.column.type === 'date') return 'date';
  if (column.column.type === 'dateTime') return 'datetime-local';
  if (column.column.type === 'number') return 'number';
  if (column.column.type === 'boolean') return 'boolean';
  if (column.column.type === 'bool') return 'bool';
  if (column.column.type === 'float') return 'float';
  if (column.column.type === 'int') return 'int';
  if (column.column.type === 'str') return 'str';
  return 'string';
};

const gertValueSelectList = (filter?: INestedMultiFilterItem, operator?: string) => {
  if (operator === 'inPeriod') {
    return [
      '5 minutes',
      '15 minutes',
      '30 minutes',
      '1 hour',
      '4 hours',
      '12 hours',
      '1 day',
      '1 week',
    ];
  }
  if (filter?.column) {
    const { type, selectOptions } = filter.column;
    if (type === 'boolean') {
      return ['true', 'false'];
    }
    if (selectOptions) {
      return selectOptions;
    }
  }
  return undefined;
};

interface IProps {
  columnFilter: INestedMultiFilterItem;
  expanded: string[];
  setExpanded: Dispatch<SetStateAction<string[]>>;
  onRemoveAllFilter?: (filterIndex: number) => void;
  onChange?: (filterForm: INestedMultiFilterForm) => void;

  columnsData?: INestedData<INestedFilterColumn>;
  operatorsData?: NestedMultiFilterOperators;

  currentColumnIndex: number;
  setCurrentColumnIndex: (idx: null | number) => void;
  readonly?: boolean;
}
export const FilterItem = ({
  columnFilter,
  expanded,
  setExpanded,
  currentColumnIndex,
  onRemoveAllFilter,
  onChange,
  columnsData,
  operatorsData,
  setCurrentColumnIndex,
  readonly,
}: IProps) => {
  const columnList = columnsData?.list;
  const isLoadingColumnList = columnsData?.isLoading;
  const isErrorColumnList = columnsData?.isError;

  const form = useFormContext<INestedMultiFilterForm>();
  const { remove, append, fields } = useFieldArray({
    control: form.control,
    name: `columnFilters.${currentColumnIndex}.filters`,
  });
  const watchedFilters = form.watch(`columnFilters.${currentColumnIndex}.filters`);
  const watchedColumn = form.watch(`columnFilters.${currentColumnIndex}`);

  useEffect(() => {
    if (watchedFilters.length <= 1) {
      setExpanded((prev) => prev.filter((e) => e !== columnFilter.column.id));
    }
  }, [watchedFilters]);

  const onExpanded = (name: string) => {
    setExpanded((prev) => (prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]));
  };

  const onAddColumnFilter = (id?: string | undefined) => {
    const emptyFilter = { value: '', operator: '' };
    append(emptyFilter);
    if (id) setExpanded([...expanded, id]);

    onChange?.(form.getValues());
  };

  const onRemoveColumnFilter = (filterIndex: number) => {
    remove(filterIndex);
    onChange?.(form.getValues());
  };

  const currentOperators = useMemo(() => {
    const currentValue = form.getValues(`columnFilters.${currentColumnIndex}`);
    return Object.entries(
      operatorsData?.[currentValue?.column?.type ?? 'string'] ??
        defaultOperators[watchedColumn?.column?.type ?? 'string'] ??
        {},
    );
  }, [currentColumnIndex, form, operatorsData, watchedColumn?.column?.type]);

  const getExpandComponent = () => {
    if (fields.length <= 1) {
      if (readonly) return null;
      return (
        <IconButton
          onClick={() => onAddColumnFilter(columnFilter.column.id)}
          data-testid="multifilter__add-filter-condition-button"
        >
          <AddIcon />
        </IconButton>
      );
    }
    return (
      <IconButton
        onClick={() => onExpanded(columnFilter.column.id)}
        data-testid="multifilter__expand-button"
      >
        <ExpandMoreIcon />
      </IconButton>
    );
  };

  return (
    <FilterItemStyled>
      <Accordion
        sx={{ backgroundColor: 'transparent', width: '100%' }}
        disableGutters
        expanded={columnFilter.column && expanded.includes(columnFilter.column.id)}
      >
        <AccordionSummary expandIcon={getExpandComponent()}>
          <Container>
            <ContainerLeft>
              <ColumField
                currentColumnIndex={currentColumnIndex}
                setCurrentColumnIndex={setCurrentColumnIndex}
                columnsList={columnList}
                isLoading={isLoadingColumnList}
                isError={isErrorColumnList}
                onChange={onChange}
                readonly={readonly}
                filterIndex={0}
              />
            </ContainerLeft>

            <ContainerRight>
              <OperatorField
                currentIndex={currentColumnIndex}
                currentOperators={currentOperators}
                filterIndex={0}
                onChange={onChange}
                readonly={readonly}
              />
              {!isDisconnectingValueOperators(watchedFilters?.[0]?.operator) && (
                <ValueField
                  filterIndex={0}
                  currentColumnIndex={currentColumnIndex}
                  valueSelectList={gertValueSelectList(
                    watchedColumn,
                    watchedFilters?.[0]?.operator,
                  )}
                  type={getCurrentValueType(watchedColumn, watchedFilters?.[0]?.operator)}
                  onChange={onChange}
                />
              )}
              {(watchedFilters?.[0]?.operator === 'isAnyOf' ||
                watchedFilters?.[0]?.operator === 'isNotAnyOf' ||
                watchedFilters?.[0]?.operator === 'is_any_of' ||
                watchedFilters?.[0]?.operator === 'is_not_any_of') && (
                <MultipleValueField
                  filterIndex={0}
                  currentColumnIndex={currentColumnIndex}
                  onChange={onChange}
                  valueSelectList={gertValueSelectList(
                    watchedColumn,
                    watchedFilters?.[0]?.operator,
                  )}
                />
              )}
            </ContainerRight>

            {!readonly && (
              <IconButton onClick={() => onRemoveAllFilter?.(currentColumnIndex)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Container>
        </AccordionSummary>

        <AccordionDetails sx={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
          {fields.map((f, filterIndex) => (
            <Container key={f.id}>
              {filterIndex !== 0 && (
                <>
                  <ContainerLeft sx={{ maxWidth: 150 }}>
                    <LogicalOperatorField
                      currentIndex={currentColumnIndex}
                      filterIndex={filterIndex}
                      onChange={onChange}
                      readonly={readonly}
                    />
                  </ContainerLeft>
                  <ContainerRight>
                    <OperatorField
                      currentIndex={currentColumnIndex}
                      currentOperators={currentOperators}
                      filterIndex={filterIndex}
                      onChange={onChange}
                      readonly={readonly}
                    />
                    {!isDisconnectingValueOperators(watchedFilters?.[filterIndex]?.operator) && (
                      <ValueField
                        filterIndex={filterIndex}
                        currentColumnIndex={currentColumnIndex}
                        valueSelectList={gertValueSelectList(
                          watchedColumn,
                          watchedFilters?.[filterIndex]?.operator,
                        )}
                        type={getCurrentValueType(
                          watchedColumn,
                          watchedFilters?.[filterIndex]?.operator,
                        )}
                        onChange={onChange}
                      />
                    )}
                    {(watchedFilters?.[0]?.operator === 'isAnyOf' ||
                      watchedFilters?.[0]?.operator === 'isNotAnyOf' ||
                      watchedFilters?.[0]?.operator === 'is_any_of' ||
                      watchedFilters?.[0]?.operator === 'is_not_any_of') && (
                      <MultipleValueField
                        filterIndex={filterIndex}
                        currentColumnIndex={currentColumnIndex}
                        onChange={onChange}
                        valueSelectList={gertValueSelectList(
                          watchedColumn,
                          watchedFilters?.[0]?.operator,
                        )}
                      />
                    )}
                  </ContainerRight>
                  {!readonly && (
                    <IconButton onClick={() => onRemoveColumnFilter(filterIndex)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </>
              )}

              {filterIndex !== 0 && filterIndex === fields.length - 1 && !readonly && (
                <IconButton
                  onClick={() => onAddColumnFilter()}
                  data-testid={`multifilter__add-filter-condition-button-${filterIndex}`}
                >
                  <AddIcon />
                </IconButton>
              )}
            </Container>
          ))}
        </AccordionDetails>
      </Accordion>
    </FilterItemStyled>
  );
};
