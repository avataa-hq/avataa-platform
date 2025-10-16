import { Dispatch } from 'react';
import { Button } from '@mui/material';

import { ActionTypes, IColorRangeModel, useTranslate } from '6_shared';
import { useActions } from '../../lib/useActions';

interface IProps {
  settingsOnly?: boolean;
  selectingOnly?: boolean;
  isAuthor?: boolean;
  selectedTab: string;
  palettes?: IColorRangeModel[];
  permissions?: Record<ActionTypes, boolean>;

  handleApplyColors?: ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => void;
  setIsOpenCreateConfirmationModal?: Dispatch<React.SetStateAction<boolean>>;
  setIsOpenDeleteConfirmationModal?: Dispatch<React.SetStateAction<boolean>>;
}

export const Buttons = ({
  settingsOnly,
  selectingOnly,
  isAuthor,
  selectedTab,
  palettes,
  permissions,
  handleApplyColors,
  setIsOpenCreateConfirmationModal,
  setIsOpenDeleteConfirmationModal,
}: IProps) => {
  const translate = useTranslate();

  const { onApplyClick, onCreateClick, onEditClick, onDefaultClick } = useActions({
    palettes,
    selectedTab,
    handleApplyColors,
    setIsOpenCreateConfirmationModal,
    setIsOpenDeleteConfirmationModal,
  });

  const ButtonConfigurations: {
    label: 'Apply' | 'Edit' | 'Create New' | 'Select Default';
    onClick: (e: any) => void;
    disabled: boolean;
    isVisible: boolean;
  }[] = [
    {
      label: 'Apply',
      onClick: onApplyClick,
      disabled: !permissions?.view,
      isVisible: !settingsOnly,
    },
    {
      label: 'Edit',
      onClick: onEditClick,
      disabled: !isAuthor || !(permissions?.view ?? true),
      isVisible: !selectingOnly,
    },
    {
      label: 'Create New',
      onClick: onCreateClick,
      disabled: !permissions?.view,
      isVisible: !selectingOnly,
    },
    {
      label: 'Select Default',
      onClick: onDefaultClick,
      disabled: !permissions?.view,
      isVisible: !settingsOnly,
    },
  ];
  return (
    <>
      {ButtonConfigurations.map(
        ({ label, onClick, disabled, isVisible }) =>
          isVisible && (
            <Button
              key={label}
              onClick={onClick}
              variant="contained"
              size="large"
              disabled={disabled}
            >
              {translate(label)}
            </Button>
          ),
      )}
    </>
  );
};
