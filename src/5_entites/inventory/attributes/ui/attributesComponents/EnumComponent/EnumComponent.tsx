import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { AutocompleteWrapper, DeleteButton, IParams, useParseEnumConstraint } from '5_entites';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

export const EnumComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
  customWrapperStyles,
  testid,
}: IProps) => {
  const theme = useTheme();
  const { control, setValue, clearErrors } = useFormContext();

  const [selectedOption, setSelectedOption] = useState(param.value ?? '');

  const { options } = useParseEnumConstraint({ constraint: param.constraint });

  return (
    <Controller
      control={control}
      defaultValue={param.value}
      name={param.tprm_id.toString()}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <>
          <AutocompleteWrapper
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
            }}
            style={{ ...customWrapperStyles }}
          >
            <Autocomplete
              {...field}
              value={selectedOption}
              disabled={!isEdited}
              onChange={(_, newValue) => {
                onChange(newValue);
                if (newValue) {
                  setSelectedOption(newValue);
                  setValue(param.tprm_id.toString(), newValue);
                  clearErrors(param.tprm_id.toString());
                }
              }}
              options={options}
              renderInput={(params) => (
                <TextField data-testid={testid} variant="outlined" {...params} />
              )}
              sx={{
                backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
                borderRadius: '10px',
                width: '100%',
              }}
            />

            {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
            {endButtonSlot}
          </AutocompleteWrapper>
          {fieldState.error && (
            <Typography fontSize={10} color="error">
              {fieldState.error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
};
