import TextField from '@mui/material/TextField';
import { InputContainer, NameCreationStyled } from './NameCreation.styled';

interface IProps {
  name: string;
  setName: (name: string) => void;
  label?: string;
  error?: boolean;
  setError?: (error: boolean) => void;
  errorMessage?: string;
}

export const NameCreation = ({ name, setName, error, setError, errorMessage, label }: IProps) => {
  return (
    <NameCreationStyled>
      <InputContainer>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          type="text"
          label={error ? errorMessage ?? '' : label ?? ''}
          fullWidth
          variant="outlined"
          value={name}
          error={error}
          onChange={({ target }) => {
            setName?.(target.value);
            if (target.value.length > 0) setError?.(false);
          }}
          // sx={{ '& label': { mb: -1 } }}
        />
      </InputContainer>
    </NameCreationStyled>
  );
};
