import { useMemo, useState } from 'react';
import { FileViewerWidget } from '3_widgets';
import {
  useTranslate,
  ActionTypes,
  useGetPermissions,
  useAppNavigate,
  useObjectDetails,
} from '6_shared';
import { useGetInventoryObjectData } from '5_entites';
import config from 'config';
import { MainModuleListE } from 'config/mainModulesConfig';
import * as SC from './BottomControls.styled';

const documentsENV = config._apiBase8101;

const hasDocEnv = () => {
  return !!(documentsENV && documentsENV.trim() !== '');
};

interface IProps {
  objectId: number | null;
  permissions?: Record<ActionTypes, boolean>;
}

export const BottomControls = ({ objectId, permissions }: IProps) => {
  const translate = useTranslate();
  const navigate = useAppNavigate();

  const detailsPermissions = useGetPermissions('details');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { pushObjectIdToStack } = useObjectDetails();

  const { inventoryObjectData } = useGetInventoryObjectData({ objectId });

  const documentsCount = useMemo(() => inventoryObjectData?.document_count, [inventoryObjectData]);

  const onFilesClick = () => {
    setIsModalOpen(true);
  };

  const handleDetailsClick = () => {
    if (objectId) {
      navigate(MainModuleListE.objectDetails);
      if (objectId) pushObjectIdToStack(objectId);
    }
  };

  return (
    <SC.BottomControlsStyled>
      <SC.ControlsBody>
        <SC.ButtonStyled
          sx={({ palette }) => ({
            color: hasDocEnv() ? palette.text.primary : palette.text.disabled,
          })}
          onClick={hasDocEnv() ? onFilesClick : undefined}
        >
          <SC.FilesIconStyled />
          {translate('Files')}
          <SC.DocumentsCountBox>
            <SC.DocumentsCountText>{documentsCount ?? 0}</SC.DocumentsCountText>
          </SC.DocumentsCountBox>
        </SC.ButtonStyled>
        <SC.ButtonStyled
          sx={({ palette }) => ({
            color: palette.text.primary,
          })}
          onClick={handleDetailsClick}
          disabled={!(detailsPermissions?.view ?? true)}
        >
          <SC.DetailsIconStyled />
          {translate('Details')}
        </SC.ButtonStyled>
      </SC.ControlsBody>

      {isModalOpen && (
        <FileViewerWidget
          objectId={objectId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          withModal
          permissions={permissions}
        />
      )}
    </SC.BottomControlsStyled>
  );
};
