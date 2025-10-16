import { useState } from 'react';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useTranslate, keycloakGroupsApi, useUserManagement } from '6_shared';
import {
  StyledDialog,
  Container,
  InputContainer,
  InputTitle,
  StyledTextField,
  StyledButton,
  StyledDialogTitle,
  StyledIconButton,
} from './Dialog.styled';

const { useAddGroupMutation, useAddGroupChildrenMutation } = keycloakGroupsApi;

export const DialogGroupAdd: React.FC = () => {
  const translate = useTranslate();

  const { isDialogAddGroupOpen, parentGroup, setIsDialogAddGroupOpen } = useUserManagement();

  const [name, setName] = useState('');
  const [isError, setIsError] = useState(false);

  const [addGroupMutation] = useAddGroupMutation();
  const [addSubgroupMutation] = useAddGroupChildrenMutation();

  const handleAddGroup = async () => {
    if (name === '') {
      setIsError(true);
      return;
    }

    setIsError(false);
    if (parentGroup) {
      addSubgroupMutation([
        parentGroup.id!,
        {
          name,
        },
      ]);
    } else {
      addGroupMutation({
        name,
        path: `/${name}`,
        subGroups: [],
      });
    }
    setIsDialogAddGroupOpen(false);
    setIsError(false);
    setName('');
  };

  return (
    <StyledDialog
      open={isDialogAddGroupOpen}
      onClose={() => {
        setIsDialogAddGroupOpen(false);
        setIsError(false);
      }}
    >
      <Container>
        <StyledDialogTitle sx={{ mb: '20px' }}>{translate('Add new Group')}</StyledDialogTitle>
        <StyledIconButton
          onClick={() => {
            setIsDialogAddGroupOpen(false);
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
          helperText={isError ? 'Incorrect name of group' : ' '}
        />
      </InputContainer>
      <StyledButton onClick={handleAddGroup}>{translate('Create')}</StyledButton>
    </StyledDialog>
  );
};
