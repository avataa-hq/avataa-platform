import { FormControlLabel, FormGroup, Switch } from '@mui/material';

interface IThemeSwitcherProps {
  isSwitchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;
}

export const ThemeSwitcher = ({ isSwitchChecked, onSwitchChange }: IThemeSwitcherProps) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch checked={isSwitchChecked} onChange={(_, checked) => onSwitchChange?.(checked)} />
        }
        label="Change theme"
      />
    </FormGroup>
  );
};
