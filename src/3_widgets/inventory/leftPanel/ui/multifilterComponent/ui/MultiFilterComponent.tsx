import {
  filterSetApi,
  IFilterSetModel,
  INestedMultiFilterForm,
  InputWithIcon,
  useDebounceValue,
  useRegistration,
  searchApiV2,
  ActionTypes,
  transformToMultiFilterOperators,
  useTranslate,
  useProcessManager,
  useLeftPanelWidget,
} from '6_shared';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  useCreateNewFilterSet,
  useDeleteFilterSet,
  // usePatchFilterSet,
  useUpdateFilterSet,
} from '4_features';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { Switch, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MultiFilterWidgetModal } from './multiFilterWidgetModal/MultiFilterWidgetModal';
import {
  MultiFilterComponentStyled,
  Header,
  Body,
  BodyHeader,
  BodyContent,
  BodyFooter,
} from './MultiFilterComponent.styled';
import { FilterSetList } from './filterSetList/FilterSetList';
import SortMenuButton from './sortMenuButton/SortMenuButton';
import { useRestoreFilterSet } from '../lib/useRestoreFilterSet';
import { AddFilterButtonBlock } from './filterSetList/FilterSetList.styled';

const filterByName = <T extends { name: string }>(query: string, array?: T[]) => {
  const lowerCaseQuery = query.toLowerCase();
  return array?.filter((item) => item.name.toLowerCase().includes(lowerCaseQuery));
};

