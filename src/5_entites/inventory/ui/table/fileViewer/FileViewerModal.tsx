import { ActionTypes, useInventory } from '6_shared';
import { FileViewerWidget } from '3_widgets';

interface IProps {
  objId: number;
  permissions?: Record<ActionTypes, boolean>;
}

export const FileViewerModal = ({ objId, permissions }: IProps) => {
  const { isFileViewerOpen, setIsFileViewerOpen } = useInventory();

  const onClose = () => setIsFileViewerOpen(false);

  if (!isFileViewerOpen) return null;

  return (
    <FileViewerWidget
      objectId={objId}
      withModal
      isOpen={isFileViewerOpen}
      onClose={onClose}
      permissions={permissions}
    />
  );
};
