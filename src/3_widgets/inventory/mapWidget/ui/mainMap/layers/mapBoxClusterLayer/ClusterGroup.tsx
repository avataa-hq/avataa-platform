import styled from '@emotion/styled';
import { Box, Typography, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import { memo } from 'react';

const fadeInFilter = () => keyframes`
  0% { transform: scale(0); opacity: 0;  }
  40% { transform: scale(120%); opacity: 0.8;  }
  80% { transform: scale(95%);  }
  100% { transform: scale(100%); opacity: 0.8;}
`;

const ClusterGroupStyled = styled(Box)`
  transform: scale(100%);
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  background: ${({ theme }) => alpha(theme.palette.primary.main, 1)};
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 2px 5px 10px 4px rgba(0, 0, 0, 0.44);
  animation: 0.6s ease forwards ${fadeInFilter()};
  transition: all 0.3s;

  &:hover {
    opacity: 1;
    scale: 102%;
  }
`;

interface IProps {
  count: number;
  onGroupClick?: (coordinates?: [number, number]) => void;
  onGroupContextmenu?: () => void;

  width?: number;
  height?: number;
  zIndex?: string;
}

export const ClusterGroup = memo(
  ({ count, onGroupClick, width, height, onGroupContextmenu, zIndex }: IProps) => {
    return (
      <ClusterGroupStyled
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onGroupContextmenu?.();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onGroupClick?.();
        }}
        sx={{
          width: width ? `${width}px` : '80px',
          height: height ? `${height}px` : '80px',
          zIndex,
        }}
        data-testid="Map__cluster-group"
      >
        <Typography variant="h1" sx={{ color: 'white' }}>
          {count}
        </Typography>
      </ClusterGroupStyled>
    );
  },
);
