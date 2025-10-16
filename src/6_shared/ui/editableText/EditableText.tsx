import { useEffect, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, SxProps, TextField, Theme, Typography } from '@mui/material';
import { EditableTextContainer } from './EditableText.styled';

interface EditableTextProps {
  onAccept: (value: string) => void;
  initialValue: string | number;
  onEdit?: () => void;
  onCancel?: () => void;
  isActive?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
  uniqueWorkflowsNames?: string[];
}

export const EditableText = ({
  onAccept,
  onEdit,
  onCancel,
  isActive,
  initialValue,
  label,
  sx,
  uniqueWorkflowsNames,
}: EditableTextProps) => {
  const [active, setActive] = useState(!!isActive);
  const [value, setValue] = useState(initialValue.toString());
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cancel = () => {
    if (onCancel) return onCancel();
    return setActive(false);
  };

  const edit = () => {
    if (onEdit) return onEdit();
    return setActive(true);
  };

  useEffect(() => {
    setValue(initialValue.toString());
  }, [initialValue]);

  useEffect(() => {
    if (uniqueWorkflowsNames) {
      const isValueExist = uniqueWorkflowsNames.includes(value.trim());
      setIsError(isValueExist);
    }
  }, [uniqueWorkflowsNames, value]);

  const isFieldActive = isActive !== undefined ? isActive : active;

  return (
    <EditableTextContainer>
      {isFieldActive && (
        <>
          <TextField
            autoFocus
            size="small"
            onChange={(e) => {
              setValue(e.target.value);
              if (isError) {
                setErrorMessage('Workflow name already exists');
              }
            }}
            value={value}
            onClick={(e) => e.stopPropagation()}
            label={label}
            // eslint-disable-next-line no-nested-ternary
            helperText={!value.trim() ? 'The field cannot be empty' : isError ? errorMessage : ''}
            required
            FormHelperTextProps={{ sx: { color: 'red' } }}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onAccept(value);
              cancel();
            }}
            disabled={isError || !value.trim()}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              cancel();
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      )}
      {!isFieldActive && (
        <Typography sx={sx}>
          {initialValue}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              edit();
            }}
          >
            <EditIcon />
          </IconButton>
        </Typography>
      )}
    </EditableTextContainer>
  );
};
