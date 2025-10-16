import { Autocomplete, TextField, Typography, useTheme } from '@mui/material';
import { ITmoInfo, useTranslate } from '6_shared';
import { LineWobble } from '@uiball/loaders';

interface IProps {
  value?: ITmoInfo | null;
  options: ITmoInfo[];
  onChange?: (tmo: ITmoInfo) => void;
  isLoading?: boolean;
  isError?: boolean;
  readonly?: boolean;
}
export const ObjectTypeAutocomplete = ({
  options,
  value,
  onChange,
  isLoading,
  isError,
  readonly,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  return (
    <Autocomplete
      sx={{ minWidth: 210, flex: 1 }}
      value={value}
      options={options}
      getOptionLabel={(option) => option.name}
      onChange={(_, tmoInfo) => {
        if (tmoInfo) onChange?.(tmoInfo);
        else onChange?.({ name: '', id: null });
      }}
      readOnly={readonly}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          placeholder={translate('Select object type')}
          error={isError}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {!isError && isLoading && <LineWobble color={theme.palette.primary.main} />}
                {isError && <Typography color="error">Error </Typography>}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
