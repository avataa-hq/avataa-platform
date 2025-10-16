import { ForwardedRef, useMemo } from 'react';
import {
  INestedFilterForwardRef,
  INestedMultiFilterForm,
  ITmoInfo,
  objectTypesApi,
} from '6_shared';
import { ObjectTypeAutocomplete } from '5_entites';
import { Autocomplete, TextField, Typography } from '@mui/material';
import {
  BetweenBlock,
  Body,
  FilterCreationStyled,
  Header,
  HeaderBlockItem,
  HeaderLeftBlock,
  HeaderRightBlock,
} from './FilterCreation.styled';
import { ElementsFilter } from '../../ui/elementsFilter/ElementsFilter';
import type { ITprmsListItem } from '../rangeCreation/RangeCreation';

const { useGetObjectTypesQuery } = objectTypesApi;

interface IProps {
  selectedFilterState: INestedMultiFilterForm | null;
  onApplyFilter?: (filterState: INestedMultiFilterForm) => void;
  onChangeFilterForm?: (filterForm: INestedMultiFilterForm) => void;

  skipResponse?: boolean;

  multerFilterRef?: ForwardedRef<INestedFilterForwardRef>;

  selectedTmoInfo?: ITmoInfo | null;
  setSelectedTmoInfo?: (tmo: ITmoInfo | null) => void;

  minElementsCount?: number;
  setMinElementsCount?: (minElementsCount: number) => void;

  errorMessage?: string | null;

  tprmList?: ITprmsListItem[];
  selectedTprmList?: ITprmsListItem[];
  setSelectedTprmList?: (list: ITprmsListItem[]) => void;
}

export const FilterCreation = ({
  multerFilterRef,
  onApplyFilter,
  onChangeFilterForm,
  selectedFilterState,

  skipResponse,

  selectedTmoInfo,
  setSelectedTmoInfo,

  minElementsCount,
  setMinElementsCount,

  errorMessage,

  tprmList,
  selectedTprmList,
  setSelectedTprmList,
}: IProps) => {
  const {
    data: objectTypeList,
    isFetching: isFetchingObjectTypeList,
    isError: isErrorObjectTypeList,
  } = useGetObjectTypesQuery(undefined, { skip: skipResponse || !setSelectedTmoInfo });

  const tmoListData = useMemo<ITmoInfo[]>(() => {
    return (
      objectTypeList?.flatMap((tmo) => {
        return { name: tmo.name, id: tmo.id };
      }) ?? []
    );
  }, [objectTypeList]);

  return (
    <FilterCreationStyled>
      <Header>
        <HeaderLeftBlock>
          <HeaderBlockItem>
            <Typography
              color={errorMessage ? 'error' : 'inherit'}
              sx={{ opacity: errorMessage ? 1 : 0.7 }}
            >
              {errorMessage || 'Select object type:'}
            </Typography>
          </HeaderBlockItem>
          <HeaderBlockItem>
            <ObjectTypeAutocomplete
              value={selectedTmoInfo}
              onChange={setSelectedTmoInfo}
              options={tmoListData}
              isLoading={isFetchingObjectTypeList}
              isError={isErrorObjectTypeList}
            />
          </HeaderBlockItem>
        </HeaderLeftBlock>

        <HeaderRightBlock flex={1}>
          <HeaderBlockItem>
            <Typography sx={{ opacity: errorMessage ? 1 : 0.7 }}>Min threshold:</Typography>
          </HeaderBlockItem>
          <HeaderBlockItem>
            <TextField
              value={minElementsCount ?? 0}
              onChange={({ target }) => {
                if (+target.value >= 0) setMinElementsCount?.(+target.value);
              }}
            />
          </HeaderBlockItem>
        </HeaderRightBlock>
      </Header>
      <BetweenBlock>
        <Typography>Identical: </Typography>
        <Autocomplete
          multiple
          fullWidth
          options={tprmList ?? []}
          value={selectedTprmList ?? []}
          onChange={(_, val) => {
            setSelectedTprmList?.(val);
          }}
          renderInput={(props) => <TextField {...props} />}
        />
      </BetweenBlock>
      <Body>
        <Typography sx={{ paddingLeft: '10px' }}>Filters</Typography>
        <ElementsFilter
          onApplyFilter={onApplyFilter}
          selectedFilterState={selectedFilterState}
          multerFilterRef={multerFilterRef}
          currentTmoId={selectedTmoInfo?.id}
          skipResponse={skipResponse}
          onChangeFilterForm={onChangeFilterForm}
        />
      </Body>
    </FilterCreationStyled>
  );
};
