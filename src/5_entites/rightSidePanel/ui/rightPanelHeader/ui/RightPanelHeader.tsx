import { useEffect, useState } from 'react';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import dayjs from 'dayjs';
import { Search, Close } from '@mui/icons-material';
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
  DateValidationError,
  TimeValidationError,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { Typography } from '@mui/material';
import { checkOnChangeDate, dateErrorHandler } from '5_entites';
import { InputWithIcon, useAdapterLocale, useTranslate } from '6_shared';
import * as SC from './RightPanelHeader.styled';

interface IProps {
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  dateFrom?: dayjs.Dayjs | null;
  setDateFrom?: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  timeFrom?: dayjs.Dayjs | null;
  setTimeFrom?: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  dateTo?: dayjs.Dayjs | null;
  setDateTo?: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  timeTo?: dayjs.Dayjs | null;
  setTimeTo?: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  newDrawerWidth?: number;
  searchValue?: string;
}

interface Inputs {
  searchQuery: string;
}

export const RightPanelHeader = ({
  setSearchValue,
  dateFrom,
  setDateFrom,
  timeFrom,
  setTimeFrom,
  dateTo,
  setDateTo,
  timeTo,
  setTimeTo,
  newDrawerWidth,
  searchValue,
}: IProps) => {
  const translate = useTranslate();

  const { adapterLocale } = useAdapterLocale();

  const [isInputFilled, setIsInputFilled] = useState(false);
  const [dateFromError, setDateFromError] = useState<
    DateValidationError | TimeValidationError | null
  >(null);
  const [dateToError, setDateToError] = useState<DateValidationError | TimeValidationError | null>(
    null,
  );
  const [minDateTo, setMinDateTo] = useState<dayjs.Dayjs>(dayjs().subtract(100, 'year'));
  const [minTimeTo, setMinTimeTo] = useState<dayjs.Dayjs | null>(null);

  const { control, reset, setValue } = useForm<Inputs>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const currentDate = dayjs();
  const minDate = currentDate.subtract(100, 'year');
  const maxDate = dayjs();

  useEffect(() => {
    if (searchValue !== undefined && searchValue !== '') {
      setValue('searchQuery', searchValue);
      setIsInputFilled(true);
    }
  }, [searchValue, setValue]);

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
  /**
   * Handles changes in the search input field.
   * Updates the input value, checks if it's filled, and updates the search value.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object representing the input change.
   * @param {ControllerRenderProps<Inputs, 'searchQuery'>} field  - The controller field object from react-hook-form.
   */
  const onSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<Inputs, 'searchQuery'>,
  ) => {
    field.onChange(e.target.value);
    setIsInputFilled(e.target.value.trim() !== '');
    setSearchValue?.(e.target.value.trim().toLowerCase());
  };

  /**
   * Clears the search input and resets its state when the icon is clicked.
   * If the input is filled, it clears the search value, resets the input field,
   * and updates the input filled state.
   */
  const onIconClick = () => {
    if (isInputFilled) {
      setSearchValue?.('');
      reset();
      setIsInputFilled(false);
    }
  };

  return (
    <SC.RightPanelHeaderStyled>
      <SC.Header>
        <Controller
          control={control}
          name="searchQuery"
          render={({ field }) => (
            <InputWithIcon
              inputProps={{
                ...field,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e, field),
              }}
              icon={!isInputFilled ? <Search fontSize="small" /> : <Close fontSize="small" />}
              onIconClick={() => onIconClick()}
              width={newDrawerWidth && newDrawerWidth > 575 ? 340 : 240}
              iconPosition="right"
              placeHolderText={translate('Search')}
            />
          )}
        />
      </SC.Header>

      <SC.Body>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
          <SC.DatePickerContent>
            <Typography sx={{ maxWidth: '37px', flexGrow: 1 }}>{translate('From')}</Typography>

            <DatePicker
              value={dateFrom}
              onChange={(newValue) => setDateFrom?.(checkOnChangeDate(newValue, maxDate, minDate))}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              sx={{ width: '115px' }}
              className="custom-date-picker"
              minDate={minDate}
              format="DD/MM/YYYY"
              views={['year', 'month', 'day']}
              disableFuture
              onError={(newError) => setDateFromError(newError)}
            />
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
              sx={{ width: '77px' }}
              className="custom-date-picker"
            />

            {dateFromError && (
              <SC.ErrorText>{translate(dateErrorHandler(dateFromError))}</SC.ErrorText>
            )}
          </SC.DatePickerContent>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
          <SC.DatePickerContent>
            <Typography sx={{ maxWidth: '37px', flexGrow: 1 }}>{translate('To')}</Typography>

            <DatePicker
              value={dateTo}
              onChange={(newValue) => setDateTo?.(checkOnChangeDate(newValue, maxDate, minDate))}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel', 'accept'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              sx={{ width: '115px' }}
              className="custom-date-picker"
              minDate={minDateTo}
              format="DD/MM/YYYY"
              views={['year', 'month', 'day']}
              disableFuture
              onError={(newError) => setDateToError(newError)}
            />
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
              sx={{ width: '77px' }}
              className="custom-date-picker"
            />

            {dateToError && (
              <SC.ErrorText>{translate(dateErrorHandler(dateToError, 'To'))}</SC.ErrorText>
            )}
          </SC.DatePickerContent>
        </LocalizationProvider>
      </SC.Body>
    </SC.RightPanelHeaderStyled>
  );
};
