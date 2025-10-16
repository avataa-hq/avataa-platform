import { enqueueSnackbar } from 'notistack';
import {
  GetNodesByMoIdModel,
  INestedMultiFilterItem,
  InventoryObjectTypesModel,
  graphApi,
  IInventoryObjectModel,
  useAppNavigate,
  useObjectCRUD,
  useHierarchy,
  useInventoryTable,
  useObjectDetails,
  useDiagramsPage,
} from '6_shared';

import { useMemo } from 'react';
import { MapBoxObjectContextMenuType } from '6_shared/models/inventoryMapWidget/types';
import { OBJECT_CONTEXT_MENU_OPTIONS } from '6_shared/models/inventoryMapWidget/constants';
import { MainModuleListE } from '../../../../config/mainModulesConfig';

interface IProps {
  object?: IInventoryObjectModel;
  setIsFileViewerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsContextMenuOpen?: (isOpen: boolean) => void;
  objectTypesData: InventoryObjectTypesModel[];
  setIsFindPathOpen?: (value: boolean) => void;
}

export const useMapBoxContextMenu = ({
  object,
  setIsFileViewerOpen,
  setIsContextMenuOpen,
  objectTypesData,
  setIsFindPathOpen,
}: IProps) => {
  const { useGetObjectDiagramsQuery } = graphApi.search;
  const navigate = useAppNavigate();

  const { setSelectedRows, setSelectedFilter } = useInventoryTable();
  const { setSelectedObjectTypeItem, setParentId } = useHierarchy();
  const { pushObjectIdToStack } = useObjectDetails();
  const { setGraphInitialData, setSelectedDiagram } = useDiagramsPage();

  const {
    setIsObjectCRUDModalOpen,
    setObjectCRUDComponentMode,
    setLastSelectedTmoId,
    setLineCoordinates,
    setCreateChildObjectId,
    setIsObjectDeleteModalOpen,
    setObjectTmoId,
  } = useObjectCRUD();

  const hierarchyActionsDispatch = async (objectType: InventoryObjectTypesModel) => {
    setSelectedObjectTypeItem(objectType);
    if (objectType.p_id) setParentId(objectType.p_id);
  };

  const createColumnFilter = (newObject: IInventoryObjectModel): INestedMultiFilterItem => ({
    column: {
      id: 'id',
      name: 'Object ID',
      type: 'number',
    },
    logicalOperator: 'and',
    filters: [
      {
        operator: 'equals',
        value: newObject.id.toString(),
      },
    ],
  });

  const { data: objectDiagrams, isFetching: isObjectDiagramsFetching } = useGetObjectDiagramsQuery(
    object?.id!,
    { skip: !object },
  );

  const mapboxContextMenuOptions = useMemo(() => {
    if (!objectDiagrams?.length) return OBJECT_CONTEXT_MENU_OPTIONS;

    return OBJECT_CONTEXT_MENU_OPTIONS.map((option) => {
      if (option.value === 'viewDiagram') {
        return {
          ...option,
          disabled: false,
          isLoading: isObjectDiagramsFetching,
          submenu: objectDiagrams.map((diagram) => ({
            id: diagram.key,
            label: diagram.name,
            value: diagram,
          })),
        };
      }
      return option;
    });
  }, [isObjectDiagramsFetching, objectDiagrams]);

  // TODO: Find a way to dyanamically type the `value` parameter
  const onMapBoxContextMenuItemClick = async (menuType: MapBoxObjectContextMenuType) => {
    switch (menuType) {
      case 'details':
        if (object) {
          navigate(MainModuleListE.objectDetails);
          pushObjectIdToStack(object.id);
        }

        break;

      case 'edit':
        if (object) {
          setObjectCRUDComponentMode('editing');
          setIsObjectCRUDModalOpen(true);
        }
        break;

      case 'delete':
        if (object) {
          setIsObjectDeleteModalOpen(true);
        }

        break;

      case 'viewFiles':
        setIsFileViewerOpen(true);
        break;

      case 'viewTable':
        if (object) {
          const objectType = objectTypesData.find((obj) => obj.id === object.tmo_id);
          if (objectType) {
            await hierarchyActionsDispatch(objectType);

            setSelectedFilter({
              tmoId: objectType.id,
              selectedFilter: {
                columnFilters: [createColumnFilter(object)],
              },
            });
          }
          setSelectedRows([object.id]);
          navigate(MainModuleListE.inventory);
        }

        break;

      case 'findPath':
        if (object) {
          setIsFindPathOpen?.(true);
        }
        break;

      case 'createChild':
        if (object) {
          const objectType = objectTypesData.find((tmo) => tmo.p_id === object.tmo_id);
          if (!objectType) {
            enqueueSnackbar({ variant: 'error', message: 'Cannot create child object' });
          }
          if (objectType) {
            setLastSelectedTmoId(null);
            setObjectTmoId(objectType.id ?? object.tmo_id);
            setCreateChildObjectId(object.id);
            setObjectCRUDComponentMode('creating');
            setIsObjectCRUDModalOpen(true);
            if (objectType.geometry_type === 'line' && object.geometry) {
              setLineCoordinates({
                path: object.geometry.path.coordinates as any,
                pathLength: object.geometry.path_length,
              });
            }
          }
        }

        break;

      default:
        break;
    }

    if (
      menuType.hasOwnProperty('nodes') &&
      menuType.hasOwnProperty('key') &&
      menuType.hasOwnProperty('name')
    ) {
      const objectDiagram = menuType as unknown as GetNodesByMoIdModel;

      navigate(MainModuleListE.diagrams);

      setGraphInitialData({
        nodes: objectDiagram.nodes,
      });

      setSelectedDiagram({
        key: objectDiagram.key,
        name: objectDiagram.name,
        tmo_id: objectDiagram.nodes[0].tmo,
        status: 'Complete',
        error_description: null,
      });
    }

    setIsContextMenuOpen?.(false);
  };
  return { onMapBoxContextMenuItemClick, mapboxContextMenuOptions };
};
