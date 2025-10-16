import { ReactNode } from 'react';
import { ContentContainerStyled, Header, Footer, Body } from './ContentContainer.styled';

interface IProps {
  headerSlot?: ReactNode;
  headerPercentHeight?: number;
  bodySlot?: ReactNode;
  bodyPercentHeight?: number;
  footerSlot?: ReactNode;
  footerPercentHeight?: number;
}

export const ContentContainer = ({
  headerSlot,
  headerPercentHeight,
  bodySlot,
  bodyPercentHeight,
  footerSlot,
  footerPercentHeight,
}: IProps) => {
  return (
    <ContentContainerStyled>
      {headerSlot && (
        <Header sx={{ maxHeight: headerPercentHeight ? `${headerPercentHeight}%` : '10%' }}>
          {headerSlot}
        </Header>
      )}
      {bodySlot && (
        <Body sx={{ maxHeight: bodyPercentHeight ? `${bodyPercentHeight}%` : '80%' }}>
          {bodySlot}
        </Body>
      )}
      {footerSlot && (
        <Footer sx={{ maxHeight: footerPercentHeight ? `${footerPercentHeight}%` : '10%' }}>
          {footerSlot}
        </Footer>
      )}
    </ContentContainerStyled>
  );
};
