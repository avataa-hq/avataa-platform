import { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { formatObjectName } from '5_entites/inventory/lib';
import { Box } from '6_shared';
import { AttributeValue } from '../Attributes.styled';

interface IProps {
  name: string;
  value: unknown;
  onClick?: (value: unknown) => void;
  isLink?: boolean;
}

export const SystemDataAttribute = ({ name, value, onClick, isLink }: IProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography>{name}</Typography>
      <AttributeValue isLink={isLink} onClick={() => (onClick ? onClick(value) : null)}>
        {(value as ReactNode) || (value != null && typeof value === 'string')
          ? formatObjectName(value as string)
          : '-'}
      </AttributeValue>
    </Box>
  );
};
