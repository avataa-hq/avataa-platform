import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  LocalizationProvider,
  DateTimePicker,
  DateTimeValidationError,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { IObjectComponentParams, useTimezoneAdjustment, useTranslate } from '6_shared';
import {
  AddButton,
  Body,
  ComponentContent,
  DeleteButton,
  Footer,
  SubText,
} from '../../commonComponents';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  param: IObjectComponentParams;
}

export const DateTimeMultipleComponent = ({ param }: IProps) => {
  const translate = useTranslate();
  const { disableTimezoneAdjustment, getAdjustedDateTime } = useTimezoneAdjustment();

  const [dateValues, setDateValues] = useState<string[]>([]);
  const [dateError, setDateError] = useState<Record<string, DateTimeValidationError>>({});

  const { setValue, getValues, setError, clearErrors } = useFormContext();

  useEffect(() => {
    const fieldValues = getValues(param.id.toString());
    if (fieldValues && dateValues.length === 0) {
      const newDateValues = fieldValues.map((item: string) => getAdjustedDateTime(dayjs(item)));
      setDateValues(newDateValues);
    }
  }, [dateValues, getValues, param, getAdjustedDateTime]);

  const formatDateTime = (dates: string[]) => {
    const newDateFormValues = dates.map((item: string) => getAdjustedDateTime(dayjs(item)));
    return newDateFormValues;
  };

  const onDateChange = (date: dayjs.Dayjs | null, index: number) => {
    if (date !== null) {
      const newDateValues = [...dateValues];
      newDateValues[index] = getAdjustedDateTime(date);
      setDateValues(newDateValues);
      setValue(param.id.toString(), formatDateTime(newDateValues));
    }
  };

  const addNewField = () => {
    const dateNow = disableTimezoneAdjustment
      ? `${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSSSS')}Z`
      : dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]');
    const newDateValues = [...dateValues, dateNow];
    setDateValues(newDateValues);
    setValue(param.id.toString(), formatDateTime(newDateValues));
    clearErrors(param.id.toString());
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newDateValues = [...dateValues].filter((_, i) => i !== index);
    setDateValues(newDateValues);
    setValue(param.id.toString(), newDateValues);
    if (newDateValues.length === 0)
      setError(param.id.toString(), {
        type: 'required',
        message: translate('This field is required'),
      });
  };

  return (
    <ComponentContent>
      {dateValues.map((item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Body key={`${param.id.toString()}${idx}`}>
          <SubText>{`${idx}.`}</SubText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: '100%' }}
              value={dayjs(item)}
              onChange={(newDate) => onDateChange(newDate, idx)}
              slotProps={{
                actionBar: { actions: ['clear', 'accept', 'cancel'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              format="DD/MM/YYYY HH:mm"
              timezone={disableTimezoneAdjustment ? 'UTC' : 'system'}
              views={['year', 'month', 'day', 'hours', 'minutes']}
              onError={(newError) => {
                setDateError({ ...dateError, [`${param.name}${idx}`]: newError });
              }}
            />
          </LocalizationProvider>

          <DeleteButton onClick={() => deleteField(idx)} />
        </Body>
      ))}
      <Footer>
        <AddButton onClick={() => addNewField()} />
      </Footer>
    </ComponentContent>
  );
};
