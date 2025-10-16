import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { useTranslate, useDebounceValue, useDataflowDiagram } from '6_shared';

export const RuleNameInput = () => {
  const translate = useTranslate();

  const { pipelineName, setPipelineName } = useDataflowDiagram();

  const [value, setValue] = useState(pipelineName);
  const debouncedValue = useDebounceValue(value, 500);

  useEffect(() => {
    setPipelineName(debouncedValue ?? null);
  }, [debouncedValue]);

  return (
    <TextField
      label={translate('Rule name')}
      onChange={(event) => setValue(event.target.value)}
      defaultValue={pipelineName}
    />
  );
};