interface IProps {
  setFilterItemLeftSlot?: (item: IFilterSetModel) => ReactNode;
  setFilterItemRightSlot?: (item: IFilterSetModel) => ReactNode;
  searchValue: string;
  onInputHandleChange: (value: string) => void;
  refetchAfterSuccess?: () => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const MultiFilterComponent = ({
  setFilterItemRightSlot,
  setFilterItemLeftSlot,
  searchValue,
  onInputHandleChange,
  refetchAfterSuccess,
  permissions,
}: IProps) => {
  const { useGetAllFilterSetsQuery } = filterSetApi;
  const { useGetOperatorTypeQuery } = searchApiV2;

  const translate = useTranslate();
  useRegistration('leftPanelWidget');

  const [filterState, setFilterState] = useState<INestedMultiFilterForm | null>(null);
  const [selectedFilterSetOnRightClick, setSelectedFilterSetOnRightClick] =
    useState<IFilterSetModel | null>(null);
  const [isOpenMultiFilter, setIsOpenMultiFilter] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const debounceSearchValue = useDebounceValue(searchValue, 200);

  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [changeFilterSetList, setChangeFilterSetList] = useState<IFilterSetModel[]>([]);

  const {
    selectedMultiFilter,
    multiFilterSetList,
    showPrivateOnly,
    setSelectedMultiFilter,
    setMultiFilterSetList,
    setMultiFilterTmoIds,
    setShowPrivateOnly,
  } = useLeftPanelWidget();
  const { setTprmColIds } = useProcessManager();

  const { createFilterSet } = useCreateNewFilterSet();
  const { updateFilterSet } = useUpdateFilterSet();
  const { deleteFilterSet } = useDeleteFilterSet();
  // const { patchFilterSet } = usePatchFilterSet();

  const {
    data: allFilterSetList,
    isFetching: isFetchingAllFilterSets,
    isError: isErrorAllFilterSets,
  } = useGetAllFilterSetsQuery();

  const { data: operatorsData } = useGetOperatorTypeQuery();

  useEffect(() => {
    if (!allFilterSetList) return;

    setMultiFilterSetList(allFilterSetList);

    const tmoInfoIdsSet = new Set<string>();
    const tprmIdsSet = new Set<string>();

    allFilterSetList.forEach((fs) => {
      if (fs.tmo_info?.id != null) {
        const tmoId = String(fs.tmo_info.id);
        tmoInfoIdsSet.add(tmoId);
      }

      if (fs.filters.length) {
        fs.filters.forEach((f) => {
          tprmIdsSet.add(f.column.id);
        });
      }
    });

    const tmoIds = Array.from(tmoInfoIdsSet);
    const tprmIds = Array.from(tprmIdsSet);

    setMultiFilterTmoIds(tmoIds);
    setTprmColIds(tprmIds);
  }, [allFilterSetList]);

  useRestoreFilterSet({ selectedMultiFilter, allFilterSets: allFilterSetList });

  const handleFilterSetItemClick = (filterSet: IFilterSetModel) => {
    if (selectedMultiFilter?.id === filterSet.id) setSelectedMultiFilter(null);
    else setSelectedMultiFilter(filterSet);
  };

  const onFilterSetItemContextMenu = (filterSet: IFilterSetModel) => {
    setSelectedFilterSetOnRightClick(filterSet);
  };

  const onAddClick = () => {
    setIsEditMode(false);
    setFilterState(null);
    setIsOpenMultiFilter(true);
  };

  const onDeleteClick = async (filterSet: IFilterSetModel) => {
    await deleteFilterSet(filterSet.id);
    setSelectedMultiFilter(null);
    refetchAfterSuccess?.();
  };

  const onUpdateClick = (filterSet: IFilterSetModel) => {
    setIsEditMode(true);
    const filterBody: INestedMultiFilterForm = {
      columnFilters: filterSet.filters,
      name: filterSet.name,
      selectedTmo: filterSet.tmo_info,
      isPublic: filterSet.public ?? false,
      readonly: !filterSet.owner,
    };
    setFilterState(filterBody);
    setIsOpenMultiFilter(true);
    setSelectedFilterSetOnRightClick(filterSet);
  };

  const onViewClick = (filterSet: IFilterSetModel) => {
    const filterBody: INestedMultiFilterForm = {
      columnFilters: filterSet.filters,
      name: filterSet.name,
      selectedTmo: filterSet.tmo_info,
      isPublic: filterSet.public ?? false,
      readonly: !filterSet.owner,
    };
    setFilterState(filterBody);
    setIsOpenMultiFilter(true);
  };

  const onCopyClick = (filterSet: IFilterSetModel) => {
    setIsEditMode(false);
    const filterBody: INestedMultiFilterForm = {
      columnFilters: filterSet.filters,
      name: '',
      selectedTmo: filterSet.tmo_info,
      isPublic: filterSet.public ?? false,
      readonly: false,
    };
    setFilterState(filterBody);
    setIsOpenMultiFilter(true);
  };

  const onFilterSetItemContextMenuItemClick = async (
    itemType: 'add' | 'delete' | 'update' | 'view' | 'copy',
  ) => {
    if (itemType === 'add') onAddClick();
    if (itemType === 'delete' && selectedFilterSetOnRightClick) {
      await onDeleteClick(selectedFilterSetOnRightClick);
    }
    if (itemType === 'update' && selectedFilterSetOnRightClick) {
      onUpdateClick(selectedFilterSetOnRightClick);
    }
    if (itemType === 'view' && selectedFilterSetOnRightClick) {
      onViewClick(selectedFilterSetOnRightClick);
    }
    if (itemType === 'copy' && selectedFilterSetOnRightClick) {
      onCopyClick(selectedFilterSetOnRightClick);
    }
  };

  const onApplyFilter = async (formData: INestedMultiFilterForm) => {
    const { columnFilters, name, selectedTmo: tmo_info, isPublic } = formData;
    if (!name || !tmo_info) return;

    const body = {
      name,
      tmo_info,
      filters: columnFilters,
      join_operator: 'AND',
      priority: 0,
      public: isPublic,
      hidden: false,
    };

    if (isEditMode) {
      if (!selectedFilterSetOnRightClick) return;
      await updateFilterSet({ filter_id: selectedFilterSetOnRightClick.id, ...body });
      if (selectedMultiFilter?.id === selectedFilterSetOnRightClick.id) {
        setSelectedMultiFilter({ ...selectedFilterSetOnRightClick, ...body });
      }
    } else {
      const newFilterSet = await createFilterSet(body);
      if (newFilterSet) setSelectedMultiFilter(newFilterSet);
    }
    setFilterState(formData);
    setIsOpenMultiFilter(false);
  };

  const filteredFilterList = useMemo(() => {
    return filterByName(debounceSearchValue, multiFilterSetList);
  }, [debounceSearchValue, multiFilterSetList]);

  const onFilterItemVisibleButtonClick = async (filterSet: IFilterSetModel) => {
    setChangeFilterSetList((prev) => {
      const index = prev.findIndex((p) => p.id === filterSet.id);
      if (index === -1) return [...prev, { ...filterSet, hidden: !filterSet.hidden }];

      return prev.map((p) => {
        if (p.id === filterSet.id) {
          return { ...filterSet, hidden: !filterSet.hidden };
        }
        return p;
      });
    });

    const newMultiFilter = multiFilterSetList?.map((mf) => {
      if (mf.id === filterSet.id) {
        return { ...filterSet, hidden: !filterSet.hidden };
      }
      return mf;
    });

    if (newMultiFilter) {
      setMultiFilterSetList(newMultiFilter);
    }
  };

  const onShowOrHideAll = (mode: 'show' | 'hide') => {
    if (allFilterSetList) {
      const changeList = allFilterSetList.map((afs) => {
        return { ...afs, hidden: mode === 'hide' };
      });
      setChangeFilterSetList(changeList);
      setMultiFilterSetList(changeList);
    }
  };

  // const onSettingsButtonClick = async (mode: 'settings' | 'save') => {
  //   if (mode === 'settings') setIsSettingsMode(true);
  //   else {
  //     const clearList = changeFilterSetList.flatMap((cf) => {
  //       const el = allFilterSetList?.find((afs) => afs.id === cf.id);
  //       if (el && el.hidden === cf.hidden) return [];
  //       return { id: cf.id, hidden: cf.hidden };
  //     });

  //     if (clearList.length) {
  //       await patchFilterSet(clearList);
  //     }
  //     setChangeFilterSetList([]);

  //     setIsSettingsMode(false);
  //   }
  // };

  const onShowPrivateOnly = (isPrivate: boolean) => {
    setShowPrivateOnly(isPrivate);
  };

  return (
    <>
      <MultiFilterComponentStyled>
        <Header>
          <InputWithIcon
            value={searchValue}
            disabled={!(permissions?.view ?? true)}
            onChange={(event) => onInputHandleChange(event.target.value)}
            placeholder={translate('Search')}
            icon={<SearchIcon />}
            iconPosition="right"
          />
          <SortMenuButton
            filterSetList={allFilterSetList}
            isSettingsMode={isSettingsMode}
            setFilterSetList={(filterSet) => {
              setMultiFilterSetList(filterSet);
            }}
          />
          {/* <IconButton */}
          {/*  disabled={!(permissions?.update ?? true)} */}
          {/*  onClick={() => onSettingsButtonClick(isSettingsMode ? 'save' : 'settings')} */}
          {/* > */}
          {/*  {isSettingsMode ? ( */}
          {/*    <CheckCircleRoundedIcon sx={({ palette }) => ({ fill: palette.success.main })} /> */}
          {/*  ) : ( */}
          {/*    <SettingsIcon /> */}
          {/*  )} */}
          {/* </IconButton> */}
        </Header>
        <Body>
          <BodyHeader>
            <Switch
              value={showPrivateOnly}
              onChange={(_, checked) => {
                onShowPrivateOnly(checked);
              }}
            />
            <Typography sx={{ opacity: showPrivateOnly ? '0.8' : '0.5' }}>
              {translate('Show private only')}
            </Typography>
          </BodyHeader>

          <BodyContent>
            <FilterSetList
              filterSetList={filteredFilterList}
              isLoadingItemData={false}
              isErrorItemData={false}
              isErrorList={isErrorAllFilterSets}
              isLoadingList={isFetchingAllFilterSets}
              selectedFilterSet={selectedMultiFilter}
              onFilterItemClick={handleFilterSetItemClick}
              onFilterItemContextMenu={onFilterSetItemContextMenu}
              onFilterSetItemContextMenuItemClick={onFilterSetItemContextMenuItemClick}
              setFilterItemLeftSlot={setFilterItemLeftSlot}
              setFilterItemRightSlot={setFilterItemRightSlot}
              permissions={permissions}
              onFilterItemVisibleButtonClick={onFilterItemVisibleButtonClick}
              isSettingsMode={isSettingsMode}
              onShowOrHideAll={onShowOrHideAll}
              isShowPrivateOnly={showPrivateOnly}
            />
          </BodyContent>

          <BodyFooter>
            {!isSettingsMode && (
              <AddFilterButtonBlock
                disabled={!(permissions?.view ?? true)}
                onClick={() =>
                  (permissions?.view ?? true) && onFilterSetItemContextMenuItemClick?.('add')
                }
              >
                <AddIcon />
                <Typography>{translate('Add new filter')}</Typography>
              </AddFilterButtonBlock>
            )}
          </BodyFooter>
        </Body>
      </MultiFilterComponentStyled>
      <MultiFilterWidgetModal
        isOpen={isOpenMultiFilter}
        setIsOpen={setIsOpenMultiFilter}
        onApplyFilter={onApplyFilter}
        filterState={filterState}
        operatorsData={transformToMultiFilterOperators(operatorsData)}
      />
    </>
  );
};
