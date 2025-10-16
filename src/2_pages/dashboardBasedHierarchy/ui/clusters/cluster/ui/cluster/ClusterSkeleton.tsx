import { memo } from 'react';
import { Box } from '6_shared';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { ClusterStyled } from './Cluster.styled';

const CircleSkeleton = styled(Skeleton)`
  aspect-ratio: 1/1;
  width: 25%;
  height: 100%;
`;

interface IProps {
  size?: 'small' | 'medium';
}

const renderSkeletonItems = (count: number) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <Skeleton key={index} width="100%" height="30%" />
    ))}
  </>
);

export const ClusterSkeleton = memo(({ size = 'medium' }: IProps) => {
  return (
    <ClusterStyled sx={{ aspectRatio: size === 'small' ? '1/0.9' : '2/2', maxWidth: 353 }}>
      <Skeleton width="50%" height="10%" />
      <Box width="100%" height="25%" display="flex" justifyContent="space-around">
        <CircleSkeleton variant="circular" />
        <CircleSkeleton variant="circular" />
        <CircleSkeleton variant="circular" />
      </Box>
      <Box width="100%" height="50%" display="flex" flexDirection="column" alignItems="center">
        {renderSkeletonItems(3)}
      </Box>
      {size === 'medium' && (
        <Box width="100%" height="15%" display="flex" justifyContent="center">
          <Skeleton width="100%" height="100%" />
        </Box>
      )}
    </ClusterStyled>
  );
});
