import { Dispatch, memo, ReactNode, SetStateAction, useEffect, useMemo } from 'react';
import {
  Layers,
  LiveUpdateToggle,
  TemplatesComponent,
  TreeObjectTypes,
  useGetObjectTypes,
} from '5_entites';
import {
  ActionTypes,
  IFilterSetModel,
  IHierarchyData,
  ILeftPanelSelectedTab,
  InventoryObjectTypesModel,
  useDebounceValue,
  useHierarchy,
  useLeftPanelWidget,
  useRegistration,
  userSettingsApi,
  useTabs,
} from '6_shared';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import LayersIcon from '@mui/icons-material/Layers';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import ErrorBoundary from '5_entites/errorBoundary/ErrorBoundary';
import { LeftPanelStyled, LeftPanelContent, LeftPanelControl } from './LeftPanel.styled';
import { ContentSwitchButton } from './contentSwitchButton/ContentSwitchButton';
import { HierarchyComponent } from './hierarchyComponent/HierarchyComponent';
import { FilterInput } from './filterInput/FilterInput';
import { MultiFilterComponent } from './multifilterComponent/ui/MultiFilterComponent';
import { ContentContainer } from './contentContainer/ContentContainer';
import { useObjectTypesData } from '../lib/useObjectTypesData';

interface IMultiFilterData {
  setFilterItemLeftSlot?: (item: IFilterSetModel) => ReactNode;
  setFilterItemRightSlot?: (item: IFilterSetModel) => ReactNode;
  refetchAfterSuccess?: () => void;
}

interface ILiveUpdateData {
  isLiveUpdate?: boolean;
  setIsLiveUpdate?: Dispatch<SetStateAction<boolean>>;
  isLoadingLiveData?: boolean;
  isErrorLiveData?: boolean;
}

interface IObjectTypesData {
  getParentRightSideElements?: (item: InventoryObjectTypesModel) => ReactNode;
  getChildRightSideElements?: (item: InventoryObjectTypesModel) => ReactNode;
  getChildLeftSideElements?: (item: InventoryObjectTypesModel) => ReactNode;
  objectTypeIds?: number[];
}

interface IProps {
  objectTypesData?: IObjectTypesData;
  liveUpdateData?: ILiveUpdateData;
  hierarchyData?: IHierarchyData;
  multiFilterData?: IMultiFilterData;
  isObjectTypeFirstSelected?: boolean;
  withLifecycle?: boolean;
  objectTypesAnchor?: string;
  permissions?: Record<ActionTypes, boolean>;
}

