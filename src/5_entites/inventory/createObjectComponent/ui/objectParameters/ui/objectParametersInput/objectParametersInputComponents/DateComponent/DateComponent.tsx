import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LocalizationProvider, DateValidationError } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import { IObjectComponentParams, useTranslate } from '6_shared';
import { ErrorMessage, Label, Wrapper } from '../../commonComponents';
import * as SC from './DateComponent.styled';

interface IProps {
  param: IObjectComponentParams;
}

export const DateComponent = ({ param }: IProps) => {
  const translate = useTranslate();
  const { control, setValue, getValues } = useFormContext();

  const [dateError, setDateError] = useState<DateValidationError | null>(null);

  return (
    <Controller
      control={control}
      name={param.id.toString()}
      defaultValue={param.value ?? ''}
      render={({ field, fieldState: { error } }) => (
        <Wrapper sx={{ position: 'relative' }}>
          <Label>{param.name}</Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SC.DatePickerStyled
              {...field}
              value={
                getValues(param.id.toString())
                  ? dayjs(getValues(param.id.toString()) as string)
                  : null
              }
              onChange={(date) => {
                const newDate = (date as dayjs.Dayjs)?.format('YYYY-MM-DD');
                if (newDate) setValue(param.id.toString(), newDate);
              }}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              format="DD/MM/YYYY"
              views={['year', 'month', 'day']}
              onError={(newError) => setDateError(newError)}
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
