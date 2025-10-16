import { Box, Typography } from '@mui/material';
import { INewObjectParams } from '5_entites';
import { useTimezoneAdjustment } from '6_shared';
import { transformValue } from '../../lib';
import { AttributeValue } from './Attributes.styled';

interface DefaultAttributeProps {
  param: INewObjectParams['params'][number];
}

export const DefaultAttribute = ({ param }: DefaultAttributeProps) => {
  const { disableTimezoneAdjustment } = useTimezoneAdjustment();

  return (
    <Box component="div">
      <Typography>{param.name}</Typography>
      <AttributeValue expanded={param.expanded}>
        {transformValue({
          value: param.value,
          valType: param.val_type,
          disableTimezoneAdjustment,
        })}
      </AttributeValue>
    </Box>
  );
};
