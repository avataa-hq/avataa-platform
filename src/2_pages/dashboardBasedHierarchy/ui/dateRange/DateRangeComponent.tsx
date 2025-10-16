import {
  SingleInputDateRangeField,
  DateRange,
  LocalizationProvider,
  DateRangePicker,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box, useAdapterLocale, useDashboardBasedHierarchy, useTranslate } from '6_shared';
import { useDateRangeConfig } from '2_pages/dashboardBasedHierarchy/lib/useDateRangeConfig';

interface IProps {
  dataMaxDate?: string | null;
}

export const DateRangeComponent = ({ dataMaxDate }: IProps) => {
  const translate = useTranslate();

  const { dateRange, setDateRange } = useDashboardBasedHierarchy();

  const { adapterLocale } = useAdapterLocale();
  const { shortcutsItems } = useDateRangeConfig({ dataMaxDate });

  const [dateValue, setDateValue] = useState<DateRange<Dayjs>>([null, null]);
  const [isErrorSelectedDateRange, setIsErrorSelectedDateRange] = useState(false);

  useEffect(() => {
    setDateValue([dateRange[0], dateRange[1]]);
  }, [dateRange]);

  return (
    <Box component="div">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
        <DateRangePicker
          slots={{ field: SingleInputDateRangeField }}
          format="DD-MM-YYYY"
          value={dateValue}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
            actionBar: { actions: ['cancel', 'clear'] },
          }}
          onChange={(newDateRange: DateRange<Dayjs>, context) => {
            setDateValue(newDateRange);
            if (newDateRange.length === 2 && newDateRange[0] != null && newDateRange[1] != null) {
              setDateRange(newDateRange);
            }
            setIsErrorSelectedDateRange(!!context.validationError[1]);
          }}
        />
      </LocalizationProvider>
      {isErrorSelectedDateRange && (
        <Typography
          sx={{
            color: 'red',
            fontSize: '8px',
            fontWeight: '400',
          }}
        >
          {translate('Incorrect date')}
        </Typography>
      )}
    </Box>
  );
};
