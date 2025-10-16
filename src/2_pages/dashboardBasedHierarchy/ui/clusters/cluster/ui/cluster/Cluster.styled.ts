import styled from '@emotion/styled';
import { Card } from '@mui/material';

export const ClusterStyled = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: center;
  flex: 1;
  /* min-width: 200px; */
  max-width: 500px;
  height: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  border-radius: 20px;
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowVariant1};
  user-select: none;
  cursor: inherit;
  flex-shrink: 0;
  opacity: 1;
  transition: 0.3s;
  aspect-ratio: '1/0.9';
  animation: animation_emergence 0.5s forwards;

  @keyframes animation_emergence {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  &:hover {
    box-shadow: 0 4px 40px 3px rgb(0 0 0 / 20%);
  }
`;
