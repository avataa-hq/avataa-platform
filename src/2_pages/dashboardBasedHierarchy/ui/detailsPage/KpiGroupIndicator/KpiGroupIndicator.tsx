import { Fragment, memo } from 'react';
import { ArcProgress, ITopViewDashboardIndicatorData } from '6_shared';
import { ColorLineIndicator } from '3_widgets';
import { Divider, Typography } from '@mui/material';
import { GroupIndicatorChild, GroupIndicatorParent } from './KpiGroupIndicator.styled';
import { NoData } from './NoData';

interface IProps {
  data?: ITopViewDashboardIndicatorData[];
  isLoading?: boolean;

  onClick?: (objectTitle: string) => void;
}

export const KpiGroupIndicator = memo(({ data, isLoading, onClick }: IProps) => {
  if (!data || data.length <= 0) return <NoData />;

  return data?.map(({ nestedData, progressData, coloredLineData, title, imageUrl }, idx) => {
    return (
      <Fragment key={idx}>
        {title && (
          <div>
            <Typography color="primary" variant="h2">
              {title}
            </Typography>
            <Divider sx={{ width: '30%', my: 1 }} />
          </div>
        )}
        <GroupIndicatorParent key={idx}>
          <div style={{ width: '20%', height: isLoading ? '90px' : 'auto' }}>
            <ArcProgress
              {...progressData}
              simple
              type="circle"
              onClick={() => onClick?.(title)}
              imageUrl={imageUrl}
            />
          </div>
          <div style={{ width: '80%' }}>
            <ColorLineIndicator
              data={coloredLineData.data}
              title={coloredLineData.title}
              icon={progressData?.icon}
            />
          </div>
        </GroupIndicatorParent>
        {nestedData?.map((nestedItem, index) => {
          return (
            <GroupIndicatorChild key={index}>
              <div style={{ width: '15%', height: isLoading ? '70px' : 'auto' }}>
                <ArcProgress
                  simple
                  type="circle"
                  {...nestedItem.progressData}
                  isLoading={isLoading}
                />
              </div>
              <div style={{ width: '85%' }}>
                <ColorLineIndicator
                  data={nestedItem.coloredLineData.data}
                  title={nestedItem.coloredLineData.title}
                  icon={nestedItem.progressData?.icon}
                  isLoading={isLoading}
                />
              </div>
            </GroupIndicatorChild>
          );
        })}
      </Fragment>
    );
  });
});
