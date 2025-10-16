import { useSettingsObject, useTranslate } from '6_shared';
import { Box, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  HorizontalContainer,
  InputContainer,
  ListMark,
  Text,
  Icon,
  TextWithColor,
} from '../../ObjectAndParamTypeModal.styled';
import { ListOfValues } from '../../model/types';

interface IProps {
  listOfInputValues: ListOfValues[];
  onDeleteValueInList: (id: number) => void;
  onChangeValueOfList: (newValue: string, item: ListOfValues) => void;
}

export const ReqAndMulStrIntFloat = ({
  listOfInputValues,
  onDeleteValueInList,
  onChangeValueOfList,
}: IProps) => {
  const translate = useTranslate();

  const { paramState } = useSettingsObject();

  return (
    <InputContainer>
      <Box component="div" mb="15px">
        <Text mb="15px">
          {translate(
            `You specified this parameter type as multiple and required. Please enter the default list of`,
          )}{' '}
        </Text>
        {paramState.type === 'str' && <TextWithColor>{translate('string')}</TextWithColor>}
        {paramState.type === 'int' && <TextWithColor>{translate('integer')}</TextWithColor>}
        {paramState.type === 'float' && <TextWithColor>{translate('float')}</TextWithColor>}
        <Text mb="15px"> {translate('values')}:</Text>
      </Box>

      {listOfInputValues.map((item) => (
        <HorizontalContainer key={item.id}>
          <ListMark>{item.id}.</ListMark>
          <TextField
            value={item.value}
            onChange={(event) => onChangeValueOfList(event.target.value, item)}
            size="small"
            autoFocus
            autoComplete="off"
            type={paramState.type === 'int' || paramState.type === 'float' ? 'number' : 'text'}
            error={item.isError}
            helperText={item.errorMessage}
            sx={{
              width: item.id === 1 ? '340px' : '300px',
              paddingRight: item.id === 1 ? '44px' : '0',
            }}
          />
          {item.id !== 1 && (
            <Icon onClick={() => onDeleteValueInList(item.id)}>
              <DeleteIcon />
            </Icon>
          )}
        </HorizontalContainer>
      ))}
    </InputContainer>
  );
};