export const LeftPanel = memo(
  ({
    objectTypesData,
    liveUpdateData,
    hierarchyData,
    multiFilterData,
    isObjectTypeFirstSelected,
    withLifecycle,
    objectTypesAnchor,
    permissions,
  }: IProps) => {
    const { useGetUserSettingByKeyQuery } = userSettingsApi;

    useRegistration(['hierarchy', 'leftPanelWidget']);

    const { selectedTabs, searchValues, setSelectedTab, setSearchValue } = useLeftPanelWidget();
    const { selectedObjectTypeItem, setSelectedObjectTypeItem } = useHierarchy();
    const { selectedTab: activePage } = useTabs();
    const searchDebounceValue = useDebounceValue(searchValues[activePage]);

    const objectTypesServerData = useObjectTypesData({
      searchValue: searchDebounceValue,
    });

    const { data: userData } = useGetUserSettingByKeyQuery('component:object_types');

    const favorites = useMemo(() => {
      // @ts-ignore
      return (userData?.settings.favorite as number[]) || [];
    }, [userData]);

    const { objectTypesData: objectTypesFavorites } = useGetObjectTypes({
      objectTypesIds: favorites,
      skip: !favorites.length,
    });

    useEffect(() => {
      if (!isObjectTypeFirstSelected) return;
      if (objectTypesServerData.childrenItems.length && !selectedObjectTypeItem) {
        setSelectedObjectTypeItem(objectTypesServerData.childrenItems[0]);
      }
    }, [isObjectTypeFirstSelected, objectTypesServerData, selectedObjectTypeItem]);

    const handleTabChange = (tab: ILeftPanelSelectedTab) => {
      setSelectedTab({ value: tab, module: activePage });
      setSearchValue({ value: '', module: activePage });
    };
    const onInputHandleChange = (value: string) => {
      setSearchValue({ value, module: activePage });
    };

    const favoritesObjectTypesData = (data: any) => {
      return {
        ...data,
        childrenItems: userData && favorites.length ? objectTypesFavorites : [],
      };
    };

    return (
      <LeftPanelStyled>
        <LeftPanelContent>
          {selectedTabs[activePage] === 'topology' && (
            <HierarchyComponent
              hierarchyData={hierarchyData}
              withLifecycle={withLifecycle}
              permissions={permissions}
              // footerSlot={
              //   liveUpdateData && (
              //     <LiveUpdateToggle
              //       checked={liveUpdateData.isLiveUpdate}
              //       setIsLiveUpdate={liveUpdateData.setIsLiveUpdate}
              //       isLoading={liveUpdateData.isLoadingLiveData}
              //       isError={liveUpdateData.isErrorLiveData}
              //       permissions={permissions}
              //     />
              //   )
              // }
            />
          )}
          {(selectedTabs[activePage] === 'objectTypes' ||
            selectedTabs[activePage] === 'favorites') && (
            <ContentContainer
              headerPercentHeight={10}
              bodyPercentHeight={90}
              headerSlot={
                selectedTabs[activePage] === 'favorites' ? null : (
                  <FilterInput
                    value={searchValues[activePage]}
                    onChange={onInputHandleChange}
                    objectTypes={objectTypesServerData.childrenItems}
                    isFetchingObjectTypes={objectTypesServerData.isFetchingChildrenItems}
                    objectTypesAnchor={objectTypesAnchor}
                    permissions={permissions}
                  />
                )
              }
              bodySlot={
                objectTypesData ? (
                  <TreeObjectTypes
                    {...(selectedTabs[activePage] === 'favorites'
                      ? favoritesObjectTypesData(objectTypesServerData)
                      : objectTypesServerData)}
                    {...objectTypesData}
                    anchor={objectTypesAnchor}
                    permissions={permissions}
                    favorites={favorites}
                    showParents={selectedTabs[activePage] !== 'favorites'}
                    // @ts-ignore lint
                    showFavorite={selectedTabs[activePage] !== 'topology'}
                  />
                ) : (
                  <TreeObjectTypes
                    {...(selectedTabs[activePage] === 'favorites'
                      ? favoritesObjectTypesData(objectTypesServerData)
                      : objectTypesServerData)}
                    anchor={objectTypesAnchor}
                    permissions={permissions}
                    favorites={favorites}
                    showParents={selectedTabs[activePage] !== 'favorites'}
                    // @ts-ignore lint
                    showFavorite={selectedTabs[activePage] !== 'topology'}
                  />
                )
              }
              footerSlot={
                liveUpdateData && (
                  <LiveUpdateToggle
                    checked={liveUpdateData.isLiveUpdate}
                    setIsLiveUpdate={liveUpdateData.setIsLiveUpdate}
                    isLoading={liveUpdateData.isLoadingLiveData}
                    isError={liveUpdateData.isErrorLiveData}
                    permissions={permissions}
                  />
                )
              }
            />
          )}
          {activePage === 'processManager' && selectedTabs[activePage] === 'filters' && (
            <ContentContainer
              bodyPercentHeight={90}
              footerPercentHeight={10}
              bodySlot={
                <MultiFilterComponent
                  setFilterItemRightSlot={multiFilterData?.setFilterItemRightSlot}
                  setFilterItemLeftSlot={multiFilterData?.setFilterItemLeftSlot}
                  refetchAfterSuccess={multiFilterData?.refetchAfterSuccess}
                  searchValue={searchValues[activePage]}
                  onInputHandleChange={onInputHandleChange}
                  permissions={permissions}
                />
              }
              footerSlot={
                liveUpdateData && (
                  <LiveUpdateToggle
                    checked={liveUpdateData.isLiveUpdate}
                    setIsLiveUpdate={liveUpdateData.setIsLiveUpdate}
                    isLoading={liveUpdateData.isLoadingLiveData}
                    isError={liveUpdateData.isErrorLiveData}
                    permissions={permissions}
                  />
                )
              }
            />
          )}
          {activePage === 'map' && selectedTabs[activePage] === 'layers' && <Layers />}

          {['processManager', 'map', 'inventory'].includes(activePage) &&
            permissions?.view === true &&
            selectedTabs[activePage] === 'templates' && (
              <ErrorBoundary fallback="Error in the templates">
                <TemplatesComponent activePage={activePage} permissions={permissions} />
              </ErrorBoundary>
            )}
        </LeftPanelContent>
        <LeftPanelControl>
          <ContentSwitchButton
            selected={selectedTabs[activePage] === 'topology'}
            onClick={() => handleTabChange('topology')}
            data-testid="inventory-leftPanel__contentSwitch_topology"
          >
            <AccountTreeRoundedIcon />
          </ContentSwitchButton>
          <ContentSwitchButton
            selected={selectedTabs[activePage] === 'objectTypes'}
            onClick={() => handleTabChange('objectTypes')}
            data-testid="inventory-leftPanel__contentSwitch_objectTypes"
          >
            <RoomPreferencesRoundedIcon />
          </ContentSwitchButton>
          {activePage === 'processManager' && (
            <ContentSwitchButton
              selected={selectedTabs[activePage] === 'filters'}
              onClick={() => handleTabChange('filters')}
              data-testid="inventory-leftPanel__contentSwitch_filters"
            >
              <FilterAltIcon />
            </ContentSwitchButton>
          )}
          <ContentSwitchButton
            selected={selectedTabs[activePage] === 'favorites'}
            onClick={() => handleTabChange('favorites')}
            data-testid="inventory-leftPanel__contentSwitch_favorites"
          >
            <StarRateRoundedIcon />
          </ContentSwitchButton>
          {activePage === 'map' && (
            <ContentSwitchButton
              selected={selectedTabs[activePage] === 'layers'}
              onClick={() => handleTabChange('layers')}
              data-testid="inventory-leftPanel__contentSwitch_layers"
            >
              <LayersIcon />
            </ContentSwitchButton>
          )}
          {['processManager', 'map', 'inventory'].includes(activePage) &&
            permissions?.view === true && (
              <ContentSwitchButton
                selected={selectedTabs[activePage] === 'templates'}
                onClick={() => handleTabChange('templates')}
                data-testid="inventory-leftPanel__contentSwitch_templates"
              >
                <SnippetFolderIcon />
              </ContentSwitchButton>
            )}
        </LeftPanelControl>
      </LeftPanelStyled>
    );
  },
);
