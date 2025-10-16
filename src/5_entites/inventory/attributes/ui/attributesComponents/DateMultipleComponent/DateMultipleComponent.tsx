import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { LocalizationProvider, DatePicker, DateValidationError } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs from 'dayjs';
import { Typography, useTheme } from '@mui/material';
import { IParams, ThreeDotsMenu } from '5_entites';
import { useTranslate } from '6_shared';
import * as SC from './DateMultipleComponent.styled';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

export const DateMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton,
  endButtonSlot,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const { control, setValue } = useFormContext();

  const [dateValues, setDateValues] = useState<string[]>([]);

  const [dateError, setDateError] = useState<Record<string, DateValidationError>>({});
  const [shouldDisplayDeleteFieldButton, setShouldDisplayDeleteFieldButton] = useState(false);

  useEffect(() => {
    if (Array.isArray(param.value) && param.value.length > 0 && dateValues.length === 0) {
      setDateValues(param.value as string[]);
    }

    if ((param.value === null || param.value.length === 0) && dateValues.length === 0) {
      setDateValues(['']);
    }
  }, [param.value, dateValues.length]);

  const onDateChange = (date: dayjs.Dayjs | null, index: number) => {
    if (date) {
      const newDateValues = [...dateValues];
      newDateValues[index] = date.format('YYYY-MM-DD');
      setDateValues(newDateValues);

      if (newDateValues.length && newDateValues[0] !== '') {
        setValue(param.tprm_id.toString(), newDateValues);
      }
    }
  };

  useEffect(() => {
    if (dateValues.length && dateValues[0] !== '') {
      setValue(param.tprm_id.toString(), dateValues);
    }
  }, [dateValues, param.tprm_id, setValue]);

  useEffect(() => {
    setShouldDisplayDeleteFieldButton(dateValues.length > 1);
  }, [dateValues.length]);

  const addNewField = () => {
    const dateNow = dayjs().format('YYYY-MM-DD');
    setDateValues((prev) => [...prev, dateNow]);
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newDateValues = [...dateValues].filter((item, i) => i !== index);
    setDateValues(newDateValues);
    setValue(param.tprm_id.toString(), newDateValues);
  };

  useEffect(() => {
    dateValues.forEach((item, idx) => {
      setValue(`${param.tprm_id}${idx}`, item);
    });
  }, [param.tprm_id, dateValues, setValue]);

  return (
    <SC.DateMultipleComponentStyled>
      {dateValues.map((item, idx) => (
        <Controller
          // eslint-disable-next-line react/no-array-index-key
          key={`${param.tprm_id}${idx}`}
          control={control}
          name={`${param.tprm_id}${idx}`.toString()}
          defaultValue={dateValues[idx] ?? dayjs().format('YYYY-MM-DD')}
          render={({ field }) => (
            <>
              <SC.Wrapper>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    {...field}
                    disabled={!isEdited}
                    value={item !== '' ? dayjs(item) : null}
                    onChange={(newDate) => onDateChange(newDate, idx)}
                    slotProps={{
                      actionBar: { actions: ['clear', 'cancel', 'accept'] },
                      toolbar: {
                        toolbarPlaceholder: '??',
                      },
                    }}
                    format="DD/MM/YYYY"
                    views={['year', 'month', 'day']}
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
    </SC.DateMultipleComponentStyled>
  );
};
