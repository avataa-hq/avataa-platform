import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import {
  transformDefaultValue,
  type IParams,
  ICreateTooltipTextProps,
  ParameterComponents,
} from '5_entites';
import { type IMultipleEditOptions } from '6_shared';
import { EditMultipleComponentStyled } from './EditMultipleComponent.styled';

interface IProps {
  selectedOption: IMultipleEditOptions | undefined;
  options: IMultipleEditOptions[];
  onChangeOption: (prevOpt: IMultipleEditOptions, newOption: IMultipleEditOptions) => void;
  onDeleteOptionClick: (id: number) => void;
  createTooltipText: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
}
export const EditMultipleComponent = ({
  selectedOption,
  options,
  onChangeOption,
  onDeleteOptionClick,
  createTooltipText,
}: IProps) => {
  const [param, setParam] = useState<IParams>({} as IParams);

  useEffect(() => {
    const newParam = {
      ...selectedOption,
      tprm_id: selectedOption?.id,
      value: transformDefaultValue(selectedOption?.val_type),
    } as IParams;

    setParam(newParam);
  }, [selectedOption]);

  const handleOptionChange = (e: React.SyntheticEvent, newValue: IMultipleEditOptions | null) => {
    if (newValue) onChangeOption(selectedOption as IMultipleEditOptions, newValue);
  };

  return (
    <EditMultipleComponentStyled>
      <Autocomplete
        value={param}
        options={options.sort((a, b) => a.name.localeCompare(b.name))}
        getOptionLabel={(option) => option.name ?? ''}
        isOptionEqualToValue={(option, value) => option.id !== value.id}
        renderInput={(params) => <TextField {...params} />}
        onChange={handleOptionChange}
        disableClearable
        sx={{ width: '100%' }}
      />
      <ParameterComponents
        param={param}
        isEdited
        onDeleteClick={onDeleteOptionClick}
        createTooltipText={createTooltipText}
        showDeleteButton
        customNotMultipleWrapperSx={{ width: '100%' }}
        customMultipleWrapperSx={{ width: '100%' }}
        testid={`bulk-edit__${param.name}__new-values`}
      />
    </EditMultipleComponentStyled>
  );
};
