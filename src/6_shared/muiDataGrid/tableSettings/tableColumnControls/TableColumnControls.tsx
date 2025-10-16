import { Button } from '@mui/material';
import { ActionTypes } from '6_shared/lib';
import { useTranslate } from '6_shared';
import { SettingsControl } from '../TableSettings.styled';

interface IProps {
  onUpdate: () => void;
  onSave: () => void;
  onSelectDefault: () => void;
  isCreateMode: boolean;
  updateMode: boolean;
  onCansel: () => void;
  onCreate: () => void;
  permissions?: Record<ActionTypes, boolean>;
  isUpdateDisabled?: boolean;
}
export const TableColumnControls = ({
  onUpdate,
  onSave,
  onSelectDefault,
  isCreateMode,
  updateMode,
  onCansel,
  onCreate,
  permissions,
  isUpdateDisabled,
}: IProps) => {
  const translate = useTranslate();

  if (isCreateMode || updateMode)
    return (
      <SettingsControl>
        <Button variant="contained" onClick={onSave}>
          {translate('Save')}
        </Button>
        <Button variant="contained" onClick={onCansel}>
          {translate('Cancel')}
        </Button>
      </SettingsControl>
    );

  return (
    <SettingsControl>
      <Button
        variant="contained"
        onClick={onUpdate}
        disabled={!(permissions?.view ?? true) || isUpdateDisabled}
      >
        {translate('Update')}
      </Button>
      <Button variant="contained" onClick={onCreate} disabled={!(permissions?.view ?? true)}>
        {translate('Create')}
      </Button>
      <Button variant="contained" onClick={onSelectDefault} disabled={!(permissions?.view ?? true)}>
        {translate('Set as default')}
      </Button>
    </SettingsControl>
  );
};
