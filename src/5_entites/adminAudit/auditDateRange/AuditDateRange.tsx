import { useState } from 'react';
import { Box, Button, Tooltip, useTheme } from '@mui/material';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import {
  DateRange,
  DateRangePicker,
  LocalizationProvider,
  SingleInputDateRangeField,
} from '@mui/x-date-pickers-pro';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { formatDateForApi, useAdapterLocale, useTranslate } from '6_shared';

interface IProps {
  onApplyDateRange: (dateFrom: string | undefined, dateTo: string | undefined) => void;
}

export const AuditDateRange = ({ onApplyDateRange }: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const { adapterLocale } = useAdapterLocale();

  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);
  const [isErrorSelectedDateRange, setIsErrorSelectedDateRange] = useState(false);

  const handleDateFilterClear = () => {
    setDateRange([null, null]);
    onApplyDateRange(undefined, undefined);
  };

  const handleDateFilterApply = () => {
    const fDate = formatDateForApi(dateRange[0], { withTime: true });
    const tDate = formatDateForApi(dateRange[1], { withTime: true });
    onApplyDateRange(fDate, tDate);
  };

  return (
    <Box component="div" display="flex" gap="20px">
      <Box component="div" display="flex" gap="10px">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
          <DemoContainer
            components={['DateRangePicker']}
            sx={{ paddingTop: '0px', marginTop: '4px' }}
          >
            <DateRangePicker
              slots={{ field: SingleInputDateRangeField }}
              value={dateRange}
              onChange={(newDateRange: DateRange<Dayjs>, context) => {
                setDateRange(newDateRange);
                setIsErrorSelectedDateRange(
                  !!context.validationError[0] || !!context.validationError[1],
                );
              }}
              format="DD-MM-YYYY"
              sx={{ width: '240px' }}
            />
          </DemoContainer>
        </LocalizationProvider>
        <Tooltip title={translate('Apply Date Filter')}>
          <Button
            variant="contained.icon"
            onClick={handleDateFilterApply}
            disabled={isErrorSelectedDateRange}
            sx={{ backgroundColor: isErrorSelectedDateRange ? theme.palette.info.main : '' }}
          >
            <EventAvailableOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip title={translate('Clear Date Filter')}>
          <Button variant="contained.icon" onClick={handleDateFilterClear}>
            <EventBusyOutlinedIcon />
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};
