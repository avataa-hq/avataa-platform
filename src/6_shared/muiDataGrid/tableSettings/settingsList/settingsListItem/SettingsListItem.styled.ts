import styled from '@emotion/styled';
import { alpha, Box, BoxProps } from '@mui/material';

interface ISettingListItemProps extends BoxProps {
  selected?: boolean;
}
export const SettingListItemStyled = styled(Box)<ISettingListItemProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  background: ${({ theme, selected }) =>
    selected === true ? alpha(theme.palette.primary.main, 0.3) : 'transparent'};
  box-shadow: ${({ selected }) =>
    selected === true
      ? '0 10px 15px -8px rgba(0, 0, 0, 0.5)'
      : '-5px 4px 7px -8px rgba(0, 0, 0, 0.5)'};

  transition: all 0.3s;

  &:hover {
    box-shadow: 0 10px 15px -8px rgba(0, 0, 0, 0.5);
  }
`;

export const NameBlock = styled(Box)`
  height: 100%;
  width: 40%;
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const DefaultBlock = styled(Box)`
  height: 100%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const PublicBlock = styled(Box)`
  height: 100%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const DeleteBlock = styled(Box)`
  height: 100%;
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
