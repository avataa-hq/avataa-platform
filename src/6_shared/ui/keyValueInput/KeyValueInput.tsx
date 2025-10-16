import { ReactNode, useRef, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  FormHelperText,
  TextFieldProps,
  BoxProps,
} from '@mui/material';
import { AddRounded, CheckRounded, CloseRounded, DeleteRounded } from '@mui/icons-material';
import { useTranslate } from '6_shared/localization';
import { useSetState } from '6_shared/lib';

interface KeyValueInputProps extends Omit<BoxProps, 'onChange' | 'component'> {
  label?: string;
  initialValue?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
  keyInputProps?: Omit<TextFieldProps, 'inputRef'>;
  valueInputProps?: (
    keyValue?: string,
  ) => Omit<TextFieldProps, 'inputRef'> & { selectOptions?: ReactNode };
}

export const KeyValueInput = ({
  label,
  onChange,
  initialValue = {},
  keyInputProps,
  valueInputProps,
  ...props
}: KeyValueInputProps) => {
  const translate = useTranslate();
  const [values, setValues] = useState<Record<string, string>>(initialValue);
  const [newField, setNewField] = useState<boolean>(false);
  const [newValues, setNewValues] = useSetState<Record<string, string>>({ key: '', value: '' });
  const [error, setError] = useState<string | null>(null);
  const keyInputRef = useRef<HTMLInputElement>();
  const valueInputRef = useRef<HTMLInputElement>();

  const addValue = () => {
    if (!keyInputRef.current || !valueInputRef.current) return;

    const key = keyInputRef.current.value;
    const { value } = valueInputRef.current;

    if (values.hasOwnProperty(key)) {
      setError(translate('The property with this key already exists'));
      return;
    }
    if (key === undefined || value === undefined || key.trim() === '' || value.trim() === '') {
      setError(translate('This field is required'));
      return;
    }

    setError(null);

    setNewField(false);
    setValues((prevState) => {
      const newState = { ...prevState, [key]: value };
      onChange?.(newState);
      return newState;
    });
  };

  const removeValue = (key: string) => {
    setValues((prevState) => {
      const prevStateCopy = { ...prevState };
      delete prevStateCopy[key];
      return prevStateCopy;
    });
  };

  return (
    <Box component="div" {...props}>
      {label && <Typography>{label}</Typography>}
      {Object.entries(values).map(([key, value]) => (
        <Box component="div" key={key} display="flex" alignItems="center">
          <Typography>{key}</Typography>
          <Typography sx={{ flex: 1 }}>: {value}</Typography>
          <IconButton onClick={() => removeValue(key)}>
            <DeleteRounded />
          </IconButton>
        </Box>
      ))}
      {newField ? (
        <FormControl error={!!error} fullWidth>
          <Box component="div" display="flex" alignItems="flex-end" gap="5px">
            <TextField
              label="Key"
              inputRef={keyInputRef}
              error={!!error}
              value={newValues.key}
              onChange={(event) => setNewValues({ key: event.target.value })}
              {...keyInputProps}
            >
              {keyInputProps?.children}
            </TextField>
            <TextField
              label="Value"
              inputRef={valueInputRef}
              error={!!error}
              value={newValues.value}
              onChange={(event) => setNewValues({ value: event.target.value })}
              {...valueInputProps?.(newValues.key)}
            >
              {valueInputProps?.(newValues.key)?.children}
            </TextField>
            <Button
              variant="outlined.icon"
              onClick={() => {
                setNewField(false);
                setError(null);
              }}
            >
              <CloseRounded />
            </Button>
            <Button
              variant="outlined.icon"
              onClick={() => {
                addValue();
              }}
            >
              <CheckRounded />
            </Button>
          </Box>
          <FormHelperText>{error}</FormHelperText>
        </FormControl>
      ) : (
        <Button variant="contained" onClick={() => setNewField(true)}>
          <AddRounded />
          {translate('Add')}
        </Button>
      )}
    </Box>
  );
};
