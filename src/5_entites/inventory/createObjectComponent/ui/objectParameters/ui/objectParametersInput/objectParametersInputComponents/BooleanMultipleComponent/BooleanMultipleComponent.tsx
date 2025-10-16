import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
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

export const BooleanMultipleComponent = ({ param }: IProps) => {
  const translate = useTranslate();

  const [booleanValues, setBooleanValues] = useState<boolean[]>([]);

  const { control, setValue, getValues, clearErrors, setError } = useFormContext();

  useEffect(() => {
    const fieldValues = getValues(param.id.toString());
    if (fieldValues && booleanValues.length === 0) {
      setBooleanValues(fieldValues);
    }
  }, [getValues, param, booleanValues]);

  const onBooleanChange = (e: SelectChangeEvent<boolean>, index: number) => {
    const { value } = e.target;
    const newBooleanValues = [...booleanValues];
    const newValue = value === 'true';
    newBooleanValues[index] = newValue;
    setBooleanValues(newBooleanValues);
    setValue(param.id.toString(), newBooleanValues);
  };

  const addNewField = () => {
    const newValues = [...booleanValues, Boolean(true)];
    setBooleanValues(newValues);
    setValue(param.id.toString(), newValues);
    clearErrors(param.id.toString());
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newBooleanValues = [...booleanValues].filter((_, i) => i !== index);
    setBooleanValues(newBooleanValues);
    setValue(param.id.toString(), newBooleanValues);
    if (newBooleanValues.length === 0)
      setError(param.id.toString(), {
        type: 'required',
        message: translate('This field is required'),
      });
  };

  return (
    <Controller
      control={control}
      name={param.id.toString()}
      defaultValue={param.value ?? ''}
      rules={{
        required: param.required || param.primary ? translate('This field is required') : false,
      }}
      render={({ field }) => (
        <ComponentContent>
          {booleanValues.map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Body key={`${param.id.toString()}${idx}`}>
              <SubText>{`${idx}.`}</SubText>
              <Select
                {...field}
                value={item}
                onChange={(newValue) => onBooleanChange(newValue, idx)}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>

              <DeleteButton onClick={() => deleteField(idx)} />
            </Body>
          ))}
          <Footer>
            <AddButton onClick={() => addNewField()} />
          </Footer>
        </ComponentContent>
      )}
    />
  );
};
