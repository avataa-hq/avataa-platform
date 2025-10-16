import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDataflowDiagram, useDebounceValue, useTranslate } from '6_shared';

export const RuleTags = () => {
  const translate = useTranslate();

  const { pipelineTags, setPipelineTags } = useDataflowDiagram();

  const [value, setValue] = useState(pipelineTags);
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounceValue(value, 500);

  useEffect(() => {
    setPipelineTags(debouncedValue);
  }, [debouncedValue]);

  return (
    <Autocomplete
      multiple
      options={pipelineTags}
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField {...params} label={translate('Pipeline tags')} placeholder={translate('Tags')} />
      )}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue.trim());
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          setValue([...value, inputValue]);
          setInputValue('');
        }
      }}
    />
  );
};
