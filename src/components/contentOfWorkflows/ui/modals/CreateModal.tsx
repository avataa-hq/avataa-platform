import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Modal, useTranslate, useWorkflows } from '6_shared';

export const CreateModal = () => {
  const translate = useTranslate();

  const {
    isCreateModalActive,
    setActiveItem,
    setIsCreateModalActive,
    setIsDiagramChanged,
    setNewItem,
  } = useWorkflows();

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dispatchNewItem = (name: string) => {
    const newItem = {
      name,
      key: 0,
      version: 0,
      bpmnProcessId: '1',
      timestamp: new Date().toISOString(),
    };

    setNewItem({
      isCollapsed: false,
      item: newItem,
    });

    setActiveItem({
      isCollapsed: false,
      item: newItem,
    });
    setIsDiagramChanged(true);
  };

  return (
    <Modal
      title={translate('Create new diagram')}
      width="320px"
      open={isCreateModalActive}
      onClose={() => {
        setErrorMessage('');
        setIsError(false);
        setIsCreateModalActive(false);
      }}
      actions={
        <Button form="new-diagram-form" type="submit" variant="contained">
          {translate('Create')}
        </Button>
      }
    >
      <form
        id="new-diagram-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const name = (new FormData(form).get('name') as string).trim();

          if (!form.checkValidity() || !name) {
            setIsError(true);
            setErrorMessage(translate('The field cannot be empty'));
          } else {
            setIsError(false);
            setErrorMessage('');
          }

          if (name) {
            dispatchNewItem(name as string);
            setIsCreateModalActive(false);
          }
        }}
      >
        <TextField
          name="name"
          label={translate('Name')}
          error={isError}
          helperText={isError ? errorMessage : ''}
          fullWidth
          required
        />
      </form>
    </Modal>
  );
};
