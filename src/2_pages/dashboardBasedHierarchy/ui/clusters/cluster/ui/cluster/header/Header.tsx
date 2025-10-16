import { ClusterModel, useResize } from '6_shared';
import { useRef } from 'react';
import { Title, HeaderStyled } from './Header.styled';

export const Header = ({ name }: { name: ClusterModel['name'] }) => {
  const childRef = useRef<HTMLDivElement | null>(null);
  const { getFontSize } = useResize({ childRef });

  return (
    <HeaderStyled ref={childRef}>
      <Title fontSize={getFontSize(50)} variant="h3">
        {name}
      </Title>
    </HeaderStyled>
  );
};
