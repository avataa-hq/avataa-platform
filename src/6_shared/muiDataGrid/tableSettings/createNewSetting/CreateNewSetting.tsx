import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Checkbox, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ITableColumnSettingsState } from '6_shared/muiDataGrid/columnSettings';
import { CreateNewSettingStyled } from './CreateNewSetting.styled';

interface IProps {
  settingState: ITableColumnSettingsState;
  setSettingSetting: (setting: ITableColumnSettingsState) => void;
  createMode: boolean;
  isErrorName: boolean;
  setIsErrorName: (isErrorName: boolean) => void;
}
export const CreateNewSetting = ({
  setIsErrorName,
  isErrorName,
  createMode,
  settingState,
  setSettingSetting,
}: IProps) => {
  const { name, isDefault, isPublic } = settingState;
  return (
    <CreateNewSettingStyled>
      <Divider />
      <TextField
        required={createMode}
        fullWidth
        variant="outlined"
        label="New custom preset name"
        placeholder="Enter settings name"
        value={name}
        onChange={(e) => {
          setIsErrorName(false);
          setSettingSetting({ ...settingState, name: e.target.value });
        }}
        error={isErrorName}
        InputProps={{
          placeholder: 'Enter settings name',
          endAdornment: (
            <IconButton onClick={() => setSettingSetting({ ...settingState, name: '' })}>
              <CloseIcon />
            </IconButton>
          ),
        }}
      />
      <Box component="div">
        <FormControlLabel
          control={
            <Checkbox
              checked={isDefault}
              onChange={(e, checked) => setSettingSetting({ ...settingState, isDefault: checked })}
              sx={{
                '& .MuiSvgIcon-root': {
                  color: (theme) => theme.palette.neutralVariant.icon,
                },
                '&.Mui-checked .MuiSvgIcon-root': {
                  color: ({ palette }) => palette.primary.main,
                },
              }}
            />
          }
          label="Is default"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublic}
              onChange={(e, checked) => setSettingSetting({ ...settingState, isPublic: checked })}
              sx={{
                '& .MuiSvgIcon-root': {
                  color: (theme) => theme.palette.neutralVariant.icon,
                },
                '&.Mui-checked .MuiSvgIcon-root': {
                  color: ({ palette }) => palette.primary.main,
                },
              }}
            />
          }
          label="Is public"
        />
      </Box>
    </CreateNewSettingStyled>
  );
};
