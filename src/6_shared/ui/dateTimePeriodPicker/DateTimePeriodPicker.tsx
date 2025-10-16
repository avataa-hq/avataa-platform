import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';

const DatePickerContent = styled(Box)`
  display: grid;
  align-items: center;
  gap: 0.4rem;
  grid-template-columns: 4rem 12rem 8rem;
  z-index: 1501;
`;

interface IProps {
  dateFrom: dayjs.Dayjs | null;
  dateTo: dayjs.Dayjs | null;
  timeFrom: dayjs.Dayjs | null;
  timeTo: dayjs.Dayjs | null;
  setDateFrom: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  setDateTo: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  setTimeFrom: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  setTimeTo: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  disableFutureForDateFrom?: boolean;
  disableFutureForDateTo?: boolean;
  disableFutureForTimeFrom?: boolean;
  disableFutureForTimeTo?: boolean;
}

export const DateTimePeriodPicker = ({
  dateFrom,
  dateTo,
  timeFrom,
  timeTo,
  setDateFrom,
  setDateTo,
  setTimeFrom,
  setTimeTo,
  disableFutureForDateFrom,
  disableFutureForDateTo,
  disableFutureForTimeFrom,
  disableFutureForTimeTo,
}: IProps) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePickerContent>
          <Typography>From</Typography>

          <DatePicker
            disableFuture={disableFutureForDateFrom}
            value={dateFrom}
            onChange={(newValue) => setDateFrom(newValue)}
          />
          <TimePicker
            disableFuture={disableFutureForTimeFrom}
            value={timeFrom}
            onChange={(newValue) => setTimeFrom(newValue)}
            ampm={false}
            ampmInClock={false}
          />
        </DatePickerContent>
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePickerContent>
          <Typography>To</Typography>

          <DatePicker
            disableFuture={disableFutureForDateTo}
            value={dateTo}
            onChange={(newValue) => setDateTo(newValue)}
          />
          <TimePicker
            disableFuture={disableFutureForTimeTo}
            value={timeTo}
            onChange={(newValue) => setTimeTo(newValue)}
            ampm={false}
            ampmInClock={false}
          />
        </DatePickerContent>
      </LocalizationProvider>
    </>
  );
};
