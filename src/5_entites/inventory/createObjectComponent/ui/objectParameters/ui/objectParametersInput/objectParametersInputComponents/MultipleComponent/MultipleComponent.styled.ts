import styled from '@emotion/styled';
import { IconButton, Box, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

export const MultipleComponentStyled = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

export const Label = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.primary};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 40%;
`;

export const Field = styled(Typography)`
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: calc(100% - 35px);
`;

export const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  background-color: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant2};
  padding: 2px 0 2px 10px;
  border-radius: 10px;
  width: 60%;
  height: 24px;
  font-size: 12px;
  overflow: hidden;

  &:hover > button {
    opacity: 1;
  }
`;

export const IconButtonStyled = styled(IconButton)`
  width: 1.375rem;
  height: 1.375rem;
  opacity: 0;
  transition: all 250ms linear;

  &:hover {
    background-color: ${({ theme }) => theme.palette.background.default};
  }
`;

export const EditIcon = styled(Edit)`
  width: 0.9375rem;
  height: 0.9375rem;
`;

export const ErrorMessage = styled(Typography)`
  position: absolute;
  bottom: -4px;
  left: 0;
  font-weight: 400;
  font-size: 0.5rem;
`;
