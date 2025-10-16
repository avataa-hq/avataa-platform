import styled from '@emotion/styled';
import { IconButton, IconButtonProps } from '@mui/material';

interface IProps extends IconButtonProps {
  selected?: boolean;
}

const ContentSwitchButtonStyled = styled(IconButton)<IProps>`
  & svg {
    transform: scale(100%);
    transition: all 0.3s;
    fill: ${({ theme, selected }) => (selected ? theme.palette.primary.main : 'currentColor')};

    &:hover {
      transform: scale(110%);
    }
    &:active {
      transform: scale(95%);
    }
  }
`;

export const ContentSwitchButton = ({ children, ...props }: IProps) => {
  return <ContentSwitchButtonStyled {...props}>{children}</ContentSwitchButtonStyled>;
};
