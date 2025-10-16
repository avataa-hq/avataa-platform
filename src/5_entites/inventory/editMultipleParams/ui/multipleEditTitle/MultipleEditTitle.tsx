import { Box, Typography } from '@mui/material';
import { useTranslate } from '6_shared';

interface IProps {
  objectsCount: number;
}

export const MultipleEditTitle = ({ objectsCount }: IProps) => {
  const translate = useTranslate();

  return (
    <Box component="div" display="flex" alignItems="center" gap={0.5}>
      <Typography>{translate('Bulk edit')}</Typography>
      <Typography sx={{ opacity: 0.5 }}>({objectsCount} objects)</Typography>
    </Box>
  );
};
