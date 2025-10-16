import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  LocalizationProvider,
  DateTimePicker,
  DateTimeValidationError,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { IObjectComponentParams, useTimezoneAdjustment, useTranslate } from '6_shared';
import { ErrorMessage, Label, Wrapper } from '../../commonComponents';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  param: IObjectComponentParams;
}

export const DateTimeComponent = ({ param }: IProps) => {
  const translate = useTranslate();
  const { control, setValue, getValues } = useFormContext();
  const { disableTimezoneAdjustment, getAdjustedDateTime } = useTimezoneAdjustment();

  const [dateError, setDateError] = useState<DateTimeValidationError | null>(null);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const newDate = getAdjustedDateTime(date);
      setValue(param.id.toString(), newDate);
    } else {
      setValue(param.id.toString(), null);
    }
  };

  return (
    <Controller
      control={control}
      name={param.id.toString()}
      defaultValue={param.value ? getAdjustedDateTime(dayjs(param.value)) : null}
      render={({ field, fieldState: { error } }) => (
        <Wrapper sx={{ position: 'relative' }}>
          <Label>{param.name}</Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              {...field}
              value={
                getValues(param.id.toString()) !== null
                  ? dayjs(getValues(param.id.toString()))
                  : null
              }
              onChange={handleDateChange}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              format="DD/MM/YYYY HH:mm"
              timezone={disableTimezoneAdjustment ? 'UTC' : 'system'}
              views={['year', 'month', 'day', 'hours', 'minutes']}
              onError={(newError) => setDateError(newError)}
              sx={{
                width: '60%',
                height: '24px',
                '.MuiInputBase-root': {
                  height: '24px',
                },
                '.MuiSvgIcon-root': {
                  width: '18px',
                  height: '18px',
                },
              }}
            />
            {(dateError || error) && (
              <ErrorMessage color="error">
                {dateError
                  ? translate('Please select the correct date')
                  : translate('This field is required')}
              </ErrorMessage>
            )}
          </LocalizationProvider>
        </Wrapper>
      )}
    />
  );
};
