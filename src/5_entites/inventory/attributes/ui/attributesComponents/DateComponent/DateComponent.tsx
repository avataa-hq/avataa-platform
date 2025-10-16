import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LocalizationProvider, DatePicker, DateValidationError } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { DeleteButton, IParams, Wrapper } from '5_entites';
import { useTranslate } from '6_shared';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

export const DateComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
  customWrapperStyles,
  testid,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const { control, setValue, clearErrors } = useFormContext();

  const [dateError, setDateError] = useState<DateValidationError | null>(null);

  return (
    <Controller
      control={control}
      name={param.tprm_id.toString()}
      defaultValue={param.value ?? ''}
      render={({ field }) => (
        <>
          <Wrapper
            sx={{ paddingRight: showDeleteButton ? 0 : '40px' }}
            style={{ ...customWrapperStyles }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                {...field}
                disabled={!isEdited}
                value={param.value !== null ? dayjs(param.value as string) : null}
                onChange={(date) => {
                  const newDate = date?.format('YYYY-MM-DD');
                  if (newDate) {
                    setValue(param.tprm_id.toString(), newDate);
                    clearErrors(param.tprm_id.toString());
                  }
                }}
                data-testid={testid}
                slotProps={{
                  actionBar: { actions: ['clear', 'cancel', 'accept'] },
                  toolbar: {
                    toolbarPlaceholder: '??',
                  },
                }}
                format="DD/MM/YYYY"
                views={['year', 'month', 'day']}
                onError={(newError) => setDateError(newError)}
                sx={{
                  backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
                  borderRadius: '10px',
                  width: '100%',
                }}
              />
            </LocalizationProvider>
            {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
            {endButtonSlot}
          </Wrapper>
          {dateError && (
            <Typography fontSize={10} color="error">
              {translate('Please select the correct date')}
            </Typography>
          )}
        </>
      )}
    />
  );
};
