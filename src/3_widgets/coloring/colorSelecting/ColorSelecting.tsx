import { useEffect, useMemo, useState } from 'react';
import {
  IColorRangeModel,
  Modal,
  ModuleNames,
  TprmData,
  useColorsConfigure,
  useConfig,
  useGetPermissions,
  useTabs,
  useUser,
} from '6_shared';

import { Table } from './ui/table/Table';
import { CreateRejectionModal, DeleteConfirmationModal, DeleteRejectionModal } from '../modals';
import { useActions } from './lib/useActions';
import { Header } from './ui/header/Header';
import { Buttons } from './ui/buttons/Buttons';

interface IProps {
  handleApplyColors?: ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => void;
  palettes?: IColorRangeModel[];
  settingsOnly?: boolean;
  selectingOnly?: boolean;
  selectedPaletteId?: number;
  tprms?: TprmData[] | TprmData;
  palettesLoaded?: boolean;
  disablePortal?: boolean;
  isFromAdmin?: boolean;
}

export const ColorSelecting = ({
  handleApplyColors,
  palettes,
  settingsOnly,
  selectingOnly,
  selectedPaletteId,
  tprms,
  palettesLoaded,
  disablePortal = false,
  isFromAdmin = false,
}: IProps) => {
  const { user } = useUser();

  const { userRoles } = useConfig();

  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isOnlyPrivateColors, setIsOnlyPrivateColors] = useState<boolean>(false);
  const [isOpenCreateConfirmationModal, setIsOpenCreateConfirmationModal] =
    useState<boolean>(false);
  const [isOpenDeleteConfirmationModal, setIsOpenDeleteConfirmationModal] =
    useState<boolean>(false);
  const [isOpenDeleteForbiddenModal, setIsOpenDeleteForbiddenModal] = useState<[boolean, string]>([
    false,
    '',
  ]);

  const {
    selectedColor,
    isOpenColorSelecting,
    currentTprm,
    setCurrentTprm,
    setSelectedColor,
    toggleIsOpenColorSelecting,
  } = useColorsConfigure();
  const { selectedTab, selectedAdminTab } = useTabs();

  const theTab = useMemo(() => {
    return isFromAdmin ? selectedAdminTab : selectedTab;
  }, [isFromAdmin, selectedAdminTab, selectedTab]);
  const permissions = useGetPermissions(theTab as ModuleNames, isFromAdmin);

  const { onDeleteClick } = useActions({
    selectedTab: theTab,
    palettes,
    handleApplyColors,
    setIsOpenCreateConfirmationModal,
    setIsOpenDeleteConfirmationModal,
  });

  useEffect(() => {
    if (!selectedPaletteId || !palettes || palettes.find((p) => p.id === selectedColor?.id)) return;
    setSelectedColor(palettes.find((p) => p.id === selectedPaletteId) ?? null);
  }, [selectedPaletteId, palettes, selectedColor]);

  const currentColorRanges = useMemo(() => {
    if (!palettes) return [];
    const tprm = currentTprm?.[theTab]?.id;
    if (!tprm) return palettes;
    return palettes.filter((p) =>
      typeof tprm === 'number' ? +p.tprmId === tprm : p.tprmId === tprm,
    );
  }, [palettes, currentTprm, theTab]);

  return (
    <Modal
      open={isOpenColorSelecting[theTab]}
      onClose={() => {
        toggleIsOpenColorSelecting({ module: theTab });
        setCurrentTprm({ module: theTab, tprm: undefined });
      }}
      minWidth="50%"
      disablePortal={disablePortal}
      title={
        <Header
          tprms={tprms}
          isOnlyPrivateColors={isOnlyPrivateColors}
          setIsOnlyPrivateColors={setIsOnlyPrivateColors}
          selectedTab={theTab}
        />
      }
      actions={
        <Buttons
          settingsOnly={settingsOnly}
          selectingOnly={selectingOnly}
          permissions={permissions}
          selectedTab={theTab}
          isAuthor={isAuthor}
          palettes={palettes}
          handleApplyColors={handleApplyColors}
          setIsOpenCreateConfirmationModal={setIsOpenCreateConfirmationModal}
          setIsOpenDeleteConfirmationModal={setIsOpenDeleteConfirmationModal}
        />
      }
    >
      <Table
        colorRanges={currentColorRanges}
        palettesLoaded={palettesLoaded}
        selectedTab={theTab}
        userSub={user?.sub}
        isAdmin={userRoles?.includes('admin') ?? false}
        tprms={tprms}
        setIsOpenDeleteModal={setIsOpenDeleteConfirmationModal}
        setIsOpenDeleteForbiddenModal={setIsOpenDeleteForbiddenModal}
        data-testid="color-table"
        isOnlyPrivateColors={isOnlyPrivateColors}
        setIsAuthor={setIsAuthor}
        permissions={permissions}
        palettes={palettes}
        handleApplyColors={handleApplyColors}
        setIsOpenCreateConfirmationModal={setIsOpenCreateConfirmationModal}
        setIsOpenDeleteConfirmationModal={setIsOpenDeleteConfirmationModal}
        disablePortal={disablePortal}
      />

      <DeleteConfirmationModal
        onDeleteClick={onDeleteClick}
        isOpenDeleteConfirmationModal={isOpenDeleteConfirmationModal}
        setIsOpenDeleteConfirmationModal={setIsOpenDeleteConfirmationModal}
        disablePortal={disablePortal}
      />

      <DeleteRejectionModal
        isOpenDeleteForbiddenModal={isOpenDeleteForbiddenModal}
        onCloseDeleteRejection={() => setIsOpenDeleteForbiddenModal([false, ''])}
        disablePortal={disablePortal}
      />

      <CreateRejectionModal
        isOpenCreateForbiddenModal={isOpenCreateConfirmationModal}
        onCloseCreateRejection={() => setIsOpenCreateConfirmationModal(false)}
        disablePortal={disablePortal}
      />
    </Modal>
  );
};
