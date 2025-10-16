import { useTranslate } from '6_shared';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  HorizontalContainer,
  InputContainer,
  ListMark,
  Text,
  Icon,
  TextWithColor,
  DatePick,
} from '../../ObjectAndParamTypeModal.styled';
import { ListOfValues } from '../../model/types';

interface IProps {
  listOfInputValues: ListOfValues[];
  onDeleteValueInList: (id: number) => void;
  onChangeValueOfList: (newValue: string, item: ListOfValues) => void;
}

export const ReqAndMulDate = ({
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
        <TextWithColor>{translate('date')}</TextWithColor>
        <Text mb="15px"> {translate('values')}:</Text>
      </Box>
      {listOfInputValues.map((item) => (
        <HorizontalContainer key={item.id} sx={{ paddingRight: item.id === 1 ? '44px' : '0' }}>
          <ListMark>{item.id}.</ListMark>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePick
              onChange={(newValue: any) => onChangeValueOfList(newValue?.$d.toString(), item)}
            />
          </LocalizationProvider>
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
