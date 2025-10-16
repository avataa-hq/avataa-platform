import { useMemo, useState } from 'react';
import { List } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IFolderModel, ILayerModel, IListItemData, useLayersSlice } from '6_shared';
import { LayersListItem } from '../layersListItem/LayersListItem';

interface IProps {
  foldersDataByParentFolderId: IFolderModel[] | undefined;
  layersByFolderIdData: ILayerModel[] | undefined;
}

export const LayersList = ({ foldersDataByParentFolderId, layersByFolderIdData }: IProps) => {
  const [draggedItemId, setDraggedItemId] = useState<null | number>(null);

  const {
    selectedLayers,
    foldersSequence,
    setSelectedLayersItem,
    setIsDeleteModalOpen,
    setIsEditFolderModalOpen,
    setIsEditLayerModalOpen,
    setActiveFolder,
    setSelectedLayers,
    setFoldersSequence,
  } = useLayersSlice();

  const listItemData: IListItemData[] = useMemo(() => {
    if (!foldersDataByParentFolderId || !layersByFolderIdData) return [];
    return [...foldersDataByParentFolderId, ...layersByFolderIdData].reduce((acc, item) => {
      if (item.id === draggedItemId) {
        return acc;
      }

      const newItem: IListItemData = {
        id: item.id,
        name: item.name,
        ['file_link' in item ? 'folder_id' : 'parent_id']:
          'file_link' in item ? item.folder_id : item.parent_id,
        type: 'file_link' in item ? 'layer' : 'folder',
        icon: 'file_link' in item ? <InsertDriveFileIcon /> : <FolderIcon />,
        checked: selectedLayers.some((l) => l.id === item.id),
      };

      acc.push(newItem);

      return acc;
    }, [] as IListItemData[]);
  }, [foldersDataByParentFolderId, layersByFolderIdData, selectedLayers, draggedItemId]);

  const onStartDrag = (itemId: number | null) => {
    setDraggedItemId(itemId);
  };

  const onActionButtonClick = (newListItem: IListItemData, action: 'edit' | 'delete') => {
    const { icon, ...item } = newListItem;
    setSelectedLayersItem(item);

    if (action === 'delete') {
      setIsDeleteModalOpen(true);
    }

    if (action === 'edit' && newListItem.type === 'folder') {
      setIsEditFolderModalOpen(true);
    }

    if (action === 'edit' && newListItem.type === 'layer') {
      setIsEditLayerModalOpen(true);
    }
  };

  const onFolderDoubleClick = (newListItem: IListItemData) => {
    const { icon, ...item } = newListItem;
    setActiveFolder(item);
    setFoldersSequence([...foldersSequence, item.id]);
  };

  const handleCheckLayerChange = (checked: boolean, layerId: number) => {
    if (!layersByFolderIdData) return;
    const layer = layersByFolderIdData.find((l) => l.id === layerId);
    if (!layer) return;
    if (checked) {
      setSelectedLayers([...selectedLayers, layer]);
    }

    if (!checked) {
      setSelectedLayers(selectedLayers.filter((l) => l.id !== layerId));
    }
  };

  return (
    <List>
      {listItemData?.map((item) => (
        <LayersListItem
          key={`${item.id}${item.name}`}
          listItem={item}
          onClick={onActionButtonClick}
          onFolderDoubleClick={onFolderDoubleClick}
          handleCheckLayerChange={handleCheckLayerChange}
          onStartDrag={onStartDrag}
        />
      ))}
    </List>
  );
};
