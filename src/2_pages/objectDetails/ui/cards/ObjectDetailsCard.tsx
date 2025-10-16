import { PropsWithChildren } from 'react';
import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';

import { LoadingAvataa, LoadingIndicatorContainer } from '6_shared';

import { ObjectDetailsCardContainer } from '../ObjectDetailsPage.styled';

interface ObjectDetailsCardProps {
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}

export const ObjectDetailsCard = ({
  children,
  isLoading,
  sx,
}: PropsWithChildren<ObjectDetailsCardProps>) => {
  return (
    <ObjectDetailsCardContainer sx={sx}>
      {isLoading ? (
        <LoadingIndicatorContainer>
          <LoadingAvataa />
        </LoadingIndicatorContainer>
      ) : (
        children
      )}
    </ObjectDetailsCardContainer>
  );
};
