import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import {
  Modal,
  useTranslate,
  ActionTypes,
  useTabs,
  useColorsConfigure,
  PaletteSettings,
  useUser,
  useConfig,
} from '6_shared';

import SettingsSlider from './ui/slider/SettingsSlider';
import SettingsTable from './ui/table/SettingsTable';
import { UpdateConfirmationModal, UpdateRejectionModal, CreateConfirmationModal } from '../modals';
import { usePaletteActions } from './lib/usePaletteActions';
import { Header } from './ui/header/Header';

interface IProps {
  isParamType?: boolean;
  isSeverity?: boolean;
  isLineWithWidth?: boolean;
  permissions?: Record<ActionTypes, boolean>;
  disablePortal?: boolean;
  isFromAdmin?: boolean;

  refetchAnother?: () => void;
}

export type PaletteData = {
  palette: PaletteSettings;
  isError: Partial<Record<keyof PaletteSettings, boolean>>;
  helperText: Partial<Record<keyof PaletteSettings, string>>;
};

export const ColorSettings = ({
  refetchAnother,
  isParamType = false,
  isSeverity = false,
  isLineWithWidth = false,
  permissions,
  disablePortal = false,
  isFromAdmin = false,
}: IProps) => {
  const translate = useTranslate();

  const {
    isOpenColorSettings,
    selectedPalette,
    currentTprm,
    isEditPalette,
    toggleIsOpenColorSettings,
  } = useColorsConfigure();
  const { selectedTab, selectedAdminTab } = useTabs();

  const theTab = useMemo(() => {
    return isFromAdmin ? selectedAdminTab : selectedTab;
  }, [isFromAdmin, selectedAdminTab, selectedTab]);

  const [paletteData, setPaletteData] = useState<PaletteData>({
    palette: {},
    isError: {},
    helperText: {},
  });

  const { user } = useUser();

  const { userRoles } = useConfig();

  const isAdmin = userRoles?.includes('admin') ?? false;

  const { onCreatePalette, onEditPalette } = usePaletteActions(paletteData?.palette, theTab);

  useEffect(() => {
    if (!selectedPalette?.[theTab]) return;
    setPaletteData((prev) => ({
      ...prev,
      palette: selectedPalette[theTab],
    }));
  }, [selectedPalette, theTab]);

  useEffect(() => {
    if (!isEditPalette[theTab]) return;
    setPaletteData((prev) => ({
      ...prev,
      palette: { ...prev.palette, tprmId: currentTprm?.[theTab]?.id?.toString() },
    }));
  }, [currentTprm, isEditPalette, theTab]);

  const valType = useMemo(() => {
    return isEditPalette?.[theTab]
      ? paletteData?.palette?.valType
      : currentTprm?.[theTab]?.val_type;
  }, [isEditPalette, theTab, paletteData, currentTprm]);

  const [isPopupCreateConfirmation, setIsPopupCreateConfirmation] = useState<boolean>(false);
  const [isPopupUpdateConfirmation, setIsPopupUpdateConfirmation] = useState<boolean>(false);
  const [isPopupUpdateRejection, setIsPopupUpdateRejection] = useState<boolean>(false);

  // Start :: Handling permission to mutate the palette
  const [isAuthor, setIsAuthor] = useState<boolean>(false);

  useEffect(() => {
    if (user?.sub === selectedPalette?.[theTab]?.created_by_sub || isAdmin) {
      setIsAuthor(true);
    }
  }, [user, selectedPalette, theTab, isAdmin]);
  // End :: Handling permission to mutate the palette

  const colorSetCreation = () => {
    const { name, default: isDefault } = paletteData?.palette ?? {};

    if (!name?.trim()) {
      setPaletteData((prev) => ({
        ...prev,
        isError: { name: true },
        helperText: { name: translate('Incorrect name') },
      }));
    } else if (isDefault) {
      setIsPopupCreateConfirmation(true);
    } else {
      onCreatePalette?.();
    }

    refetchAnother?.();
  };

  const colorSetUpdating = () => {
    const isNameValid = paletteData?.palette?.name?.trim()?.length ?? -1 > 0;

    if (!isNameValid) {
      setPaletteData((prev) => ({
        ...prev,
        isError: { name: true },
        helperText: { name: translate('Incorrect name') },
      }));
      return;
    }

    if (!isAuthor) {
      setIsPopupUpdateRejection(true);
      return;
    }

    const isDefault = selectedPalette?.[theTab]?.default;
    const isPublic = selectedPalette?.[theTab]?.public;

    if (isDefault && isPublic) {
      if (!paletteData?.palette?.default || !paletteData?.palette?.public) {
        setIsPopupUpdateRejection(true);
      } else {
        onEditPalette?.();
      }
    } else if (
      selectedPalette?.[theTab]?.default === isDefault &&
      selectedPalette?.[theTab]?.public === isPublic
    ) {
      onEditPalette?.();
    } else {
      setIsPopupUpdateConfirmation(true);
    }

    refetchAnother?.();
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    setPaletteData((prev) => ({
      ...prev,
      palette: { ...prev.palette, name: newValue },
      isError: { name: false },
      helperText: { name: ' ' },
    }));
  };

  const updatePalette = (updateFn: (prev: PaletteSettings) => PaletteSettings) => {
    setPaletteData((prev) => ({
      ...prev,
      palette: updateFn(prev.palette),
    }));
  };

  const areValuesValid = () => {
    const arr = paletteData?.palette?.ranges?.values;
    if (!arr) return true;
    for (let i = 0; i < arr.length - 1; i++) {
      if (Number(arr[i]) >= Number(arr[i + 1])) {
        return false;
      }
    }
    return true;
  };

  return (
    <Modal
      open={isOpenColorSettings[theTab] ?? false}
      onClose={() => toggleIsOpenColorSettings({ module: theTab })}
      minWidth="50%"
      disablePortal={disablePortal}
      title={
        <Header
          paletteData={paletteData}
          handleChangeName={handleChangeName}
          updatePalette={updatePalette}
          valType={valType}
          isSeverity={isSeverity}
          isParamType={isParamType}
          isLineWithWidth={isLineWithWidth}
        />
      }
      actions={
        <Button
          onClick={isEditPalette[theTab] ? colorSetUpdating : colorSetCreation}
          disabled={!(permissions?.view ?? true) || !areValuesValid()}
          variant="contained"
          size="large"
        >
          {translate('Apply')}
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {(valType === 'number' || valType === 'int' || valType === 'float') && (
          <SettingsSlider
            colors={paletteData?.palette?.ranges?.colors}
            values={paletteData?.palette?.ranges?.values}
            comparisonZeroPoint={paletteData?.palette?.ranges?.comparisonZeroPoint}
            updatePalette={updatePalette}
          />
        )}
        {valType !== 'Hex' && (
          <SettingsTable
            valType={valType}
            palette={paletteData?.palette}
            updatePalette={updatePalette}
          />
        )}

        <CreateConfirmationModal
          isPrivateColor={paletteData?.palette?.public ?? false}
          tprmName={currentTprm?.[theTab]?.name}
          labels={{}}
          onCreateColorSet={onCreatePalette}
          isOpen={isPopupCreateConfirmation}
          setIsOpen={setIsPopupCreateConfirmation}
          disablePortal={disablePortal}
        />

        <UpdateConfirmationModal
          isPrivateColor={paletteData?.palette?.public}
          isDefaultColor={paletteData?.palette?.default}
          wasPublicColor={selectedPalette?.[theTab]?.public}
          wasDefaultColor={selectedPalette?.[theTab]?.default}
          tprmName={currentTprm?.[theTab]?.name}
          labels={{}}
          onUpdateColorSet={onEditPalette}
          isOpen={isPopupUpdateConfirmation}
          setIsOpen={setIsPopupUpdateConfirmation}
          disablePortal={disablePortal}
        />

        <UpdateRejectionModal
          isOpenUpdateRejectionModal={isPopupUpdateRejection}
          onCloseUpdateRejection={() => setIsPopupUpdateRejection(false)}
          disablePortal={disablePortal}
        />
      </div>
    </Modal>
  );
};
