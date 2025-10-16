import { useEffect, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import {
  IParams,
  parameterConverters,
  InputComponent,
  CustomTooltip,
  ICreateTooltipTextProps,
} from '5_entites';
import { useTranslate } from '6_shared';
import * as SC from './StringMultipleComponent.styled';

interface IProps {
  param: IParams;
  isEdited: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  createTooltipText?: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  isParamResolver?: boolean;
}

export const StringMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton,
  endButtonSlot,
  createTooltipText,
  isParamResolver,
}: IProps) => {
  const translate = useTranslate();
  const [paramsValues, setParamsValues] = useState<any[]>([]);
  // const [shouldDisplayDeleteFieldButton, setShouldDisplayDeleteFieldButton] = useState(false);

  const { control, setError, clearErrors, setValue, unregister } = useFormContext();

  useEffect(() => {
    if (Array.isArray(param.value) && paramsValues.length === 0) {
      setParamsValues(param.value);
    }

    if (
      (param.value === null && paramsValues.length === 0) ||
      (param.value !== null && param.value.length === 0 && paramsValues.length === 0)
    ) {
      setParamsValues(['']);
    }
  }, [param.value, paramsValues.length]);

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    field.onChange(e);

    const { value, name } = e.target;

    if (value.trim() === '') {
      if (!isParamResolver) {
        setValue(name, null);
        unregister(name);
      }

      if (isParamResolver) {
        setError(name, {
          type: 'required',
          message: translate('This field is required'),
        });
      }

      const newParamsValues = [...paramsValues];
      newParamsValues[Number(name[name.length - 1])] = value;
      setParamsValues(newParamsValues);

      if (paramsValues.length === 1) {
        unregister(param.tprm_id.toString());
        return;
      }
    } else {
      const newParamsValues = [...paramsValues];
      newParamsValues[Number(name[name.length - 1])] = value;
      setParamsValues(newParamsValues);

      setValue(param.tprm_id.toString(), parameterConverters[param.val_type]?.(newParamsValues));

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

  // useEffect(() => {
  //   setShouldDisplayDeleteFieldButton(paramsValues.length > 1);
  // }, [paramsValues.length]);

  const addNewField = () => {
    const newFieldIndex = paramsValues.length;
    setParamsValues((prev) => [...prev, '']);
    if (newFieldIndex === 1 && !paramsValues[0]) {
      setError(`${param.tprm_id}${newFieldIndex - 1}`, {
        type: 'required',
        message: translate('This field is required'),
      });
    }
    setError(`${param.tprm_id}${newFieldIndex}`, {
      type: 'required',
      message: translate('This field is required'),
    });
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newParamsValues = paramsValues.filter((_, i) => i !== index);
    setParamsValues(newParamsValues);
    setValue(param.tprm_id.toString(), newParamsValues);
    clearErrors(`${param.tprm_id}${index}`);
    unregister(`${param.tprm_id}${index}`);
    setValue(param.tprm_id.toString(), parameterConverters[param.val_type]?.(newParamsValues));
  };

  useEffect(() => {
    paramsValues.forEach((item, idx) => {
      setValue(`${param.tprm_id}${idx}`, item);
      if (param.value !== null && item === '') {
        setError(`${param.tprm_id}${idx}`, {
          type: 'required',
          message: translate('This field is required'),
        });
      }
    });
  }, [param.tprm_id, param.value, paramsValues, setError, setValue, translate]);

  const tooltipText = useMemo(
    () =>
      createTooltipText?.({ paramValType: param.val_type, paramConstraint: param.constraint }) ??
      '',
    [createTooltipText, param.val_type, param.constraint],
  );

  const shouldDisplayDeleteFieldButton = useMemo(
    () => paramsValues.length > 1,
    [paramsValues.length],
  );

  return (
    <SC.StringMultipleComponentStyled>
      <CustomTooltip
        tooltipText={tooltipText}
        customSX={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3125rem',
        }}
      >
        {paramsValues.map((item, idx) => (
          <Controller
            // eslint-disable-next-line react/no-array-index-key
            key={`${param.tprm_id}${idx}`}
            control={control}
            name={`${param.tprm_id}${idx}`.toString()}
            defaultValue={paramsValues[idx]}
            render={({ field, fieldState }) => (
              <>
                <InputComponent
                  value={item}
                  isEdited={isEdited}
                  field={field}
                  onFieldChange={onFieldChange}
                  addNewField={addNewField}
                  deleteField={deleteField}
                  idx={idx}
                  shouldDisplayDeleteFieldButton={shouldDisplayDeleteFieldButton}
                  param={param}
                  onDeleteClick={onDeleteClick}
                  showDeleteButton={showDeleteButton}
                  endButtonSlot={endButtonSlot}
                />

                {fieldState.error && (
                  <Typography fontSize={10} color="error">
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        ))}
      </CustomTooltip>
    </SC.StringMultipleComponentStyled>
  );
};
