import { useState } from 'react';
import { Box, CardContent, CardHeader } from '@mui/material';

import { SearchInput, useTranslate } from '6_shared';

import { ObjectDetailsCard } from '../ObjectDetailsCard';
import { ObjectComments } from './ObjectComments';
import { IconButtonStyled } from '../../commonComponents';

interface CommentsCardProps {
  objectId: number;
  onLinkClick?: () => void;
}

export const CommentsCard = ({ objectId, onLinkClick }: CommentsCardProps) => {
  const translate = useTranslate();
  const [searchValue, setSearchValue] = useState<string>();

  return (
    <ObjectDetailsCard>
      <CardHeader
        action={
          <Box component="div" display="flex">
            <SearchInput onChange={(_, searchVal) => setSearchValue(searchVal)} expandable />
            {/* <IconButtonStyled onClick={onLinkClick} /> */}
          </Box>
        }
        title={translate('Comments')}
      />
      <CardContent sx={{ paddingBottom: 0, overflow: 'hidden' }}>
        <ObjectComments objectId={objectId} searchString={searchValue} />
      </CardContent>
    </ObjectDetailsCard>
  );
};
