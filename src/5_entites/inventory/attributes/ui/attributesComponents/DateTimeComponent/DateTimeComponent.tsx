import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  LocalizationProvider,
  DateTimePicker,
  DateTimeValidationError,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { DeleteButton, IParams, Wrapper } from '5_entites';
import { useTimezoneAdjustment, useTranslate } from '6_shared';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

export const DateTimeComponent = ({
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
  const { disableTimezoneAdjustment, getAdjustedDateTime } = useTimezoneAdjustment();

  const [dateError, setDateError] = useState<DateTimeValidationError | null>(null);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const newDate = getAdjustedDateTime(date);
      setValue(param.tprm_id.toString(), newDate);
    } else {
      setValue(param.tprm_id.toString(), null);
    }

    clearErrors(param.tprm_id.toString());
  };

  return (
    <Controller
      control={control}
      name={param.tprm_id.toString()}
      defaultValue={param.value}
      render={({ field }) => (
        <>
          <Wrapper
            sx={{ paddingRight: showDeleteButton ? 0 : '40px' }}
            style={{ ...customWrapperStyles }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                {...field}
                disabled={!isEdited}
                value={param.value !== null ? dayjs(String(param.value)) : null}
                onChange={handleDateChange}
                slotProps={{
                  actionBar: { actions: ['clear', 'cancel', 'accept'] },
                  toolbar: {
                    toolbarPlaceholder: '??',
                  },
                }}
                data-testid={testid}
                format="DD/MM/YYYY HH:mm"
                timezone={disableTimezoneAdjustment ? 'UTC' : 'system'}
                views={['year', 'month', 'day', 'hours', 'minutes']}
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
