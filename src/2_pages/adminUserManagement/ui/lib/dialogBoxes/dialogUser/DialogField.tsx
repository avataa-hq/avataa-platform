import { TextField } from '@mui/material';
import { InputContainer, InputTitle } from '../baseStyles';

interface IProps {
  title: string | React.ReactNode;
  value: string;
  error: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  helperText: string;
  dataTestid?: string;
  disabled?: boolean;
}

export const DialogField = ({
  title,
  value,
  error,
  onChange,
  helperText,
  dataTestid,
  disabled = false,
}: IProps) => {
  return (
    <InputContainer>
      <InputTitle>{title}</InputTitle>
      <TextField
        fullWidth
        autoFocus
        error={error}
        value={value}
        data-testid={dataTestid}
        onChange={onChange}
        disabled={disabled}
        sx={(theme) => ({
          '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: theme.palette.text.disabled,
          },
          '& .MuiInputBase-input.Mui-disabled': {
            color: theme.palette.text.primary,
            WebkitTextFillColor: theme.palette.text.primary,
          },
        })}
        required
        helperText={helperText}
      />
    </InputContainer>
  );
};
