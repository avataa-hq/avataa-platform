import { FormControlLabel, useTheme } from '@mui/material';
import { Ping } from '@uiball/loaders';

import { IosSwitch, useTranslate, ActionTypes } from '6_shared';

interface IProps {
  checked?: boolean;
  setIsLiveUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  isError?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const LiveUpdateToggle = ({
  checked,
  setIsLiveUpdate,
  isLoading,
  isError,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  const { palette } = useTheme();
  return (
    <div style={{ display: 'flex', height: '100px', alignItems: 'center' }}>
      <FormControlLabel
        control={
          <IosSwitch
            sx={{ m: 1 }}
            disabled={!(permissions?.view ?? true)}
            checked={checked}
            onClick={() => setIsLiveUpdate?.(!checked)}
          />
        }
        slotProps={{
          typography: {
            color: isError ? palette.error.main : undefined,
          },
        }}
        label={translate('Live update')}
      />

      {checked && <Ping size={30} color={palette.error.main} />}
    </div>
  );
};
