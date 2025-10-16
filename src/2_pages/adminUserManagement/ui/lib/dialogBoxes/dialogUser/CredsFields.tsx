import { useTranslate } from '6_shared';
import { UserCredsKeys, UserCredsType } from './lib';
import { DialogField } from './DialogField';

interface IProps {
  userDialogType: string;
  userCreds: UserCredsType;
  updateUserCreds: (key: UserCredsKeys, value: string | boolean) => void;
}

const CredsFields = ({ userDialogType, userCreds, updateUserCreds }: IProps) => {
  const translate = useTranslate();
  return (
    <>
      <DialogField
        title={translate('Username')}
        error={userCreds.isErrorUsername}
        value={userCreds.username}
        dataTestid="dialog-field__username"
        disabled={userDialogType !== 'add'}
        onChange={(e) => userDialogType === 'add' && updateUserCreds('username', e.target.value)}
        helperText={userCreds.isErrorUsername ? translate('Incorrect username') : ''}
      />
      <DialogField
        title={translate('First name')}
        error={userCreds.isErrorFirstName}
        value={userCreds.firstName}
        dataTestid="dialog-field__firstName"
        disabled={userDialogType === 'info'}
        onChange={(e) => userDialogType !== 'info' && updateUserCreds('firstName', e.target.value)}
        helperText={userCreds.isErrorFirstName ? translate('Incorrect first name') : ''}
      />

      <DialogField
        title={translate('Last name')}
        error={userCreds.isErrorLastName}
        value={userCreds.lastName}
        dataTestid="dialog-field__lastName"
        disabled={userDialogType === 'info'}
        onChange={(e) => userDialogType !== 'info' && updateUserCreds('lastName', e.target.value)}
        helperText={userCreds.isErrorLastName ? translate('Incorrect last name') : ''}
      />

      <DialogField
        title={translate('Email address')}
        error={userCreds.isErrorEmail}
        value={userCreds.email}
        dataTestid="dialog-field__email"
        disabled={userDialogType === 'info'}
        onChange={(e) => userDialogType !== 'info' && updateUserCreds('email', e.target.value)}
        helperText={userCreds.isErrorEmail ? translate('Incorrect email address') : ''}
      />
    </>
  );
};

export default CredsFields;
