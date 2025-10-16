import { useState } from 'react';
import { Box, CardContent, CardHeader } from '@mui/material';

import { History } from '5_entites';
import { SearchInput, useTranslate } from '6_shared';

import { ObjectDetailsCard } from './ObjectDetailsCard';
import { IconButtonStyled } from '../commonComponents';

interface HistoryCardProps {
  objectId: number;
  onLinkClick?: () => void;
  disableTimezoneAdjustment?: string;
}

export const HistoryCard = ({
  objectId,
  onLinkClick,
  disableTimezoneAdjustment,
}: HistoryCardProps) => {
  const translate = useTranslate();

  const [searchValue, setSearchValue] = useState<string>();

  return (
    <ObjectDetailsCard sx={{ width: '100%', height: '100%' }}>
      <CardHeader
        action={
          <Box component="div" display="flex">
            <SearchInput onChange={(_, searchVal) => setSearchValue(searchVal)} expandable />
            {/* <IconButtonStyled onClick={onLinkClick} /> */}
          </Box>
        }
        title={translate('History')}
      />
      <CardContent sx={{ height: '100%' }}>
        <History
          objectId={objectId}
          newDrawerWidth={320}
          searchValue={searchValue}
          disableTimezoneAdjustment={disableTimezoneAdjustment}
        />
      </CardContent>
    </ObjectDetailsCard>
  );
};
