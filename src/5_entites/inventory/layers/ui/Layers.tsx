import { useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from '@mui/material';
import { LoadingAvataa, useDebounceValue, useLayersSlice } from '6_shared';
import { alpha } from '@mui/system';
import { useGetFolders, useGetFoldersByParentFolderId, useGetLayersByFolderId } from '../api';
import { LayersContextMenu } from './layersContextMenu/LayersContextMenu';
import { LayersList } from './layersList/LayersList';
import {
  ConfirmDropModal,
  CreateFolderModal,
  DeleteLayersModal,
  UpdateFolderModal,
} from './modals';
import { UpdateLayerModal, UploadLayerModal } from './modals/layers';
import { LayersHeader } from './layersHeader/LayersHeader';
import * as SC from './Layers.styled';

export const Layers = () => {
  const theme = useTheme();
  const [menuPosition, setMenuPosition] = useState<null | { mouseX: number; mouseY: number }>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { foldersSequence } = useLayersSlice();

  const { foldersData, isFoldersFetching } = useGetFolders();
  const { foldersDataByParentFolderId, isFoldersByParentFolderIdFetching } =
    useGetFoldersByParentFolderId({
      parent_folder_id: foldersSequence[foldersSequence.length - 1],
    });
  const { layersByFolderIdData, isLayersByFolderIdFetching } = useGetLayersByFolderId({
    folder_id: foldersSequence[foldersSequence.length - 1],
  });

  const isLoading =
    isFoldersFetching || isFoldersByParentFolderIdFetching || isLayersByFolderIdFetching;

  const handleSearchQueryChange = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setMenuPosition(null);
  };

  const filteredFoldersDataByParentFolderId = useMemo(() => {
    if (debouncedSearchQuery && foldersDataByParentFolderId) {
      return foldersDataByParentFolderId.filter((folder) =>
        folder.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
    }
    return foldersDataByParentFolderId;
  }, [foldersDataByParentFolderId, debouncedSearchQuery]);

  const filteredLayersByFolderIdData = useMemo(() => {
    if (debouncedSearchQuery && layersByFolderIdData) {
      return layersByFolderIdData.filter((layer) =>
        layer.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
    }
    return layersByFolderIdData;
  }, [layersByFolderIdData, debouncedSearchQuery]);

  return (
    <DndProvider backend={HTML5Backend}>
      <SC.LayersStyled>
        {isLoading && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}

        <SC.Header>
          <LayersHeader searchQuery={searchQuery} setSearchQuery={handleSearchQueryChange} />
        </SC.Header>
        <SC.Body
          sx={
            isLoading
              ? {
                  opacity: '0.5',
                  pointerEvents: 'none',
                  backgroundColor: alpha(theme.palette.neutral.surface, 0.5),
                }
              : {}
          }
          onContextMenu={handleContextMenu}
        >
          <LayersList
            foldersDataByParentFolderId={filteredFoldersDataByParentFolderId}
            layersByFolderIdData={filteredLayersByFolderIdData}
          />

          <LayersContextMenu handleClose={handleCloseContextMenu} menuPosition={menuPosition} />
        </SC.Body>

        <CreateFolderModal foldersData={foldersData} />
        <UpdateFolderModal foldersData={foldersData} />
        <DeleteLayersModal />
        <UploadLayerModal foldersData={foldersData} />
        <UpdateLayerModal foldersData={foldersData} />
        <ConfirmDropModal />
      </SC.LayersStyled>
    </DndProvider>
  );
};
