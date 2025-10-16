import { MutableRefObject, useRef, useState } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { Modal, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import styled from '@emotion/styled';

import {
  ITableColumnSettingsModel,
  ITableColumnSettingsValueModel,
  ITableFilterSettingsModel,
  TableSettings,
  ActionTypes,
  ConfirmationModal,
  useTranslate,
} from '6_shared';

import { ITableColumnSettingsState, LazyGetSettingsTriggerType } from './types';
import { useCreateNewSettings, useUpdateSettings } from './hooks';

const ModalContent = styled(Box)`
  position: relative;
  min-width: 500px;
  width: 45%;
  padding: 20px;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 10px;
`;

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tableApiRef: MutableRefObject<GridApiPremium>;
  tmoId: number;
  updateSettings: (params: any) => any;
  addNewSettings: (params: any) => any;
  getSettingsById: LazyGetSettingsTriggerType;
  allSettingsByTmo?: ITableColumnSettingsModel[] | ITableFilterSettingsModel[];
  isLoadingSettingsList: boolean;
  defaultSettingsByTmo?: ITableColumnSettingsModel | ITableFilterSettingsModel;
  deleteSetting: (arg: Record<'id', number>) => void;
  selectedSetId: number;
  setSelectedSetId: (id: number) => void;
  onApplyClick: (id: number) => void;
  title: string;
  permissions?: Record<ActionTypes, boolean>;
}

export const CustomSettingsComponent = ({
  isOpen,
  setIsOpen,
  tableApiRef,
  tmoId,
  updateSettings,
  addNewSettings,
  getSettingsById,
  allSettingsByTmo,
  isLoadingSettingsList,
  defaultSettingsByTmo,
  deleteSetting,
  selectedSetId,
  setSelectedSetId,
  onApplyClick,
  title,
  permissions,
}: IProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const translate = useTranslate();
  const exportState = tableApiRef?.current?.exportState;

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [settingState, setSettingState] = useState<ITableColumnSettingsState>({
    name: '',
    isDefault: false,
    isPublic: true,
  });

  const { updateSetting } = useUpdateSettings({ exportState, updateSettings });
  const { createSettings } = useCreateNewSettings({
    currentTmoId: tmoId,
    exportState,
    addNewSettings,
  });

  const onDeleteSetting = async (settingId: number) => {
    await deleteSetting({ id: settingId });
    if (defaultSettingsByTmo) setSelectedSetId(defaultSettingsByTmo.id);
  };

  const onUpdateSettings = async (
    name: string,
    isDefault: boolean,
    isPublic: boolean,
    value?: ITableColumnSettingsValueModel | null,
  ) => {
    if (selectedSetId === -1) return;

    const existingSet = allSettingsByTmo?.find((set) => set.name === name);
    if (existingSet?.default && isDefault === false) {
      setIsOpenConfirm(true);
    } else {
      await updateSetting({
        name,
        isDefault,
        isPublic,
        settingId: selectedSetId,
        value,
      });
    }
  };
  const onSetDefaultSetting = async () => {
    if (selectedSetId === -1) return;
    const settingBySettingId = await getSettingsById(selectedSetId).unwrap();
    if (settingBySettingId) {
      const { id, name, public: isPublic, value } = settingBySettingId;
      await updateSetting({ name, settingId: id, isDefault: true, isPublic, value });
    }
  };

  const onCreateSetting = async (settingsName: string, isDefault?: boolean, isPublic?: boolean) => {
    const newId: number | null = await createSettings({
      settingsName,
      isPublic,
      setDefault: isDefault,
    });
    return newId;
  };

  const onOpenUpdateMenu = () => {
    if (selectedSetId === -1) return;
    const currentElement = allSettingsByTmo?.find((e) => e.id === selectedSetId);
    if (currentElement) {
      const { name, public: isPublic, default: isDefault } = currentElement;
      setSettingState((p) => ({ ...p, name: name.trim(), isPublic, isDefault }));
    }
  };

  const handleBackdropClick = (e: any) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Modal
        ref={modalRef}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        slotProps={{
          backdrop: {
            onMouseDown: handleBackdropClick,
          },
        }}
      >
        <ModalContent ref={modalContentRef} onMouseDown={(e) => e.stopPropagation()}>
          <IconButton
            sx={{ position: 'absolute', right: '10px', top: '10px' }}
            onClick={() => setIsOpen(false)}
            data-testid="settings-modal__close-button"
          >
            <CloseIcon />
          </IconButton>
          <TableSettings
            settingState={settingState}
            setSettingSetting={setSettingState}
            setSelectedSetId={setSelectedSetId}
            selectedSetId={selectedSetId}
            onApplySetting={onApplyClick}
            onDeleteSetting={onDeleteSetting}
            onUpdateSetting={onUpdateSettings}
            onOpenUpdateMenu={onOpenUpdateMenu}
            onSetDefaultSetting={onSetDefaultSetting}
            onCreateSetting={onCreateSetting}
            allSettingsByTmo={allSettingsByTmo}
            isLoadingSettingsList={isLoadingSettingsList}
            title={title}
            permissions={permissions}
          />
        </ModalContent>
      </Modal>
      <ConfirmationModal
        isOpen={isOpenConfirm}
        setIsOpen={setIsOpenConfirm}
        disabledCancelButton
        onConfirm={() => setIsOpenConfirm(false)}
        message={translate(
          'One of the items should be selected by default. Please just assign the other item as the default item',
        )}
      />
    </>
  );
};
