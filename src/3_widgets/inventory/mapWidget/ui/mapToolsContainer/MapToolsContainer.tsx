import { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, SxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

const MapToolsContainerStyled = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
`;

interface IProps extends PropsWithChildren {
  sx?: SxProps<Theme>;
}

export const MapToolsContainer = ({ sx, children }: IProps) => {
  return <MapToolsContainerStyled sx={sx}>{children}</MapToolsContainerStyled>;
};
