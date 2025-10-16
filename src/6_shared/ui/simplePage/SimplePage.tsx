import { PropsWithChildren } from 'react';
import { Typography } from '@mui/material';
import { BodyStyled, HeaderStyled, PageContainerStyled, FooterStyled } from './SimplePage.styled';

type SimplePageProps = {
  title?: string;
  actions?: React.ReactNode;
};

export const SimplePage = ({ title, actions, children }: PropsWithChildren<SimplePageProps>) => {
  return (
    <PageContainerStyled>
      <HeaderStyled>
        <Typography variant="h5">{title}</Typography>
      </HeaderStyled>
      <BodyStyled>{children}</BodyStyled>
      <FooterStyled>{actions}</FooterStyled>
    </PageContainerStyled>
  );
};
