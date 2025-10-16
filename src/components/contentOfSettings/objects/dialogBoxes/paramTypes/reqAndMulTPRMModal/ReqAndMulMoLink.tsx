import { useEffect, useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { IInventoryObjectModel, useTranslate } from '6_shared';
import { InputContainer, Text, TextWithColor } from '../../ObjectAndParamTypeModal.styled';
import { ListOfValues } from '../../model/types';

interface IProps {
  listOfMOLinkSelectedObjects: string[];
  listOfInputValues: ListOfValues[];
  setListOfInputValues: React.Dispatch<React.SetStateAction<ListOfValues[]>>;
  setListOfMOLinkSelectedObjects: React.Dispatch<React.SetStateAction<string[]>>;
  objects:
    | {
        apiResponse: IInventoryObjectModel[];
        resultLength: number;
      }
    | undefined;
}

export const ReqAndMulMoLink = ({
  listOfMOLinkSelectedObjects,
  setListOfMOLinkSelectedObjects,
  listOfInputValues,
  setListOfInputValues,
  objects,
}: IProps) => {
  const translate = useTranslate();
  const [listOfMOLinkObjects, setListOfMOLinkObjects] = useState<string[]>([]);

  useEffect(() => {
    if (!objects) return;

    const listOfObjectsNames = objects.apiResponse.map((obj) => obj.name);
    setListOfMOLinkObjects(listOfObjectsNames);
  }, [objects]);

  return (
    <InputContainer>
      <Box component="div" mb="15px">
        <Text mb="15px">
          {translate(
            `You specified this parameter type as multiple and required. Please enter the default list of`,
          )}{' '}
        </Text>
        <TextWithColor>{translate('link to object')}</TextWithColor>
        <Text mb="15px"> {translate('values')}:</Text>
      </Box>
      <Autocomplete
        multiple
        disablePortal
        disableCloseOnSelect
        filterSelectedOptions
        options={listOfMOLinkObjects}
        value={listOfMOLinkSelectedObjects}
        onChange={(event, newValue) => {
          setListOfMOLinkSelectedObjects([...newValue]);
          setListOfInputValues([{ id: 1, value: '', isError: false, errorMessage: ' ' }]);
        }}
        renderInput={(params) => (
          <TextField
            helperText={listOfInputValues[0].errorMessage}
            error={listOfInputValues[0].isError}
            variant="outlined"
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: params.InputProps.endAdornment,
            }}
          />
        )}
      />
    </InputContainer>
  );
};
