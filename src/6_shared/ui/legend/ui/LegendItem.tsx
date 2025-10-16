import { ReactNode, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  IconButton,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SettingsRounded } from '@mui/icons-material';
import { useColorsConfigure, useTabs } from '6_shared/models';
import { ILegendItem } from '../model/types';
import { LegendItemContainer } from './Legend.styled';

interface IProps<T extends ILegendItem = ILegendItem> {
  item: T;
  getItemIcon?: (item: T) => ReactNode;
  handleCheckboxClick?: (newTmoId: number | string) => void;
}

export const LegendItem = ({ item, getItemIcon, handleCheckboxClick }: IProps) => {
  const [isExpanded, setIsExpanded] = useState(item.props?.defaultExpanded ?? false);
  const hasChildren = item.children?.length;

  const { toggleIsOpenColorSelecting, setCurrentTmoId, setCurrentTmoType } = useColorsConfigure();
  const { selectedTab } = useTabs();

  const openColorSelecting = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    setCurrentTmoId({ module: selectedTab, tmoId: +item.id });
    setCurrentTmoType({ module: selectedTab, tmoType: item.geometry_type ?? '' });
    toggleIsOpenColorSelecting({ module: selectedTab });
  };

  return (
    <LegendItemContainer>
      <Accordion
        expanded={hasChildren ? isExpanded : false}
        elevation={0}
        onChange={(_: any, expanded: any) => hasChildren && setIsExpanded(expanded)}
        disableGutters
        {...(item.props ?? {})}
      >
        <AccordionSummary
          expandIcon={hasChildren ? <ExpandMoreIcon /> : undefined}
          sx={{
            display: 'flex',
            '.MuiAccordionSummary-content': {
              cursor: hasChildren ? 'pointer' : 'default',
              // justifyContent: 'space-between',
            },
          }}
        >
          {!['Nodes', 'Links'].includes(item.name) && (
            <Box component="div">
              <Checkbox
                checked={item.visible ?? true}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckboxClick?.(item.id as number);
                }}
              />
            </Box>
          )}
          <Box
            component="div"
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}
          >
            {item.icon ?? getItemIcon?.(item)}
            <Typography sx={{ overflowWrap: 'anywhere' }}>{item.name}</Typography>
          </Box>
          {typeof item.id === 'number' && (
            <IconButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => openColorSelecting(e)}
              sx={{ ml: 'auto' }}
            >
              <SettingsRounded />
            </IconButton>
          )}
        </AccordionSummary>
        <AccordionDetails>
          {item.children?.map((childItem) => (
            <LegendItem
              key={childItem.id}
              item={childItem}
              getItemIcon={getItemIcon}
              handleCheckboxClick={handleCheckboxClick}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </LegendItemContainer>
  );
};
