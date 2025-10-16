import { useState } from 'react';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useTranslate, keycloakRolesApi, useUserManagement } from '6_shared';
import {
  Container,
  InputContainer,
  InputTitle,
  StyledTextField,
  StyledButton,
  StyledIconButton,
  StyledDialog,
  StyledDialogTitle,
} from './Dialog.styled';

const { useCreateRoleMutation } = keycloakRolesApi;

export const DialogRoleAdd: React.FC = () => {
  const translate = useTranslate();

  const { isDialogAddRoleOpen, setIsDialogAddRoleOpen } = useUserManagement();

  const [name, setName] = useState('');
  const [isError, setIsError] = useState(false);

  const [createRoleMutation] = useCreateRoleMutation();

  const handleAddRole = async () => {
    if (name !== '') {
      setIsError(false);

      await createRoleMutation({ name });

      setIsDialogAddRoleOpen(false);
      setIsError(false);
      setName('');
    } else {
      setIsError(true);
    }
  };

  return (
    <StyledDialog
      open={isDialogAddRoleOpen}
      onClose={() => {
        setIsDialogAddRoleOpen(false);
        setIsError(false);
      }}
    >
      <Container>
        <StyledDialogTitle sx={{ mb: '20px' }}>{translate('Add new Role')}</StyledDialogTitle>
        <StyledIconButton
          onClick={() => {
            setIsDialogAddRoleOpen(false);
            setIsError(false);
          }}
        >
          <GridCloseIcon sx={{ width: '18px' }} />
        </StyledIconButton>
      </Container>
      <InputContainer>
        <InputTitle>{translate('Name')}</InputTitle>
        <StyledTextField
          size="small"
          autoFocus
          error={isError}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          helperText={isError ? translate('Incorrect name of role') : ' '}
        />
      </InputContainer>
      <StyledButton variant="outlined" onClick={handleAddRole}>
        {translate('Create')}
      </StyledButton>
    </StyledDialog>
  );
};
