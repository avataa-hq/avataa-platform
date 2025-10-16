import { SearchRounded } from '@mui/icons-material';
import { AutocompleteRenderInputParams, CircularProgress, TextField } from '@mui/material';

interface GraphSearchInputProps {
  isLoading: boolean;
  params: AutocompleteRenderInputParams;
  label?: string;
}

export const GraphSearchInput = ({
  isLoading,
  label,
  params: { InputLabelProps, ...params },
}: GraphSearchInputProps) => {
  return (
    <TextField
      label={label}
      {...params}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <SearchRounded sx={{ color: (theme) => theme.palette.neutralVariant.icon }} />
        ),
        endAdornment: (
          <>
            {isLoading && <CircularProgress size={20} />}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  );
};
