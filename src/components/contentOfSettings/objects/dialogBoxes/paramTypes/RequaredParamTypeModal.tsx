import { useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import { useGetUsers } from '5_entites';
import { Box, Modal, useGetObjectsQuery, useSettingsObject, useTranslate } from '6_shared';
import { validFloatValue, validIntValue } from '../lib/regExp';
import { InputContainer, Text } from '../ObjectAndParamTypeModal.styled';

const RequaredParamTypeModal = () => {
  const translate = useTranslate();

  const { isRequiredModalOpen, paramState, setIsRequiredModalOpen, setParamState } =
    useSettingsObject();

  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(' ');

  const { userNamesList } = useGetUsers();

  const { data: objects } = useGetObjectsQuery(
    { object_type_id: paramState.objLink?.id },
    { skip: !paramState.objLink?.id || paramState.type !== 'mo_link' || !isRequiredModalOpen },
  );

  useEffect(() => {
    if (paramState.type === 'bool') {
      setInputValue('false');
    } else {
      setInputValue('');
    }
  }, [paramState.type, isRequiredModalOpen]);

  const onClose = () => {
    setInputValue('');
    setInputError(' ');
    setIsRequiredModalOpen(false);
    setParamState({ ...paramState, fieldValue: null });
  };

  const onAddDefaultValue = () => {
    if (['str', 'mo_link', 'enum', 'user_link'].includes(paramState.type)) {
      if (inputValue.trim().length) {
        setInputError(' ');
        setParamState({ ...paramState, fieldValue: inputValue });
      } else {
        setInputError('The field must be filled');
        return;
      }
    }
    if (paramState.type === 'int') {
      if (validIntValue(inputValue)) {
        if (+inputValue > (+paramState.intMax !== 0 ? +paramState.intMax : Infinity)) {
          setInputError(`Field value should be less than or equal to ${paramState.intMax}`);
          return;
        }
        if (+inputValue < +paramState.intMin) {
          setInputError(`Field value should be greater than or equal to ${paramState.intMin}`);
          return;
        }

        setInputError(' ');
        setParamState({ ...paramState, fieldValue: inputValue });
      } else {
        setInputError('Invalid integer value');
        return;
      }
    }
    if (paramState.type === 'float') {
      if (validFloatValue(inputValue)) {
        if (+inputValue > +paramState.floatMax) {
          setInputError(`Field value should be less than or equal to ${paramState.floatMax}`);
          return;
        }
        if (+inputValue < +paramState.floatMin) {
          setInputError(`Field value should be greater than or equal to ${paramState.floatMin}`);
          return;
        }

        setInputError(' ');
        setParamState({ ...paramState, fieldValue: inputValue });
      } else {
        setInputError('Invalid float value');
        return;
      }
    }
    if (paramState.type === 'bool') {
      setParamState({ ...paramState, fieldValue: inputValue });
    }
    if (paramState.type === 'date') {
      if (inputValue && inputValue.length && inputValue !== 'Invalid Date') {
        const inputDate = new Date(inputValue);

        const year = inputDate.getUTCFullYear();
        const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getUTCDate()).padStart(2, '0');
        const convertedDate = `${year}-${month}-${day}`;

        setParamState({ ...paramState, fieldValue: convertedDate });
      } else {
        setInputError('Please select a date');
        return;
      }
    }
    if (paramState.type === 'datetime') {
      if (inputValue && inputValue.length && inputValue !== 'Invalid Date') {
        const inputDate = new Date(inputValue);

        const year = inputDate.getUTCFullYear();
        const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getUTCDate()).padStart(2, '0');
        const hours = String(inputDate.getUTCHours()).padStart(2, '0');
        const minutes = String(inputDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(inputDate.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(inputDate.getUTCMilliseconds()).padStart(3, '0');
        const convertedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

        setParamState({ ...paramState, fieldValue: convertedDate });
      } else {
        setInputError('Please select a date');
        return;
      }
    }
    if (paramState.type === 'sequence') {
      setParamState({ ...paramState, fieldValue: 1 });
    }

    setInputValue('');
    setInputError(' ');
    setIsRequiredModalOpen(false);
  };

  return (
    <Modal
      open={isRequiredModalOpen}
      onClose={onClose}
      title={translate('You specified this parameter type as required')}
      width={460}
      actions={
        <>
          <Button variant="outlined" onClick={onClose}>
            {translate('Cancel')}
          </Button>
          <Button variant="contained" onClick={onAddDefaultValue}>
            {translate('Create')}
          </Button>
        </>
      }
    >
      {paramState.type === 'str' && (
        <InputContainer>
          <Text mb="15px">{translate('Please enter the default string value')}:</Text>
          <TextField
            defaultValue={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            size="small"
            autoFocus
            autoComplete="off"
            error={inputError !== ' '}
            helperText={inputError}
          />
        </InputContainer>
      )}

      {paramState.type === 'int' && (
        <InputContainer>
          <Text mb="15px">{translate('Please enter the default integer value')}:</Text>
          <TextField
            defaultValue={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            size="small"
            autoFocus
            autoComplete="off"
            type="number"
            error={inputError !== ' '}
            helperText={inputError}
          />
        </InputContainer>
      )}

      {paramState.type === 'float' && (
        <InputContainer>
          <Text mb="15px">{translate('Please enter the default float value')}:</Text>
          <TextField
            defaultValue={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            size="small"
            autoFocus
            autoComplete="off"
            type="number"
            error={inputError !== ' '}
            helperText={inputError}
          />
        </InputContainer>
      )}

      {paramState.type === 'bool' && (
        <Box display="flex" alignItems="center">
          <Text mb="0">{translate('Please choose the default boolean value:')}</Text>
          <CheckBoxCustom
            sx={{ p: '4px', marginX: 1.1, marginBottom: '4px' }}
            // eslint-disable-next-line no-unneeded-ternary
            checked={inputValue === 'true' ? true : false}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(event.target.checked ? 'true' : 'false')
            }
          />
        </Box>
      )}

      {paramState.type === 'date' && (
        <InputContainer>
          <Text mb="15px">{translate('Please enter the default date value')}:</Text>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={(newValue: any) => setInputValue(newValue?.$d.toString())}
              sx={{ paddingBottom: '4px' }}
            />
          </LocalizationProvider>
        </InputContainer>
      )}

      {paramState.type === 'datetime' && (
        <InputContainer>
          <Text>{translate('Please enter the default date value')}:</Text>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              onChange={(newValue: any) => setInputValue(newValue?.$d.toString())}
              sx={{ paddingBottom: '4px' }}
            />
          </LocalizationProvider>
        </InputContainer>
      )}

      {paramState.type === 'mo_link' && (
        <InputContainer
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}
        >
          <Text>{translate('Please enter the default value for link to object')}:</Text>
          <Select
            placeholder={translate('select object')}
            sx={{ padding: '8px 40px 8px 0px' }}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value.toString())}
            error={inputError !== ' '}
          >
            {objects?.apiResponse?.map((object) => (
              <MenuItem key={object.id} value={object.id}>
                {object.name}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>
      )}
      {paramState.type === 'enum' && (
        <InputContainer
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}
        >
          <Text>{translate('Please enter the default enum value')}:</Text>
          <Select
            placeholder="select value"
            sx={{ padding: '8px 40px 8px 0px' }}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value.toString())}
            error={inputError !== ' '}
          >
            {paramState?.enumConstraint?.map((val: string) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>
      )}
      {paramState.type === 'user_link' && (
        <InputContainer
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}
        >
          <Text>{translate('Please enter the default link to user value')}:</Text>
          <Select
            placeholder="select user"
            sx={{ padding: '8px 40px 8px 0px' }}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value.toString())}
            error={inputError !== ' '}
          >
            {userNamesList.map((val: string) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </InputContainer>
      )}
    </Modal>
  );
};

export default RequaredParamTypeModal;
