import { useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useParseEnumConstraint } from '5_entites';
import { useSettingsObject, useTranslate } from '6_shared';
import {
  HorizontalContainer,
  InputContainer,
  ListMark,
  Icon,
} from '../../ObjectAndParamTypeModal.styled';

export const ParamTypeEnum = () => {
  const translate = useTranslate();

  const { paramState, paramTypeDataAtTheStartEditing, setParamState } = useSettingsObject();

  const [constraintArray, setConstraintArray] = useState<string[]>([]);

  const { options } = useParseEnumConstraint({
    constraint: paramTypeDataAtTheStartEditing?.constraint,
  });

  useEffect(() => {
    if (paramState.constraint && !constraintArray.length) {
      setConstraintArray(options);
    }
  }, [constraintArray.length, options, paramState.constraint]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setParamState({
        ...paramState,
        isErrorEnumConstraint: constraintArray.some((item) => item.trim() === ''),
        enumConstraint: constraintArray,
      });
    }, 500);

    return () => clearTimeout(timerId);
  }, [constraintArray, paramState]);

  const onChangeValueOfList = (newValue: string, index: number) =>
    setConstraintArray((prevArray) => prevArray.map((item, i) => (i === index ? newValue : item)));

  const onDeleteValueInList = (index: number) =>
    setConstraintArray((prevArray) => prevArray.filter((_, i) => i !== index));

  const addNewInput = () => setConstraintArray((prevArray) => [...prevArray, '']);

  return (
    <InputContainer marginBottom="20px">
      <Typography marginBottom="6px">{translate('Constraint')}</Typography>
      {constraintArray.map((item, index) => (
        <HorizontalContainer key={index} marginBottom={item.trim().length === 0 ? '0px' : '21px'}>
          <ListMark minWidth="20px">{index + 1}</ListMark>
          <TextField
            value={item}
            onChange={(event) => onChangeValueOfList(event.target.value, index)}
            size="small"
            autoFocus
            autoComplete="off"
            error={item.trim().length === 0}
            helperText={item.trim().length === 0 && translate('The field cannot be empty')}
            sx={{
              width: index === 0 ? '340px' : '300px',
              paddingRight: index === 0 ? '44px' : '0',
            }}
          />
          {index !== 0 && (
            <Icon onClick={() => onDeleteValueInList(index)}>
              <Delete />
            </Icon>
          )}
        </HorizontalContainer>
      ))}
      <Box component="div" display="flex" justifyContent="center">
        <Icon onClick={addNewInput}>
          <Add />
        </Icon>
      </Box>
    </InputContainer>
  );
};
