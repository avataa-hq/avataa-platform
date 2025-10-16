import { MenuList, ListItemIcon, Typography } from '@mui/material';
import { FileDownloadOutlined, Compare } from '@mui/icons-material';
import { CollapsibleCard, useTranslate, Icons, useDataflowDiagramPage } from '6_shared';
import { EtaMenuItem } from './EtaMenuItem';

export const ActionsCard = () => {
  const translate = useTranslate();

  const { setIsMapModalOpen } = useDataflowDiagramPage();

  return (
    <CollapsibleCard
      ContentSx={{ px: 0 }}
      title={translate('Actions')}
      defaultExpanded
      testId="DataFlow-actions__collapse-btn"
    >
      <MenuList disablePadding>
        <EtaMenuItem dragItem={{ type: 'load' }} data-testid="DataFlow-rules__load-item">
          <ListItemIcon>
            {/* @ts-ignore */}
            <FileDownloadOutlined fontSize="small" variant="bubble" color="denimBlue" />
          </ListItemIcon>
          <Typography>{translate('Load')}</Typography>
        </EtaMenuItem>
        <EtaMenuItem dragItem={{ type: 'group' }} data-testid="DataFlow-rules__group-item">
          <ListItemIcon>
            <Icons.ObjectGroupIcon fontSize="small" variant="bubble" color="crustaOrange" />
          </ListItemIcon>
          <Typography noWrap>{translate('Group')}</Typography>
        </EtaMenuItem>
        <EtaMenuItem
          dragItem={{ type: 'map' }}
          onClick={() => setIsMapModalOpen(true)}
          data-testid="DataFlow-rules__map-item"
        >
          <ListItemIcon>
            {/* @ts-ignore */}
            <Compare fontSize="small" variant="bubble" color="malachiteGreen" />
          </ListItemIcon>
          <Typography>{translate('Map')}</Typography>
        </EtaMenuItem>
        {/* <EtaMenuItem
          dragItem={{ type: 'create' }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <ListItemIcon>
            <Add fontSize="small" variant="bubble" color="malachiteGreen" />
          </ListItemIcon>
          <Typography>{translate('Create')}</Typography>
        </EtaMenuItem> */}
        {/* <EtaMenuItem
          dragItem={{ type: 'publish' }}
          onClick={() => dispatch(setIsPublishModalOpen(true))}
        >
          <ListItemIcon>
            <Groups fontSize="small" variant="bubble" color="flirtPurple" />
          </ListItemIcon>
          <Typography>{translate('Publish')}</Typography>
        </EtaMenuItem> */}
        {/* <EtaMenuItem
          dragItem={{ type: 'trigger' }}
          onClick={() => dispatch(setIsTriggerModalOpen(true))}
        >
          <ListItemIcon>
            <Icons.TextSelectJumpIcon fontSize="small" variant="bubble" color="javaBlue" />
          </ListItemIcon>
          <Typography>{translate('Trigger')}</Typography>
        </EtaMenuItem> */}
        {/* <EtaMenuItem dragItem={{ type: 'dead-end' }}>
          <ListItemIcon>
            <Icons.LineEndIcon fontSize="small" variant="bubble" color="brilliantRose" />
          </ListItemIcon>
          <Typography>{translate('Dead-end')}</Typography>
        </EtaMenuItem> */}
      </MenuList>
    </CollapsibleCard>
  );
};
