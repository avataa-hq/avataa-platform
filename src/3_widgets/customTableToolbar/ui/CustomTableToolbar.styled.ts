import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

export const Container = styled(Box)`
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header = styled(Typography)`
  font-size: 24px;
  font-weight: 600;
`;

export const CustomToolbarButton = styled(Button)`
  width: 40px;
  height: 40px;
  min-height: 0;
  min-width: 0;
  border-radius: 0.8rem;
  padding: 0;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  background-color: ${(props) => props.theme.palette.background.default};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

interface IndicatorProps {
  display: 'block' | 'none';
}

export const IsActiveIndicator = styled(Box)<IndicatorProps>`
  background: ${(props) => props.theme.palette.primary.main};
  opacity: 0.6;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -5px;
  display: ${(props) => props.display};
  box-shadow: 0 0 5px ${(props) => props.theme.palette.primary.main};
`;
