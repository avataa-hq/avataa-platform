import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

const LabelStyled = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.primary};
  width: 40%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const Label = ({ children }: PropsWithChildren) => {
  return <LabelStyled>{children}</LabelStyled>;
};
