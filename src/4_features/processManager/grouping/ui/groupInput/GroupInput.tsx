import TextField from '@mui/material/TextField';

interface IProps {
  value: string;
  setValue: (value: string) => void;
  isError: boolean;
  setIsError: (error: boolean) => void;
  errorMessage: string;
  label: string;
}
export const GroupInput = ({
  setIsError,
  errorMessage,
  isError,
  setValue,
  value,
  label,
}: IProps) => {
  return (
    <TextField
      autoFocus
      margin="dense"
      id="name"
      label={isError ? errorMessage : label}
      type="text"
      fullWidth
      variant="standard"
      value={value}
      error={isError}
      onChange={({ target }) => {
        setValue(target.value);
        if (target.value.length > 0) setIsError(false);
      }}
      sx={{ '& label': { mb: -1 } }}
    />
  );
};
