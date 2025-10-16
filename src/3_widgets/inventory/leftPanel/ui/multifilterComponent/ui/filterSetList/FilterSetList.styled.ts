import styled from '@emotion/styled';
import { Box, css } from '@mui/material';

interface AddFilterButtonBlockProps {
  disabled?: boolean;
}

export const FilterSetListStyled = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const SettingsHeader = styled(Box)`
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
`;

export const AddFilterButtonBlock = styled(Box)<AddFilterButtonBlockProps>`
  opacity: 0.5;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  gap: 10px;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: -5px 4px 7px -8px rgba(0, 0, 0, 0.5);

  transition: all 0.3s;

  &:hover {
    box-shadow: ${({ disabled }) => !disabled && '0 10px 15px -8px rgba(0, 0, 0, 0.2)'};
    opacity: ${({ disabled }) => !disabled && '0.8'};
  }
  &:active {
    transform: ${({ disabled }) => !disabled && 'scale(98%)'};
    opacity: ${({ disabled }) => !disabled && '1'};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;
