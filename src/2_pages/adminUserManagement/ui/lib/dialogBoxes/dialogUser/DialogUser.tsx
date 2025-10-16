import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import {
  useTranslate,
  keycloakUsersApi,
  getErrorMessage,
  Modal,
  useUserManagement,
  IUser,
} from '6_shared';
import {
  defaultPasswordData,
  defaultUserCreds,
  UserCredsType,
  PasswordDataType,
  isValidEmail,
  isValidPassword,
  UserCredsKeys,
  PasswordDataKeys,
} from './lib';
import CredsFields from './CredsFields';
import PasswordFields from './PasswordFields';

const { useAddUserMutation, useCreatePasswordMutation, useEditUserMutation } = keycloakUsersApi;

export const DialogUser = () => {
  const translate = useTranslate();

  const [addUserMutation] = useAddUserMutation();
  const [editUserMutation] = useEditUserMutation();
  const [createUserPassword, { error, isSuccess }] = useCreatePasswordMutation();

  const {
    isDialogUserOpen,
    users,
    selectedUser,
    userDialogType,
    setIsDialogUserOpen,
    setUserDialogType,
  } = useUserManagement();

  const [userCreds, setUserCreds] = useState<UserCredsType>(defaultUserCreds);
  const [passwordData, setPasswordData] = useState<PasswordDataType>(defaultPasswordData);

  const [lastCreatedUser, setLastCreatedUser] = useState<IUser | null>(null);
  const [isUserAdded, setIsUserAdded] = useState(false);

  useEffect(() => {
    if (userDialogType === 'add') {
      setUserCreds(defaultUserCreds);
    } else if (selectedUser) {
      setUserCreds((prev) => ({
        ...prev,
        email: selectedUser.email ?? '',
        username: selectedUser.username ?? '',
        firstName: selectedUser.firstName ?? '',
        lastName: selectedUser.lastName ?? '',
      }));
    }
  }, [userDialogType, selectedUser, isDialogUserOpen]);

  useEffect(() => {
    if (isUserAdded && lastCreatedUser) {
      const newUser = users?.find((user: IUser) => user.username === lastCreatedUser.username);

      if (newUser) {
        createUserPassword([
          newUser.id as string,
          {
            type: 'password',
            value: passwordData.password,
            temporary: false,
          },
        ]);

        setIsUserAdded(false);
        setLastCreatedUser(null);
      }
    }
  }, [users, isUserAdded, createUserPassword, lastCreatedUser, passwordData]);

  useEffect(() => {
    if (error) enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
    if (isSuccess) {
      enqueueSnackbar({ variant: 'success', message: translate('Success') });
      setUserCreds(defaultUserCreds);
      setPasswordData(defaultPasswordData);
    }
  }, [error, isSuccess, translate]);

  const resetStates = () => {
    setUserCreds(defaultUserCreds);
    setPasswordData(defaultPasswordData);
    setIsDialogUserOpen(false);
    setUserDialogType('');
  };

  const updateUserCreds = (key: UserCredsKeys, value: string | boolean) => {
    setUserCreds((prevCreds) => ({
      ...prevCreds,
      [key]: value,
    }));
  };

  const updatePasswordData = (key: PasswordDataKeys, value: string | boolean) => {
    setPasswordData((prevPwData) => ({
      ...prevPwData,
      [key]: value,
    }));
  };

  const isCredsDataValid = () => {
    return userCreds.username !== '' && userCreds.firstName !== '' && userCreds.lastName !== '';
  };

  const isPasswordDataValid = () => {
    return (
      isValidEmail(userCreds.email) &&
      isValidPassword(passwordData.password) &&
      passwordData.password === passwordData.confirmPassword
    );
  };

  const handleAddUser = async () => {
    if (isCredsDataValid() && isPasswordDataValid()) {
      const { username, email, firstName, lastName } = userCreds;

      await addUserMutation({
        createdTimestamp: Date.now(),
        username,
        enabled: true,
        emailVerified: true,
        firstName,
        lastName,
        email,
        disableableCredentialTypes: [],
        requiredActions: [],
        notBefore: 0,
        access: {
          manageGroupMembership: true,
          view: true,
          mapRoles: true,
          impersonate: true,
          manage: true,
        },
      });

      setLastCreatedUser({ username, email, firstName, lastName });
      setIsUserAdded(true);

      resetStates();
    }

    setUserCreds({
      ...userCreds,
      isErrorUsername: userCreds.username === '',
      isErrorFirstName: userCreds.firstName === '',
      isErrorLastName: userCreds.lastName === '',
      isErrorEmail: !isValidEmail(userCreds.email),
    });
    setPasswordData({
      ...passwordData,
      isErrorPassword: !isValidPassword(passwordData.password),
      isErrorConfirmPassword: passwordData.password !== passwordData.confirmPassword,
    });
  };

  const handleEditUser = async () => {
    if (isCredsDataValid() && selectedUser?.id) {
      const { username, email, firstName, lastName } = userCreds;
      await editUserMutation([
        selectedUser.id,
        {
          username,
          emailVerified: true,
          firstName,
          lastName,
          email,
        },
      ]);
      setIsDialogUserOpen(false);
      resetStates();
    }
    setUserCreds({
      ...userCreds,
      isErrorUsername: userCreds.username === '',
      isErrorFirstName: userCreds.firstName === '',
      isErrorLastName: userCreds.lastName === '',
      isErrorEmail: !isValidEmail(userCreds.email),
    });
  };

  const handleResetPassword = async () => {
    if (isPasswordDataValid())
      await createUserPassword([
        selectedUser.id as string,
        {
          type: 'password',
          value: passwordData.password,
          temporary: false,
        },
      ])
        .then(() => {
          enqueueSnackbar({ variant: 'success', message: translate('Success') });
          resetStates();
        })
        .catch((err) => {
          enqueueSnackbar({ variant: 'error', message: getErrorMessage(err) });
          resetStates();
        });
  };

  const getDialogTitle = () => {
    if (userDialogType === 'add') return translate('Add new User');
    if (userDialogType === 'password')
      return `${translate('Reset Credentials')} ${translate('for')} ${selectedUser.username ?? ''}`;
    if (userDialogType === 'edit')
      return `${translate('Edit user')} ${selectedUser.username ?? ''}`;
    return `${translate('User')} ${selectedUser.username ?? ''} ${translate('details')}`;
  };

  const getActionButton = () => {
    if (userDialogType === 'add') {
      return (
        <Button variant="outlined" className="create-btn" onClick={handleAddUser}>
          {translate('Create')}
        </Button>
      );
    }
    if (userDialogType === 'password') {
      return (
        <Button variant="outlined" className="create-btn" onClick={handleResetPassword}>
          {translate('Update')}
        </Button>
      );
    }
    if (userDialogType === 'edit') {
      return (
        <Button variant="outlined" className="create-btn" onClick={handleEditUser}>
          {translate('Edit')}
        </Button>
      );
    }
    return (
      <Button variant="outlined" className="create-btn" onClick={() => resetStates()}>
        {translate('Close')}
      </Button>
    );
  };

  return (
    <Modal
      open={isDialogUserOpen}
      onClose={resetStates}
      minWidth="25rem"
      title={getDialogTitle()}
      actions={getActionButton()}
    >
      <>
        {userDialogType !== 'password' && (
          <CredsFields
            userDialogType={userDialogType}
            userCreds={userCreds}
            updateUserCreds={updateUserCreds}
          />
        )}
        {(userDialogType === 'add' || userDialogType === 'password') && (
          <PasswordFields passwordData={passwordData} updatePasswordData={updatePasswordData} />
        )}
      </>
    </Modal>
  );
};
