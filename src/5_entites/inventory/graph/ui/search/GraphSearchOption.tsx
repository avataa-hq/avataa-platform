import { Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { GraphSearchOptionContainer } from './GraphSearch.styled';

interface GraphSearchOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  title: string;
  subtitle: string;
}

export const GraphSearchOption = ({ props, subtitle, title }: GraphSearchOptionProps) => {
  const { key, ...otherProps } = props as unknown as any;
  return (
    <GraphSearchOptionContainer key={key} {...otherProps}>
      <Typography sx={{ display: 'block' }}>{title}</Typography>
      <Typography sx={{ display: 'block', color: (theme) => theme.palette.text.disabled }}>
        {subtitle}
      </Typography>
    </GraphSearchOptionContainer>
  );
};
