import { MenuList, ListItemIcon, Typography } from '@mui/material';

import { CollapsibleCard, Icons, useTranslate } from '6_shared';
import { EtaMenuItem } from './EtaMenuItem';

export const ExtractCard = () => {
  const translate = useTranslate();

  return (
    <CollapsibleCard
      ContentSx={{ px: 0 }}
      title={translate('Extract')}
      defaultExpanded
      testId="DataFlow-extract__collapse-btn"
    >
      <MenuList disablePadding>
        <EtaMenuItem dragItem={{ type: 'extract' }} data-testid="DataFlow-rules__source-item">
          <ListItemIcon>
            <Icons.DataIcon fontSize="small" variant="bubble" color="jungleGreen" />
          </ListItemIcon>
          <Typography>{translate('Source')}</Typography>
        </EtaMenuItem>
        {/* <EtaMenuItem dragItem={{ type: 'consume' }}>
          <ListItemIcon>
            <Icons.CubeTreeIcon fontSize="small" variant="bubble" color="dodgerBlue" />
          </ListItemIcon>
          <Typography>{translate('Consume')}</Typography>
        </EtaMenuItem> */}
      </MenuList>
    </CollapsibleCard>
  );
};
