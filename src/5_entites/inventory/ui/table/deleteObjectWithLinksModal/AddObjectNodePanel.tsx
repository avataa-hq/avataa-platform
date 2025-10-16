import { AutocompleteValue, Box, Button, useDeleteObjectWithLinks } from '6_shared';
import { useCallback, useEffect, useState } from 'react';
import { SelectObjectAutocompleteWithDynamicOptions } from './SelectObjectAutocompleteWithDynamicOptions';

interface IProps {
  tmoId: number;
  onObjectAdd: () => void;
}

export const AddObjectNodePanel = ({ tmoId, onObjectAdd }: IProps) => {
  const [object, setObject] = useState<AutocompleteValue>({ id: null, label: '' });

  const { setAddedObjectId } = useDeleteObjectWithLinks();

  useEffect(() => {
    if (object.id) {
      setAddedObjectId(object.id);
    }
  }, [object]);

  const onClick = useCallback(() => {
    if (object.id) {
      onObjectAdd();
    }
  }, [object, onObjectAdd]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
      <SelectObjectAutocompleteWithDynamicOptions
        tmoId={tmoId}
        value={object}
        setValue={setObject}
      />
      <Button sx={{ width: '50px', height: '35px' }} onClick={onClick}>
        Add
      </Button>
    </Box>
  );
};
