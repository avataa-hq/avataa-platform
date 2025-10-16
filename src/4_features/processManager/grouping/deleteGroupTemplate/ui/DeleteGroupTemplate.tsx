import { groupApi } from '6_shared';
import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, Button, CircularProgress, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Body, DeleteGroupTemplateStyled, Footer, Header } from './DeleteGroupTemplate.styled';
import { useDeleteGroupTemplate } from '../api/useDeleteGroupTemplate';

const { useGetAllGroupTemplatesQuery } = groupApi;

interface IListItem {
  id: number;
  label: string;
}

interface IProps {
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
}

export const DeleteGroupTemplate = ({ isOpen, setIsOpen }: IProps) => {
  const [selectedTemplates, setSelectedTemplates] = useState<IListItem[]>([]);
  const [templatesFieldErrorMessage, setTemplatesFieldErrorMessage] = useState<string | null>('');

  const { data: allTemplates } = useGetAllGroupTemplatesQuery({});
  const { isLoadingDeleteGroupTemplate, deleteGroupTemplate } = useDeleteGroupTemplate({
    setIsOpenDialog: setIsOpen,
  });

  const templatesOptions = useMemo<IListItem[]>(() => {
    return allTemplates?.map(({ id, name }) => ({ id, label: name })) ?? [];
  }, [allTemplates]);

  useEffect(() => {
    if (templatesFieldErrorMessage !== null && selectedTemplates.length > 0) {
      setTemplatesFieldErrorMessage(null);
    }
  }, [selectedTemplates.length, templatesFieldErrorMessage]);

  const clearStates = () => {
    setSelectedTemplates([]);
    setTemplatesFieldErrorMessage(null);
  };

  const onSave = async () => {
    if (selectedTemplates.length === 0) {
      setTemplatesFieldErrorMessage('Field cannot be empty');
      return;
    }
    await deleteGroupTemplate(selectedTemplates.map((t) => t.id));
  };
  const onCancel = () => {
    setIsOpen?.(false);
    clearStates();
  };

  return (
    <DeleteGroupTemplateStyled>
      <Header>
        <Typography variant="h1">Deleting group templates</Typography>
      </Header>
      <Body>
        <Typography color={templatesFieldErrorMessage ? 'error' : 'inherit'} sx={{ opacity: 0.8 }}>
          {templatesFieldErrorMessage || 'Select templates to be deleted:'}
        </Typography>
        <Autocomplete
          sx={{ width: 400 }}
          multiple
          options={templatesOptions}
          value={selectedTemplates}
          onChange={(_, value) => setSelectedTemplates(value)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Body>
      <Footer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          {isLoadingDeleteGroupTemplate ? <CircularProgress size={23} /> : 'Save'}
        </Button>
      </Footer>
    </DeleteGroupTemplateStyled>
  );
};
