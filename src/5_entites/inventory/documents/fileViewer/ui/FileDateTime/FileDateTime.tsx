import { formatDate } from '5_entites';
import { Typography } from '@mui/material';
import * as SC from './FileDateTime.styled';

interface IProps {
  creationDate: string;
}

export const FileDateTime = ({ creationDate }: IProps) => {
  return (
    <SC.FileDateTimeStyled>
      <Typography sx={{ fontWeight: 400 }}>
        {formatDate(creationDate, 'dd.MM.yyyy HH:mm:ss')?.split(' ')[0]}
      </Typography>
      <Typography sx={{ fontWeight: 400, opacity: '0.5' }}>
        {formatDate(creationDate, 'dd.MM.yyyy HH:mm:ss')?.split(' ')[1]}
      </Typography>
    </SC.FileDateTimeStyled>
  );
};
