import { Tooltip, Typography } from '@mui/material';
import { ErrorData, ErrorPage, useTabs, useTranslate } from '6_shared';
import {
  InformationStyled,
  Header,
  Body,
  Row,
  Item,
  ItemText,
  BandsText,
} from './Information.styled';
import { useInformationData } from '../../lib/information/useInformationData';
import { InformationSkeleton } from './InformationSkeleton';

interface IProps {
  siteInformationData?: Record<string, any>;
  exclusion?: string[];
  isLoading?: boolean;
  error?: ErrorData;
}

export const Information = ({ siteInformationData, exclusion, isLoading, error }: IProps) => {
  const translate = useTranslate();
  const { selectedTab } = useTabs();

  const { infoData } = useInformationData({
    siteInformationData,
    exclusion,
  });

  return (
    <InformationStyled>
      <Header>
        <Typography variant="h1">{translate('Information')}</Typography>
      </Header>
      <Body>
        {isLoading && <InformationSkeleton />}
        {!isLoading && (error || !siteInformationData) && (
          <ErrorPage error={{ message: 'Not found information', code: '404' }} />
        )}
        {!isLoading &&
          !error &&
          infoData.map((item: any, idx: number) => {
            return (
              <Row key={idx}>
                <Item width={selectedTab === 'smartFixed' ? '40%' : '48%'}>
                  <Tooltip title={item.title} placement="bottom-start">
                    <ItemText
                      fontWeight="400"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </ItemText>
                  </Tooltip>
                </Item>
                <Item width={selectedTab === 'smartFixed' ? '60%' : '48%'}>
                  {Array.isArray(item.value) ? (
                    item.value.map((band: number, index: number) => (
                      <BandsText key={index}>{band}</BandsText>
                    ))
                  ) : (
                    <Tooltip title={item.value} placement="bottom-start">
                      <ItemText
                        fontWeight="bold"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.value}
                      </ItemText>
                    </Tooltip>
                  )}
                </Item>
              </Row>
            );
          })}
      </Body>
    </InformationStyled>
  );
};
