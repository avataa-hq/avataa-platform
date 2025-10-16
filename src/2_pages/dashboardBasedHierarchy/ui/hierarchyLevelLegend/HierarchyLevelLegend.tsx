import { Typography, Accordion, AccordionDetails, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import LabelIcon from '@mui/icons-material/Label';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import { useState } from 'react';
import { IHierarchyLevelLegendData } from '6_shared';
import {
  Header,
  HierarchyLevelLegendStyled,
  LegendChildItem,
  LegendItem,
} from './HierarchyLevelLegend.styled';

interface IProps {
  data?: IHierarchyLevelLegendData[];
  onSettingsClick?: (data: IHierarchyLevelLegendData) => void;
}

export const HierarchyLevelLegend = ({ data, onSettingsClick }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <HierarchyLevelLegendStyled>
        <Tooltip title="Legend">
          <IconButton onClick={() => setIsOpen(true)}>
            <LegendToggleIcon />
          </IconButton>
        </Tooltip>
      </HierarchyLevelLegendStyled>
    );
  }
  if (isOpen && (!data || !data.length)) {
    return (
      <HierarchyLevelLegendStyled sx={{ opacity: 0.7 }}>
        <Header>
          <Typography>No legend data...</Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <RemoveIcon />
          </IconButton>
        </Header>
      </HierarchyLevelLegendStyled>
    );
  }

  return (
    <HierarchyLevelLegendStyled>
      <Header>
        <Typography>Legend by levels</Typography>
        <IconButton onClick={() => setIsOpen(false)}>
          <RemoveIcon />
        </IconButton>
      </Header>
      {data?.map((d, idx) => (
        <Accordion defaultExpanded key={String(idx)} sx={{ '&.Mui-expanded': { m: 0 } }}>
          <LegendItem expandIcon={d.children?.length ? <ExpandMoreIcon /> : undefined}>
            <Typography>{d.name}</Typography>
            <IconButton
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onSettingsClick?.(d);
              }}
            >
              <SettingsIcon />
            </IconButton>
          </LegendItem>
          <AccordionDetails sx={{ padding: 0, pl: '10%' }}>
            {d.children?.map((p, i) => (
              <LegendChildItem key={String(i)}>
                <LabelIcon fontSize="medium" sx={{ fill: p.color }} />
                <Typography>{p.description}</Typography>
              </LegendChildItem>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </HierarchyLevelLegendStyled>
  );
};
