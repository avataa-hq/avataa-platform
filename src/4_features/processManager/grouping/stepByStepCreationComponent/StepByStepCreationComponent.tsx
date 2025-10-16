import { Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IGroupTemplatesBody,
  IInventoryFilterModel,
  INestedFilterForwardRef,
  INestedMultiFilterForm,
  ITmoInfo,
  parameterTypesApi,
} from '6_shared';
import {
  Body,
  Footer,
  Header,
  StepByStepCreationComponentStyled,
  TitleContainer,
} from './StepByStepCreationComponent.styled';
import { IStepItemModel, StepsComponent } from './stepsComponent/StepsComponent';
import { NameCreation } from './nameCreation/NameCreation';
import { FilterCreation } from './filterCreation/FilterCreation';
import { ITprmsListItem, RangeCreation } from './rangeCreation/RangeCreation';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

const list: IStepItemModel[] = [
  { label: 'Name', index: 1 },
  { label: 'Filter', index: 2 },
  { label: 'Ranges', index: 3 },
];

const getCreateTemplateBody = ({
  tmo_id,
  identical,
  min_qnt,
  multiFilterForm,
  name,
  ranges_object,
}: {
  tmo_id: number;
  name: string;
  multiFilterForm: INestedMultiFilterForm | null;
  min_qnt: number;
  identical: number[];
  ranges_object?: IGroupTemplatesBody['group_template_info']['ranges_object'];
}): IGroupTemplatesBody => {
  const columnFilters = !multiFilterForm
    ? []
    : multiFilterForm.columnFilters.map(({ column, filters, logicalOperator }) => ({
        filters,
        columnName: column.id,
        rule: logicalOperator,
      }));

  return {
    group_template_info: {
      tmo_id,
      name,
      column_filters: columnFilters as IInventoryFilterModel[],
      group_type_name: 'process_group',
      min_qnt,
      identical,
      ranges_object,
    },
  };
};

const getElementByIndex = (index: number) => {
  return list.find((element) => element.index === index);
};

interface IProps {
  onTemplateCreate?: (body: IGroupTemplatesBody) => Promise<void>;
  isLoading?: boolean;

