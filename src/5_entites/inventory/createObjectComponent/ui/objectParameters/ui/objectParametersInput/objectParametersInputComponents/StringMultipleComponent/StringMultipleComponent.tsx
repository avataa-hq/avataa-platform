import { useEffect, useState } from 'react';
import { Controller, ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import { usePatternConverts, InputWithIcon, useTranslate, IObjectComponentParams } from '6_shared';
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

const parameterConverters: Record<string, (array: any[]) => any[]> = {
  str: (array: string[]) => array,
  int: (array: any[]) => array.map((item) => (item === '' ? '' : Number(item))),
  float: (array: any[]) => array.map((item) => (item === '' ? '' : parseFloat(item))),
};

export const StringMultipleComponent = ({ param }: IProps) => {
  const translate = useTranslate();
  const [paramsValues, setParamsValues] = useState<any[]>([]);
  const { patternConverts } = usePatternConverts();
  const { control, setError, clearErrors, setValue, unregister, getValues } = useFormContext();

  useEffect(() => {
    if (Array.isArray(param.value) && paramsValues.length === 0) {
      setParamsValues(param.value);
    }

    if (getValues(param.id.toString()) && paramsValues.length === 0) {
      setParamsValues(getValues(param.id.toString()));
    }

    if (
      (param.value === null &&
        paramsValues.length === 0 &&
        getValues(param.id.toString()) === null) ||
      (param.value?.length === 0 && paramsValues.length === 0)
    ) {
      setParamsValues(['']);
    }
  }, [getValues, param.id, param.value, paramsValues]);

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    field.onChange(e);

    const { value, name } = e.target;

    if (value.trim() === '') {
      setValue(name, null);
      unregister(name);
      const newParamsValues = [...paramsValues];
      newParamsValues[Number(name[name.length - 1])] = value;
      setParamsValues(newParamsValues);

      if (paramsValues.length === 1) {
        unregister(param.id.toString());
        return;
      }
    } else {
      const newParamsValues = [...paramsValues];
      newParamsValues[Number(name[name.length - 1])] = value;
      setParamsValues(newParamsValues);

      setValue(param.id.toString(), parameterConverters[param.val_type]?.(newParamsValues));

      clearErrors(name);
    }

    if (param.val_type === 'int' && !/^-?\d+$/.test(value)) {
      setError(name, {
        type: 'required',
        message: translate('Please enter a valid number'),
      });
    }

    if (param.val_type === 'float' && !/^-?[0-9]*(\.[0-9]+)?$/.test(value)) {
      setError(name, {
        type: 'pattern',
        message: translate('Please enter a valid float'),
      });
    }
  };

  const addNewField = () => {
    const newFieldIndex = paramsValues.length;
    setParamsValues((prev) => [...prev, '']);
    if (newFieldIndex === 1 && !paramsValues[0]) {
      setError(`${param.id}${newFieldIndex - 1}`, {
        type: 'required',
        message: translate('This field is required'),
      });
    }
    setError(`${param.id.toString()}${newFieldIndex}`, {
      type: 'required',
      message: translate('This field is required'),
    });
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newParamsValues = paramsValues.filter((_, i) => i !== index);
    setParamsValues(newParamsValues);
    setValue(param.id.toString(), newParamsValues);
    clearErrors(`${param.id.toString()}${index}`);
    unregister(`${param.id}${index}`);
    setValue(param.id.toString(), parameterConverters[param.val_type]?.(newParamsValues));
  };

  useEffect(() => {
    paramsValues.forEach((item, idx) => {
      setValue(`${param.id.toString()}${idx}`, item);
      if (param.value !== null && item === '') {
        setError(`${param.id}${idx}`, {
          type: 'required',
          message: translate('This field is required'),
        });
      }
    });
  }, [param, paramsValues, setError, setValue, translate]);

  return (
    <ComponentContent>
      {paramsValues.map((item, idx) => (
        <Controller
          // eslint-disable-next-line react/no-array-index-key
          key={`${param.id}${idx}`}
          control={control}
          name={`${param.id}${idx}`.toString()}
          defaultValue={paramsValues[idx]}
          rules={{
            required: translate('This field is required'),
            pattern: patternConverts(param.val_type),
          }}
          render={({ field, fieldState }) => (
            <>
              <Body>
                <SubText>{`${idx + 1}.`}</SubText>
                <InputWithIcon
                  multiline
                  height="auto"
                  value={item}
                  widthPercent
                  inputProps={{
                    ...field,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      onFieldChange(e, field);
                    },
                  }}
                />

                <DeleteButton onClick={() => deleteField(idx)} />
              </Body>
              {fieldState.error && (
                <Typography fontSize={10} color="error">
                  {fieldState.error.message}
                </Typography>
              )}
            </>
          )}
        />
      ))}
      <Footer>
        <AddButton onClick={() => addNewField()} />
      </Footer>
    </ComponentContent>
  );
};
