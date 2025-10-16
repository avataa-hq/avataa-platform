import styled from '@emotion/styled';
import { Box } from '@mui/material';
import isPropValid from '@emotion/is-prop-valid';

export const ImageCardContainer = styled(Box, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'index',
})<{ index: number }>`
  box-sizing: border-box;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  border-radius: 1.25rem;
  /* background: ${(props) => props.theme.palette.neutral.surfaceContainer}; */
  opacity: 40%;
  transition: 0.3s;
  user-select: none;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);

  cursor: pointer;
  opacity: 100%;

  &:hover {
    transform: scale(103%);
    background: ${({ theme }) => theme.palette.action.hover};
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(96%);
  }
`;

export const CardImage = styled('img')`
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
  display: block;
  margin: 0 auto;
`;
