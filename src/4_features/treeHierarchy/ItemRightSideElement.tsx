import { PropsWithChildren } from 'react';
import { ItemRightSideStyled } from './Hierarchy.styled';

export const ItemRightSideElement = ({ children }: PropsWithChildren) => {
  return <ItemRightSideStyled>{children}</ItemRightSideStyled>;
};
