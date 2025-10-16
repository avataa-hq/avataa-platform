import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

import dayjs, { Dayjs } from 'dayjs';
import {
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  MenuItem,
  Select,
  alpha,
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

import { DateTimePeriodPicker } from '6_shared/ui/dateTimePeriodPicker/DateTimePeriodPicker';
import { formatQueryDate } from '5_entites';
import { Modal, useTranslate, Box, useSeverity } from '6_shared';
import { InfographicsElement } from './InfographicsElement';
import {
  ButtonGroupStyled,
  InfographicsPseudoElement,
  TimePeriodPickerStyled,
} from './InfographicsElement.styled';

const mockPeriods = [
  { value: 5, title: '5 minutes', minutes: 5 },
  { value: 15, title: '15 minutes', minutes: 15 },
  { value: 30, title: '30 minutes', minutes: 30 },
  { value: 60, title: '1 hour', minutes: 60 },
  { value: 240, title: '4 hours', minutes: 240 },
  { value: 720, title: '12 hours', minutes: 720 },
  { value: 1480, title: '1 day', minutes: 1480 },
  { value: 10080, title: '1 week', minutes: 10080 },
];

const dateZeroHour = dayjs().set('hour', 0).set('minute', 0);

interface IProps {
  type: string;
  color: string;
  clearedValue: number;
  onApply?: (selectedPeriod: number) => void;
}

export const InfographicsElementCleared = ({ type, color, clearedValue, onApply }: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const {
    isClearedSelected,
    period,
    setClearedInterval,
    setIsClearedSelected,
    setPeriodValue,
    setPeriodSelected,
  } = useSeverity();

  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [timeFrom, setTimeFrom] = useState<Dayjs | null>(dateZeroHour);
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs());
  const [timeTo, setTimeTo] = useState<Dayjs | null>(dayjs());
  const [periodVal, setPeriodVal] = useState<number>(period.value ?? 15);
  const [isPeriodSelected, setIsPeriodSelected] = useState<boolean>(period.selected ?? true);
  const [isApplyButtonDisabled, setIsApplyButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    let from;
    let to;
    if (dateFrom) {
      from = formatQueryDate(dateFrom, timeFrom);
    }
    if (dateTo && timeTo) {
      to = formatQueryDate(dateTo, timeTo);
    }

    if (!from || !to) return;
    setIsApplyButtonDisabled(from > to);
  }, [dateFrom, timeFrom, dateTo, timeTo]);

  const handlePeriodChange = (event: any) => {
    const periodOptionSelected = event.target.value;
    setPeriodVal(periodOptionSelected);
  };

  const handlePeriodOptionSelect = () => {
    setIsPeriodSelected(!isPeriodSelected);
  };

  const onPeriodPickerOpen = () => {
    // event.preventDefault();
    setIsPeriodPickerOpen(true);
  };

  const onPeriodPickerClose = () => {
    // event.preventDefault();
    setIsPeriodPickerOpen(false);
  };

  const onApplyPeriod = () => {
    setPeriodSelected(isPeriodSelected);

    if (isPeriodSelected) {
      setPeriodValue(periodVal);
    } else {
      setClearedInterval({
        from: dateFrom && timeFrom ? `${formatQueryDate(dateFrom, timeFrom)}+03:00` : '',
        to: `${formatQueryDate(dateTo, timeTo) ?? ''}+03:00`,
      });
    }

    setIsClearedSelected(true);
    onApply?.(period.value);

    setIsPeriodPickerOpen(false);
  };

  return (
    <ButtonGroupStyled
      sx={{
        opacity: isClearedSelected ? '0.8' : '0.4',
        backgroundColor: color,
        '&hover': { backgroundColor: color },
      }}
    >
      <InfographicsElement color={color} value={clearedValue} type={type} />
      <InfographicsPseudoElement />
      <ClickAwayListener onClickAway={onPeriodPickerClose}>
        <>
          <TimePeriodPickerStyled
            backgroundcolor={color}
            onContextMenu={onPeriodPickerOpen}
            onClick={onPeriodPickerOpen}
          >
            <CalendarMonth sx={{ color: alpha(theme.palette.common.white, 0.8) }} />
          </TimePeriodPickerStyled>
          <Modal
            open={isPeriodPickerOpen}
            onClose={onPeriodPickerClose}
            actions={
              <>
                <Button variant="outlined" onClick={onPeriodPickerClose}>
                  {translate('Cancel')}
                </Button>
                <Button
                  variant="contained"
                  disabled={isApplyButtonDisabled}
                  onClick={onApplyPeriod}
                >
                  {translate('Apply')}
                </Button>
              </>
            }
          >
            <Box style={{ padding: '2rem 0 1rem 0', display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                label="Select a period manually"
                control={
                  <Checkbox checked={!isPeriodSelected} onChange={handlePeriodOptionSelect} />
                }
              />
              <Box style={{ opacity: `${isPeriodSelected ? 0.4 : 1}` }}>
                <DateTimePeriodPicker
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  timeFrom={timeFrom}
                  timeTo={timeTo}
                  setDateFrom={setDateFrom}
                  setDateTo={setDateTo}
                  setTimeFrom={setTimeFrom}
                  setTimeTo={setTimeTo}
                  disableFutureForDateFrom
                  disableFutureForDateTo
                />
              </Box>
              <FormControlLabel
                label="Select a predefined period"
                control={
                  <Checkbox checked={isPeriodSelected} onChange={handlePeriodOptionSelect} />
                }
              />
              <Box style={{ opacity: `${isPeriodSelected ? 1 : 0.4}` }}>
                <Select value={periodVal} onChange={handlePeriodChange}>
                  {mockPeriods.map((mockPeriod) => (
                    <MenuItem key={mockPeriod.value} value={mockPeriod.value}>
                      {mockPeriod.title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Modal>
        </>
      </ClickAwayListener>
    </ButtonGroupStyled>
  );
};
