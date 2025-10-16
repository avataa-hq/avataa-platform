import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { Info, Visibility, VisibilityOff } from '@mui/icons-material';
import { Theme } from '@emotion/react';

import { useTranslate } from '6_shared';

import { getTooltipTitle, PasswordDataKeys, PasswordDataType } from './lib';
import { InputContainer, InputTitle } from '../baseStyles';

interface IProps {
  passwordData: PasswordDataType;
  updatePasswordData: (key: PasswordDataKeys, value: string | boolean) => void;
}

const PasswordFields = ({ passwordData, updatePasswordData }: IProps) => {
  const translate = useTranslate();
  return (
    <>
      <InputContainer>
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'end',
            gap: '10px',
          }}
        >
          <InputTitle>{translate('Password')}</InputTitle>
          <Tooltip title={getTooltipTitle(translate)} placement="right">
            <Info
              sx={(theme: Theme) => ({
                cursor: 'pointer',
                color: theme.palette.neutralVariant.icon,
              })}
              className="password__icon"
              fontSize="small"
            />
          </Tooltip>
        </Box>
        <Tooltip title={getTooltipTitle(translate)} placement="right">
          <TextField
            sx={{ position: 'realative' }}
            fullWidth
            type={passwordData.showPassword ? 'text' : 'password'}
            error={passwordData.isErrorPassword}
            value={passwordData.password}
            onChange={(e) => updatePasswordData('password', e.target.value)}
            data-testid="dialog-field__password"
            required
            helperText={passwordData.isErrorPassword ? translate('Incorrect password') : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end" sx={{ position: 'absolute', right: '8px' }}>
                  <IconButton
                    tabIndex={-1}
                    onClick={() => updatePasswordData('showPassword', !passwordData.showPassword)}
                    edge="start"
                  >
                    {passwordData.showPassword ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>
      </InputContainer>
      <InputContainer>
        <InputTitle>{translate('Confirm password')}</InputTitle>
        <TextField
          sx={{ position: 'realative' }}
          fullWidth
          type={passwordData.showConfirmPassword ? 'text' : 'password'}
          error={passwordData.isErrorConfirmPassword}
          value={passwordData.confirmPassword}
          onChange={(e) => updatePasswordData('confirmPassword', e.target.value)}
          data-testid="dialog-field__confirmPassword"
          required
          helperText={
            passwordData.isErrorConfirmPassword ? translate("Password doesn't match") : ''
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="end" sx={{ position: 'absolute', right: '8px' }}>
                <IconButton
                  tabIndex={-1}
                  onClick={() =>
                    updatePasswordData('showConfirmPassword', !passwordData.showConfirmPassword)
                  }
                  edge="start"
                >
                  {passwordData.showConfirmPassword ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </InputContainer>
    </>
  );
};

export default PasswordFields;