  onClearStates?: () => void;
  handleClose?: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const StepByStepCreationComponent = ({
  handleClose,
  isLoading,
  onClearStates,
  onTemplateCreate,
  isOpen,
  setIsOpen,
}: IProps) => {
  const filtersRef = useRef<INestedFilterForwardRef | null>(null);

  const [activeStep, setActiveStep] = useState<IStepItemModel | null>(null);

  const [templateName, setTemplateName] = useState('');
  const [isErrorTemplateName, setIsErrorTemplateName] = useState(false);
  const [errorMessageTemplateName, setErrorMessageTemplateName] = useState('');

  const [filterState, setFilterState] = useState<INestedMultiFilterForm | null>(null);
  const [selectedTmo, setSelectedTmo] = useState<ITmoInfo | null>(null);
  const [tmoInfoErrorMessage, setTmoInfoErrorMessage] = useState<string | null>(null);
  const [minElementsCount, setMinElementsCount] = useState(0);
  const [ranges, setRanges] = useState<Record<string, IInventoryFilterModel[]> | null>(null);
  const [selectedTprms, setSelectedTprms] = useState<ITprmsListItem[]>([]);
  const [isActiveRanges, setIsActiveRanges] = useState(false);

  const { data: paramsByTypeId } = useGetObjectTypeParamTypesQuery(
    { id: selectedTmo?.id! },
    { skip: !selectedTmo?.id },
  );

  const tprmsList = useMemo(() => {
    const neededValType = ['date', 'datetime'];
    const wholeList = paramsByTypeId?.map(({ name, id }) => ({ label: name, id })) ?? [];
    const dataTimeList =
      paramsByTypeId?.flatMap((item) => {
        if (neededValType.includes(item.val_type)) {
          return { label: item.name, id: item.id };
        }
        return [];
      }) ?? [];
    return { wholeList, dataTimeList };
  }, [paramsByTypeId]);

  const clearStates = () => {
    setTemplateName('');
    setIsErrorTemplateName(false);
    setTmoInfoErrorMessage(null);
    setMinElementsCount(0);
    filtersRef.current = null;
    setRanges({});
    setSelectedTprms([]);
    onClearStates?.();
  };

  useEffect(() => {
    if (!isOpen) clearStates();
  }, [isOpen]);
  useEffect(() => {
    if (!activeStep && list.length) setActiveStep(list[0]);
  }, [activeStep, list]);
  useEffect(() => {
    if (selectedTmo && tmoInfoErrorMessage != null) {
      setTmoInfoErrorMessage(null);
    }
  }, [selectedTmo, tmoInfoErrorMessage]);

  useEffect(() => {
    filtersRef?.current?.onClearAll?.();
  }, [selectedTmo]);

  const checkFiltersHaveError = () => {
    const formState = filtersRef.current?.getFormState?.();
    return Object.keys(formState?.errors ?? {}).length > 0;
  };

  const onApplyFilter = (state: INestedMultiFilterForm) => {
    setFilterState({ ...state, ...(selectedTmo && { selectedTmo }) });
  };

  const onSaveTemplate = async () => {
    if (templateName.trim().length <= 0) {
      setIsErrorTemplateName(true);
      setErrorMessageTemplateName('Field cannot be empty');
    }
    if (!selectedTmo) {
      setTmoInfoErrorMessage('You must select an object type');
    }

    if (templateName.trim().length > 0 && selectedTmo?.id) {
      const createdTemplateBody = getCreateTemplateBody({
        name: templateName,
        multiFilterForm: filterState,
        min_qnt: minElementsCount,
        ranges_object: isActiveRanges ? ranges ?? undefined : undefined,
        identical: selectedTprms.map((t) => t.id),
        tmo_id: selectedTmo.id,
      });
      await onTemplateCreate?.(createdTemplateBody);
    }
    handleClose?.();
  };

  const onStepClick = (step: IStepItemModel) => {
    setActiveStep(step);
  };

  const onNextOrSave = async (step: IStepItemModel | null) => {
    if (!step) return;
    const { index, label } = step;

    const goNext = () => {
      const nextElem = getElementByIndex(index + 1);
      if (nextElem) setActiveStep(nextElem);
    };

    if (label === 'Name') {
      if (templateName.trim().length > 0) {
        goNext();
      } else {
        setIsErrorTemplateName(true);
        setErrorMessageTemplateName('Field cannot be empty');
      }
    }

    if (label === 'Filter') {
      filtersRef.current?.onApply?.();

      if (!selectedTmo) {
        setTmoInfoErrorMessage('You must select an object type');
      } else {
        setTimeout(() => {
          const haveError = checkFiltersHaveError();
          if (!haveError) goNext();
        }, 100);
      }
    }

    if (label === 'Ranges') {
      await onSaveTemplate();
    }
  };
  const onCancelOrPrev = (step: IStepItemModel | null) => {
    if (!step) return;
    const { index, label } = step;

    const goPrev = () => {
      const prevElem = getElementByIndex(index - 1);
      if (prevElem) setActiveStep(prevElem);
    };

    if (label === 'Filter') {
      goPrev();
      return;
    }

    if (label === 'Ranges') {
      goPrev();
      return;
    }

    if (label === 'Name') {
      setIsOpen?.(false);
      clearStates();
    }
  };

  const getIsDisabledNextButton = () => {
    if (activeStep?.label === 'Name') {
      return isErrorTemplateName;
    }

    return false;
  };

  const getErrorIndexes = () => {
    const stepWithErrors: number[] = [];
    if (isErrorTemplateName) {
      stepWithErrors.push(1);
    }
    if (tmoInfoErrorMessage != null) {
      stepWithErrors.push(2);
    }
    return stepWithErrors;
  };

  return (
    <StepByStepCreationComponentStyled>
      <TitleContainer>
        <Typography sx={{ opacity: 0.8 }} variant="h1">
          Create group template
        </Typography>

        {/* <Typography>Additional something</Typography> */}
      </TitleContainer>
      <Header>
        {list.map((i) => (
          <StepsComponent
            onClick={onStepClick}
            key={i.index}
            step={i}
            activeStepIndex={activeStep?.index}
            stepWithErrorIds={getErrorIndexes()}
          />
        ))}
      </Header>
      <Body>
        {activeStep?.label === 'Name' && (
          <NameCreation
            label="Enter template name:"
            name={templateName}
            setName={setTemplateName}
            error={isErrorTemplateName}
            setError={setIsErrorTemplateName}
            errorMessage={errorMessageTemplateName}
          />
        )}
        {activeStep?.label === 'Filter' && (
          <FilterCreation
            selectedFilterState={filterState}
            multerFilterRef={filtersRef}
            selectedTmoInfo={selectedTmo}
            setSelectedTmoInfo={setSelectedTmo}
            errorMessage={tmoInfoErrorMessage}
            onApplyFilter={onApplyFilter}
            minElementsCount={minElementsCount}
            setMinElementsCount={setMinElementsCount}
            selectedTprmList={selectedTprms}
            setSelectedTprmList={setSelectedTprms}
            tprmList={tprmsList.wholeList}
          />
        )}
        {activeStep?.label === 'Ranges' && (
          <RangeCreation
            setRangesList={setRanges}
            isActiveRanges={isActiveRanges}
            setIsActiveRanges={setIsActiveRanges}
            tprmList={tprmsList.dataTimeList}
          />
        )}
      </Body>
      <Footer>
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeStep?.label !== 'Name' && (
            <Button
              onClick={() => {
                setIsOpen?.(false);
                clearStates();
              }}
            >
              Cancel
            </Button>
          )}
          <Button onClick={() => onCancelOrPrev(activeStep)}>
            {activeStep?.label === 'Filter' || activeStep?.label === 'Ranges' ? 'Prev' : 'Cancel'}
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isLoading ? (
            <Button disabled variant="contained">
              <CircularProgress size={23} />
            </Button>
          ) : (
            <Button
              disabled={getIsDisabledNextButton()}
              variant="contained"
              onClick={() => onNextOrSave(activeStep)}
            >
              {activeStep?.label === 'Ranges' ? 'Save' : 'Next'}
            </Button>
          )}
        </div>
      </Footer>
    </StepByStepCreationComponentStyled>
  );
};
