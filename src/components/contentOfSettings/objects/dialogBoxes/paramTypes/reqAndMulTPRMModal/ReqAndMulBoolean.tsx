import { useTranslate } from '6_shared';
import { Box, MenuItem, Select } from '@mui/material';
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

export const ReqAndMulBoolean = ({
  listOfInputValues,
  onDeleteValueInList,
  onChangeValueOfList,
}: IProps) => {
  const translate = useTranslate();

  return (
    <InputContainer>
      <Box component="div" mb="15px">
        <Text mb="15px">
          {translate(
            `You specified this parameter type as multiple and required. Please enter the default list of`,
          )}{' '}
        </Text>
        <TextWithColor>{translate('boolean')}</TextWithColor>
        <Text mb="15px"> {translate('values')}:</Text>
      </Box>
      {listOfInputValues.map((item) => (
        <HorizontalContainer key={item.id} marginBottom="10px">
          <ListMark>{item.id}.</ListMark>
          <Select
            placeholder="select value"
            value={item.value}
            onChange={(event) => onChangeValueOfList(event.target.value, item)}
            sx={{ width: '255px' }}
          >
            <MenuItem value="true">TRUE</MenuItem>
            <MenuItem value="false">FALSE</MenuItem>
          </Select>
          <Box component="div" width="40px">
            {item.id !== 1 && (
              <Icon onClick={() => onDeleteValueInList(item.id)}>
                <DeleteIcon />
              </Icon>
            )}
          </Box>
        </HorizontalContainer>
      ))}
    </InputContainer>
  );
};
