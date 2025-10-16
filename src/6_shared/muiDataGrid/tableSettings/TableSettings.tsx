import { useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import Divider from '@mui/material/Divider';

import { ActionTypes, ITableColumnSettingsState } from '6_shared';

import { Body, CreateNewSettingContainer, TableSettingsStyled } from './TableSettings.styled';
import { TableColumnControls } from './tableColumnControls/TableColumnControls';
import { SettingsList } from './settingsList/SettingsList';
import { CreateNewSetting } from './createNewSetting/CreateNewSetting';

interface IProps {
  settingState: ITableColumnSettingsState;
  setSettingSetting: (setting: ITableColumnSettingsState) => void;

  selectedSetId: number;
  setSelectedSetId: (selectedSetId: number) => void;

  allSettingsByTmo?: any[];
  isLoadingSettingsList?: boolean;

  onApplySetting?: (settingId: number) => void;
  onSetDefaultSetting?: () => void;
  onDeleteSetting?: (settingId: number) => Promise<void>;
  onOpenUpdateMenu?: () => void;
  onUpdateSetting?: (settingsName: string, isDefault: boolean, isPublic: boolean) => Promise<void>;
  onCreateSetting?: (
    settingName: string,
    isDefault?: boolean,
    isPublic?: boolean,
  ) => Promise<number | null>;
  title: string;
  permissions?: Record<ActionTypes, boolean>;
}
export const TableSettings = ({
  settingState,
  setSettingSetting,
  allSettingsByTmo,
  isLoadingSettingsList,
  onApplySetting,
  onDeleteSetting,
  onSetDefaultSetting,
  onCreateSetting,
  onUpdateSetting,
  onOpenUpdateMenu,
  setSelectedSetId,
  selectedSetId,
  title,
  permissions,
}: IProps) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [isErrorName, setIsErrorName] = useState(false);

  const { name, isDefault, isPublic } = settingState;

  const onSettingsItemClick = (settingId: number) => {
    const currentSet = allSettingsByTmo?.find((set) => set.id === settingId);
    if (currentSet) {
      setSettingSetting({
        name: currentSet.name,
        isDefault: currentSet.default,
        isPublic: currentSet.public,
      });
    }
    setSelectedSetId(settingId);
    onApplySetting?.(settingId);
  };
  const onDeleteClick = async (settingId: number) => {
    await onDeleteSetting?.(settingId);
  };
  const onUpdateClick = async () => {
    onOpenUpdateMenu?.();
    setUpdateMode(true);
  };

  const onSelectDefault = async () => {
    onSetDefaultSetting?.();
  };
  const onSaveClick = async () => {
    if (!name.trim()) {
      setIsErrorName(true);
    } else {
      if (createMode) {
        const createdId = await onCreateSetting?.(name.trim(), isDefault, isPublic);
        if (createdId != null) setSelectedSetId(createdId);
        setCreateMode(false);
      }
      if (updateMode) {
        onUpdateSetting?.(name.trim(), isDefault, isPublic);
        setUpdateMode(false);
      }
      setSettingSetting({ name: '', isPublic: true, isDefault: false });
    }
  };

  const onCancelClick = () => {
    setIsErrorName(false);
    setUpdateMode(false);
    setCreateMode(false);
  };
  const onCreate = () => {
    setCreateMode(true);
    setSettingSetting({ name: '', isPublic: true, isDefault: false });
  };

  return (
    <TableSettingsStyled>
      <Body>
        <SettingsList
          allColumnSettingsByTmo={allSettingsByTmo}
          selectedId={selectedSetId}
          onDelete={onDeleteClick}
          isCreatedMode={updateMode || createMode}
          onItemClick={onSettingsItemClick}
          isLoadingSettingsList={isLoadingSettingsList}
          title={title}
          permissions={permissions}
        />
      </Body>
      <TableColumnControls
        permissions={permissions}
        onSave={onSaveClick}
        onSelectDefault={onSelectDefault}
        isCreateMode={createMode}
        onCansel={onCancelClick}
        onCreate={onCreate}
        updateMode={updateMode}
        onUpdate={onUpdateClick}
        isUpdateDisabled={!selectedSetId || selectedSetId === -1}
      />
      {(createMode || updateMode) && <Divider />}
      {/** @ts-ignore */}
      <Transition
        nodeRef={nodeRef}
        timeout={{ appear: 300, exit: 300, enter: 0 }}
        in={createMode || updateMode}
        unmountOnExit
      >
        {(status) => (
          <CreateNewSettingContainer ref={nodeRef} status={status}>
            {status === 'entered' && (
              <CreateNewSetting
                createMode={createMode}
                setSettingSetting={setSettingSetting}
                settingState={settingState}
                setIsErrorName={setIsErrorName}
                isErrorName={isErrorName}
              />
            )}
          </CreateNewSettingContainer>
        )}
      </Transition>
    </TableSettingsStyled>
  );
};
