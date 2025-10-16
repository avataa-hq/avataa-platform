import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { LocalizationProvider, DatePicker, DateValidationError } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import { IObjectComponentParams, useTranslate } from '6_shared';
import {
  AddButton,
  Body,
  ComponentContent,
  DeleteButton,
  Footer,
  SubText,
} from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
}

export const DateMultipleComponent = ({ param }: IProps) => {
  const translate = useTranslate();
  const [dateValues, setDateValues] = useState<string[]>([]);
  const [dateError, setDateError] = useState<Record<string, DateValidationError>>({});

  const { setValue, getValues, clearErrors, setError } = useFormContext();

  useEffect(() => {
    const fieldValues = getValues(param.id.toString());
    if (fieldValues && dateValues.length === 0) {
      setDateValues(fieldValues);
    }
  }, [dateValues, getValues, param]);

  const onDateChange = (date: dayjs.Dayjs | null, index: number) => {
    if (date) {
      const newDateValues = [...dateValues];
      newDateValues[index] = date.format('YYYY-MM-DD');
      setDateValues(newDateValues);
      setValue(param.id.toString(), newDateValues);
    }
  };

  const addNewField = () => {
    const dateNow = dayjs().format('YYYY-MM-DD');
    const newValues = [...dateValues, dateNow];
    setDateValues(newValues);
    setValue(param.id.toString(), newValues);
    clearErrors(param.id.toString());
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newDateValues = [...dateValues].filter((item, i) => i !== index);
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
            <DatePicker
              sx={{ width: '100%' }}
              value={dayjs(item)}
              onChange={(newDate) => onDateChange(newDate, idx)}
              slotProps={{
                actionBar: { actions: ['clear', 'cancel'] },
                toolbar: {
                  toolbarPlaceholder: '??',
                },
              }}
              format="DD/MM/YYYY"
              views={['year', 'month', 'day']}
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
