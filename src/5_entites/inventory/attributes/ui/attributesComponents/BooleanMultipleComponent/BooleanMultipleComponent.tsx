import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { IParams, ThreeDotsMenu } from '5_entites';
import * as SC from './BooleanMultipleComponent.styled';

interface IProps {
  param: IParams;
  isEdited: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

export const BooleanMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton,
  endButtonSlot,
}: IProps) => {
  const [booleanValues, setBooleanValues] = useState<any[]>([]);
  const [shouldDisplayDeleteFieldButton, setShouldDisplayDeleteFieldButton] = useState(false);

  const { setValue } = useFormContext();

  useEffect(() => {
    if (Array.isArray(param.value) && booleanValues.length === 0) {
      setBooleanValues(param.value as boolean[]);
    }

    if (param.value === null && booleanValues.length === 0) {
      setBooleanValues(['']);
    }
  }, [booleanValues.length, param.value]);

  const onBooleanChange = (e: SelectChangeEvent<boolean>, index: number) => {
    const { value } = e.target;
    const newBooleanValues = [...booleanValues];
    const newValue = value === 'true';
    newBooleanValues[index] = newValue;
    setBooleanValues(newBooleanValues);

    if (newBooleanValues.length && newBooleanValues[0] !== '') {
      setValue(param.tprm_id.toString(), newBooleanValues);
    }
  };

  useEffect(() => {
    if (booleanValues.length && booleanValues[0] !== '') {
      setValue(param.tprm_id.toString(), booleanValues);
    }
  }, [booleanValues, param.tprm_id, setValue]);

  useEffect(() => {
    setShouldDisplayDeleteFieldButton(booleanValues.length > 1);
  }, [booleanValues.length]);

  const addNewField = () => {
    setBooleanValues((prev) => [...prev, Boolean(true)]);
  };

  const deleteField = (index: number | null) => {
    if (index === null) return;
    const newBooleanValues = [...booleanValues].filter((item, i) => i !== index);
    setBooleanValues(newBooleanValues);
    setValue(param.tprm_id.toString(), newBooleanValues);
  };

  return (
    <SC.BooleanMultipleComponentStyled>
      {booleanValues.map((item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <SC.Wrapper key={`${param.tprm_id}${idx}`}>
          <Select
            value={item ?? ''}
            onChange={(newValue) => onBooleanChange(newValue, idx)}
            disabled={!isEdited}
            sx={{ height: '37px' }}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>

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
      ))}
    </SC.BooleanMultipleComponentStyled>
  );
};
