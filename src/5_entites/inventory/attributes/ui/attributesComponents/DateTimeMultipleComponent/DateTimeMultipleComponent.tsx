import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  LocalizationProvider,
  DateTimePicker,
  DateTimeValidationError,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Typography, useTheme } from '@mui/material';
import { IParams, ThreeDotsMenu } from '5_entites';
import { useTimezoneAdjustment, useTranslate } from '6_shared';
import * as SC from './DateTimeMultipleComponent.styled';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

export const DateTimeMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton,
  endButtonSlot,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const { disableTimezoneAdjustment, getAdjustedDateTime } = useTimezoneAdjustment();

  const [dateValues, setDateValues] = useState<string[]>([]);
  const [dateError, setDateError] = useState<Record<string, DateTimeValidationError>>({});
  const [shouldDisplayDeleteFieldButton, setShouldDisplayDeleteFieldButton] = useState(false);

  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (Array.isArray(param.value) && param.value.length > 0 && dateValues.length === 0) {
      const stringParamValues = param.value as string[];
      const newDateValues = stringParamValues.map((item: string) => {
        const dateString = getAdjustedDateTime(dayjs(item));
        return dateString;
      });

      setDateValues(newDateValues);
    }

    if ((param.value === null || param.value.length === 0) && dateValues.length === 0) {
      setDateValues(['']);
    }
  }, [param.value, dateValues.length, getAdjustedDateTime]);

  const formatDateTime = (dates: string[]) => {
    const newDateFormValues = dates.map((item: string) => getAdjustedDateTime(dayjs(item)));
    return newDateFormValues;
  };

  const onDateChange = (date: dayjs.Dayjs | null, index: number) => {
    if (date !== null) {
      const newDateValues = [...dateValues];
      newDateValues[index] = getAdjustedDateTime(date);
      setDateValues(newDateValues);

      if (newDateValues.length && newDateValues[0] !== '') {
        setValue(param.tprm_id.toString(), formatDateTime(newDateValues));
      }
    }
  };

  useEffect(() => {
    if (dateValues.length && dateValues[0] !== '') {
      setValue(param.tprm_id.toString(), formatDateTime(dateValues));
    }
  }, [dateValues, param.tprm_id, setValue]);

  useEffect(() => {
    setShouldDisplayDeleteFieldButton(dateValues.length > 1);
  }, [dateValues.length]);

  const addNewField = () => {
    const dateNow = disableTimezoneAdjustment
      ? `${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSSSS')}Z`
      : dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]');
    setDateValues((prev) => [...prev, dateNow]);
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newDateValues = [...dateValues].filter((_, i) => i !== index);
    setDateValues(newDateValues);
    setValue(param.tprm_id.toString(), newDateValues);
  };

  useEffect(() => {
    dateValues.forEach((item, idx) => {
      setValue(`${param.tprm_id}${idx}`, item);
    });
  }, [param.tprm_id, dateValues, setValue]);

  return (
    <SC.DateTimeMultipleComponentStyled>
      {dateValues.map((item, idx) => (
        <Controller
          // eslint-disable-next-line react/no-array-index-key
          key={`${param.tprm_id}${idx}`}
          control={control}
          name={`${param.tprm_id}${idx}`.toString()}
          defaultValue={dateValues[idx]}
          render={({ field }) => (
            <>
              <SC.Wrapper>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    disabled={!isEdited}
                    value={item !== '' ? dayjs(item) : null}
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
                      setDateError({ ...dateError, [`${param.tprm_id}${idx}`]: newError });
                    }}
                    sx={{
                      backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
                      borderRadius: '10px',
                      width: '100%',
                    }}
                  />
                </LocalizationProvider>

                {isEdited && (
                  <ThreeDotsMenu
                    addNewField={addNewField}
                    deleteField={deleteField}
                    idx={idx}
                    shouldDisplayDeleteFieldButton={shouldDisplayDeleteFieldButton}
                    param={param}
                    onDeleteClick={onDeleteClick}
                    showDeleteButton={showDeleteButton}
                    endButtonSlot={endButtonSlot}
                  />
                )}
              </SC.Wrapper>

              {dateError[`${param.tprm_id}${idx}`] && (
                <Typography fontSize={10} color="error">
                  {translate('Please select the correct date')}
                </Typography>
              )}
            </>
          )}
        />
      ))}
    </SC.DateTimeMultipleComponentStyled>
  );
};
