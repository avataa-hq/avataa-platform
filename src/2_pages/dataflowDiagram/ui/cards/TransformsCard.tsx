import { MenuList, ListItemIcon, Typography } from '@mui/material';
import {
  FilterAltRounded,
  JoinFullRounded,
  // ViewModuleRounded,
  LensBlurRounded,
} from '@mui/icons-material';
import { CollapsibleCard, useTranslate, Icons } from '6_shared';
import { EtaMenuItem } from './EtaMenuItem';

export const TransformsCard = () => {
  const translate = useTranslate();

  // const { setIsDmnModalOpen } = useDataflowDiagramPage();

  return (
    <CollapsibleCard
      ContentSx={{ px: 0 }}
      title={translate('Transforms')}
      defaultExpanded
      testId="DataFlow-transforms__collapse-btn"
    >
      <MenuList disablePadding>
        <EtaMenuItem dragItem={{ type: 'filter' }} data-testid="DataFlow-rules__filter-item">
          <ListItemIcon>
            {/* @ts-ignore */}
            <FilterAltRounded fontSize="small" variant="bubble" color="saffronYellow" />
          </ListItemIcon>
          <Typography noWrap>{translate('Filter')}</Typography>
        </EtaMenuItem>
        <EtaMenuItem dragItem={{ type: 'split' }} data-testid="DataFlow-rules__split-item">
          <ListItemIcon>
            <Icons.SplitIcon fontSize="small" variant="bubble" color="brightGreen" />
          </ListItemIcon>
          <Typography noWrap>{translate('Split')}</Typography>
        </EtaMenuItem>
        <EtaMenuItem dragItem={{ type: 'variable' }} data-testid="DataFlow-rules__variable-item">
          <ListItemIcon>
            <Icons.VariableIcon fontSize="small" variant="bubble" color="lightDodgerBlue" />
          </ListItemIcon>
          <Typography noWrap>{translate('Variable')}</Typography>
        </EtaMenuItem>
        {/* <EtaMenuItem onClick={() => setIsDmnModalOpen(true)} dragItem={{ type: 'dmn' }}>
          <ListItemIcon>
            <ViewModuleRounded fontSize="small" variant="bubble" color="amaranthRed" />
          </ListItemIcon>
          <Typography noWrap>{translate('DMN (decision making table)')}</Typography>
        </EtaMenuItem> */}
        <EtaMenuItem dragItem={{ type: 'join' }} data-testid="DataFlow-rules__join-item">
          <ListItemIcon>
            {/* @ts-ignore */}
            <JoinFullRounded fontSize="small" variant="bubble" color="royalBlue" />
          </ListItemIcon>
          <Typography noWrap>{translate('Join')}</Typography>
        </EtaMenuItem>
        <EtaMenuItem dragItem={{ type: 'aggregate' }} data-testid="DataFlow-rules__aggregate-item">
          <ListItemIcon>
            {/* @ts-ignore */}
            <LensBlurRounded fontSize="small" variant="bubble" color="blue" />
          </ListItemIcon>
          <Typography noWrap>{translate('Aggregate')}</Typography>
        </EtaMenuItem>
      </MenuList>
    </CollapsibleCard>
  );
};
