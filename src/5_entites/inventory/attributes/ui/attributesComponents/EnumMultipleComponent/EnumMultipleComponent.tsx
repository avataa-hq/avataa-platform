import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography, useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { AutocompleteWrapper, DeleteButton, IParams, useParseEnumConstraint } from '5_entites';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

export const EnumMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
}: IProps) => {
  const theme = useTheme();
  const { setValue, clearErrors } = useFormContext();

  const [selectedOptions, setSelectedOptions] = useState<string[]>(param.value ?? []);

  const { options } = useParseEnumConstraint({ constraint: param.constraint });

  useEffect(() => {
    if (param.value) setValue(param.tprm_id.toString(), param.value);
  }, [param]);

  return (
    <AutocompleteWrapper
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
      }}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        disabled={!isEdited}
        value={selectedOptions}
        onChange={(_, newValue) => {
          if (newValue) {
            setSelectedOptions(newValue);
            setValue(param.tprm_id.toString(), newValue);
            clearErrors(param.tprm_id.toString());
          }
        }}
        options={options}
        renderInput={(params) => <TextField variant="outlined" {...params} />}
        sx={{
          backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
          borderRadius: '10px',
          width: '80%',
          flexGrow: 1,
        }}
      />

      {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
      {endButtonSlot}
    </AutocompleteWrapper>
  );
};
