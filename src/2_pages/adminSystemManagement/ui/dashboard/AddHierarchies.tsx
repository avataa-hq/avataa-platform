import { useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

import { Modal, useTranslate } from '6_shared';

interface IProps {
  isAddHierarchies: boolean;
  setIsAddHierarchies: (v: boolean) => void;
  listElements?: { id: string; name: string }[];
  handleInputChange: (type: string, id: string[]) => void;
}

export const AddHierarchies = ({
  isAddHierarchies,
  setIsAddHierarchies,
  listElements,
  handleInputChange,
}: IProps) => {
  const translate = useTranslate();

  const [hierarchiesToAdd, setHierarchiesToAdd] = useState<{ id: string; name: string }[]>([]);
  const dialogText = `${translate('Select')} ${translate('hierarchies')} ${translate('to add')}`;

  const onAssignApply = () => {
    const ids = hierarchiesToAdd.map((el) => el.id);
    handleInputChange('Add', ids);
    setIsAddHierarchies(false);
  };

  const onAssignCancel = () => {
    setIsAddHierarchies(false);
  };

  return (
    <Modal
      open={isAddHierarchies}
      onClose={onAssignCancel}
      title={dialogText}
      minWidth="30%"
      actions={
        <Button
          variant="outlined"
          className="create-btn"
          sx={{ mt: '10px' }}
          onClick={onAssignApply}
        >
          {translate('Add')}
        </Button>
      }
      ModalContentSx={{ overflow: 'visible' }}
    >
      <Autocomplete
        multiple
        id="tags-outlined"
        disableCloseOnSelect
        options={listElements ?? []}
        getOptionLabel={(option) => option.name}
        onChange={(_, newValue) => setHierarchiesToAdd(newValue)}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} />}
      />
    </Modal>
  );
};
