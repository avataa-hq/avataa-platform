import {
  getCoordinatesFromInventoryObject,
  GetNodesByMoIdModel,
  IInventoryObjectModel,
  useAppNavigate,
  useAssociatedObjects,
  useDiagramsPage,
  useInventory,
  useInventoryMapWidget,
  useObjectCRUD,
  useObjectDetails,
} from '6_shared';
import { InventoryContextMenuClickEventHandler } from '5_entites';
import { MainModuleListE } from '../../../../config/mainModulesConfig';

interface IProps {
  tmoId?: number;
  inventoryObjectData: IInventoryObjectModel;
  setIsMultipleEditOpen?: (value: boolean) => void;
  setIsShowCommonPathOpen?: (value: boolean) => void;
  setIsFindPathOpen?: (value: boolean) => void;
}
export const useContextMenu = ({
  tmoId,
  inventoryObjectData,
  setIsMultipleEditOpen,
  setIsShowCommonPathOpen,
  setIsFindPathOpen,
}: IProps) => {
  const navigate = useAppNavigate();

  const { setSelectedObject, setRequestedObjectId, setTempCoordinates, setMapData } =
    useInventoryMapWidget();
  const { setChangeObjectActivityStatusModal, setIsFileViewerOpen, setIsHistoryModalOpen } =
    useInventory();
  const { setIsObjectCRUDModalOpen, setObjectCRUDComponentMode, setDuplicateObject } =
    useObjectCRUD();
  const { setSkipFetching, setIsOpenAssociatedTableModal, pushToObjectHistory } =
    useAssociatedObjects();
  const { pushObjectIdToStack } = useObjectDetails();
  const { setGraphInitialData, setSelectedDiagram } = useDiagramsPage();

  const handleContextMenuItemClick: InventoryContextMenuClickEventHandler = (item, value) => {
    switch (item) {
      case 'Details':
        navigate(MainModuleListE.objectDetails);
        setIsOpenAssociatedTableModal(false);
        // TODO: Find a way to fix types so the `value` will automatically infer its type and the `as number` will not be necessary
        if (value) pushObjectIdToStack(value as number);

        break;

      case 'Edit':
        if (tmoId) {
          setIsObjectCRUDModalOpen(true);
          setObjectCRUDComponentMode('editing');
        }

        break;

      case 'Delete':
        setChangeObjectActivityStatusModal({
          isOpen: true,
          role: 'Delete',
        });

        break;
      case 'Delete Permanently':
        setChangeObjectActivityStatusModal({
          isOpen: true,
          role: 'Delete Permanently',
        });

        break;

      case 'Restore':
        setChangeObjectActivityStatusModal({
          isOpen: true,
          role: 'Restore',
        });

        break;

      case 'View files':
        // Unnecessary?
        setIsFileViewerOpen(true);

        break;

      case 'Show on a map':
        if (!inventoryObjectData) return;

        navigate(MainModuleListE.map);
        setRequestedObjectId([inventoryObjectData.id]);

        // eslint-disable-next-line no-case-declarations
        const position = getCoordinatesFromInventoryObject(inventoryObjectData);
        if (position) {
          setSelectedObject({ object: inventoryObjectData, position });
          setMapData([inventoryObjectData]);

          setTempCoordinates({
            latitude: position.latitude,
            longitude: position.longitude,
            zoom: 14,
            speed: 3.5,
          });
        }

        break;

      case 'Show in diagram':
        if (value) {
          // TODO: Find a way to fix types so the `value` will automatically infer its type and the `as GetNodesByMoIdModel` will not be necessary
          const objectDiagram = value as GetNodesByMoIdModel;
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
        break;

      case 'Show linked objects':
        pushToObjectHistory({ id: inventoryObjectData.id, popupType: 'linked' });
        setSkipFetching(false);

        setIsOpenAssociatedTableModal({
          isOpen: true,
          type: 'linked',
          initialId: inventoryObjectData.id,
        });
        break;

      case 'Show history':
        setIsHistoryModalOpen(true);
        break;

      case 'Show related objects':
        pushToObjectHistory({ id: inventoryObjectData.id, popupType: 'related' });
        setSkipFetching(false);

        setIsOpenAssociatedTableModal({
          isOpen: true,
          type: 'related',
          initialId: inventoryObjectData.id,
        });
        break;

      case 'Show child objects':
        pushToObjectHistory({ id: inventoryObjectData.id, popupType: 'children' });
        setSkipFetching(false);

        setIsOpenAssociatedTableModal({
          isOpen: true,
          type: 'children',
          initialId: inventoryObjectData.id,
        });

        break;

      case 'Find a path':
        setIsFindPathOpen?.(true);

        break;

      case 'Show common path':
        setIsShowCommonPathOpen?.(true);

        break;

      case 'Edit selected objects':
        setIsMultipleEditOpen?.(true);
        break;

      case 'Duplicate':
        if (tmoId) {
          setIsObjectCRUDModalOpen(true);
          setObjectCRUDComponentMode('creating');
          setDuplicateObject(true);
        }

        break;

      default:
        break;
    }
  };

  return { handleContextMenuItemClick };
};
