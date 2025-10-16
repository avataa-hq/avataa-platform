import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export type UserCredsType = {
  username: string;
  isErrorUsername: boolean;
  firstName: string;
  isErrorFirstName: boolean;
  lastName: string;
  isErrorLastName: boolean;
  email: string;
  isErrorEmail: boolean;
};

export type PasswordDataType = {
  password: string;
  isErrorPassword: boolean;
  showPassword: boolean;
  confirmPassword: string;
  isErrorConfirmPassword: boolean;
  showConfirmPassword: boolean;
};

export type UserCredsKeys = keyof UserCredsType;
export type PasswordDataKeys = keyof PasswordDataType;

export const defaultUserCreds = {
  username: '',
  isErrorUsername: false,
  firstName: '',
  isErrorFirstName: false,
  lastName: '',
  isErrorLastName: false,
  email: '',
  isErrorEmail: false,
};

export const defaultPasswordData = {
  password: '',
  isErrorPassword: false,
  showPassword: false,
  confirmPassword: '',
  isErrorConfirmPassword: false,
  showConfirmPassword: false,
};

export const getTooltipTitle = (translate: any) => (
  <Box component="div" className="password__helper">
    <Typography color="inherit">{translate('Valid password')}:</Typography>
    <em>- {translate('has length of at least 8 characters')}</em>
    <br />
    <em>- {translate('contains at least one lowercase letter')}</em>
    <br />
    <em>- {translate('contains at least one capital letter')}</em>
    <br />
    <em>- {translate('contains at least one number')}</em>
    <br />
  </Box>
);

export const isValidEmail = (emailAdresse: string) => {
  const re: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailAdresse).toLowerCase());
};

export const isValidPassword = (pass: string) => {
  const re: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[a-zA-Z0-9]{8,}$/;

  return re.test(String(pass));
};
