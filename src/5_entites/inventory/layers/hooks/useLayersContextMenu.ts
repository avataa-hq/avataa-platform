import { useLayersSlice } from '6_shared';

export const useLayersContextMenu = () => {
  const { setIsCreateFolderModalOpen, setIsCreateLayerModalOpen } = useLayersSlice();

  const handleLayerMenuItemClick = (menuItem: string) => {
    switch (menuItem) {
      case 'createFolder':
        setIsCreateFolderModalOpen(true);
        break;

      case 'createLayer':
        setIsCreateLayerModalOpen(true);
        break;

      default:
        break;
    }
  };

  return { handleLayerMenuItemClick };
};
