import dayjs from 'dayjs';
import { useAdapterLocale, useTranslate } from '6_shared';
import { useEffect, useState } from 'react';
import {
  DatePicker,
  DateValidationError,
  LocalizationProvider,
  TimePicker,
  TimeValidationError,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Button, TextField, Typography } from '@mui/material';
import { checkOnChangeDate, dateErrorHandler } from '5_entites';
import { DateRangeCustomizerStyled, DatePickerItemContainer } from './DateRangeCustomizer.styled';
import * as SC from '../../../../rightSidePanel/ui/rightPanelHeader/ui/RightPanelHeader.styled';

interface IProps {
  dateFrom?: dayjs.Dayjs | null;
  setDateFrom?: (date: dayjs.Dayjs | null) => void;
  timeFrom?: dayjs.Dayjs | null;
  setTimeFrom?: (date: dayjs.Dayjs | null) => void;
  dateTo?: dayjs.Dayjs | null;
  setDateTo?: (date: dayjs.Dayjs | null) => void;
  timeTo?: dayjs.Dayjs | null;
  setTimeTo?: (date: dayjs.Dayjs | null) => void;
  searchValue: string;
  setSearchValue?: (value: string) => void;
}

export const DateRangeCustomizer = ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  setTimeFrom,
  setTimeTo,
  timeFrom,
  timeTo,
  searchValue,
  setSearchValue,
}: IProps) => {
  const translate = useTranslate();
  const { adapterLocale } = useAdapterLocale();

  const [dateFromError, setDateFromError] = useState<
    DateValidationError | TimeValidationError | null
  >(null);
  const [dateToError, setDateToError] = useState<DateValidationError | TimeValidationError | null>(
    null,
  );
  const [minDateTo, setMinDateTo] = useState<dayjs.Dayjs>(dayjs().subtract(100, 'year'));
  const [minTimeTo, setMinTimeTo] = useState<dayjs.Dayjs | null>(null);

  const currentDate = dayjs();
  const minDate = currentDate.subtract(100, 'year');
  const maxDate = dayjs();

  useEffect(() => {
    if (dateFrom !== null && dateFrom !== undefined) {
      setMinDateTo(dateFrom.add(1, 'day'));
    } else {
      setMinDateTo(dayjs().subtract(100, 'year'));
    }

    if (timeFrom !== null && timeFrom !== undefined) {
      setMinTimeTo(timeFrom?.add(5, 'minute'));
    } else {
      setMinTimeTo(null);
    }
  }, [dateFrom, dateTo, timeFrom]);

  return (
    <DateRangeCustomizerStyled>
      <DatePickerItemContainer>
        <TextField
          placeholder="Search"
          fullWidth
          value={searchValue ?? ''}
          onChange={(e) => setSearchValue?.(e.target.value)}
        />
      </DatePickerItemContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
        <DatePickerItemContainer>
          <div style={{ width: 40 }}>
            <Typography>{translate('From')}</Typography>
          </div>

          <div style={{ flex: 3 }}>
            <DatePicker
              value={dateFrom}
              onChange={(newValue) => setDateFrom?.(checkOnChangeDate(newValue, maxDate, minDate))}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              className="custom-date-picker"
              minDate={minDate}
              format="DD/MM/YYYY"
              views={['year', 'month', 'day']}
              disableFuture
              onError={(newError) => setDateFromError(newError)}
            />
          </div>
          <div style={{ flex: 2 }}>
            <TimePicker
              value={timeFrom}
              onChange={(newValue) => setTimeFrom?.(newValue)}
              ampm={false}
              ampmInClock={false}
              disableFuture
              onError={(newError) => setDateFromError(newError)}
              slotProps={{
                actionBar: { actions: ['clear', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              className="custom-date-picker"
            />
          </div>

          {dateFromError && (
            <SC.ErrorText>{translate(dateErrorHandler(dateFromError))}</SC.ErrorText>
          )}
        </DatePickerItemContainer>
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
        <DatePickerItemContainer>
          <div style={{ width: 40 }}>
            <Typography>{translate('To')}</Typography>
          </div>

          <div style={{ flex: 3 }}>
            <DatePicker
              value={dateTo}
              onChange={(newValue) => setDateTo?.(checkOnChangeDate(newValue, maxDate, minDate))}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              className="custom-date-picker"
              minDate={minDateTo}
              format="DD/MM/YYYY"
              views={['year', 'month', 'day']}
              disableFuture
              onError={(newError) => setDateToError(newError)}
            />
          </div>
          <div style={{ flex: 2 }}>
            <TimePicker
              value={timeTo}
              onChange={(newValue) => setTimeTo?.(newValue)}
              ampm={false}
              ampmInClock={false}
              disableFuture
              minTime={minTimeTo}
              onError={(newError) => setDateToError(newError)}
              slotProps={{
                actionBar: { actions: ['clear', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              className="custom-date-picker"
            />
          </div>

          {dateToError && (
            <SC.ErrorText>{translate(dateErrorHandler(dateToError, 'To'))}</SC.ErrorText>
          )}
        </DatePickerItemContainer>
      </LocalizationProvider>
      <Button
        sx={{ width: 30, marginLeft: 'auto' }}
        onClick={() => {
          setTimeTo?.(null);
          setTimeFrom?.(null);
          setDateTo?.(null);
          setDateFrom?.(null);
          setSearchValue?.('');
        }}
      >
        Clear
      </Button>
    </DateRangeCustomizerStyled>
  );
};
