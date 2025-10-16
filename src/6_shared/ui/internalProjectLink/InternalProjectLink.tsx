import { ReactNode } from 'react';
import { InternalProjectLinkStyled } from './InternalProjectLink.styled';

interface IProps {
  children: ReactNode;
  onClick: (arg?: any) => any;
}

export const InternalProjectLink = ({ children, onClick }: IProps) => {
  return (
    <InternalProjectLinkStyled
      color="primary"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {children}
    </InternalProjectLinkStyled>
  );
};
