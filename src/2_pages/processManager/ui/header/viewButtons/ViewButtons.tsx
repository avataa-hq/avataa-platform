import ReorderIcon from '@mui/icons-material/Reorder';
import AppsIcon from '@mui/icons-material/Apps';
import { ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { ReactNode } from 'react';
import { ProcessManagerPageMode } from '6_shared';

const toggleModeButtons: { value: ProcessManagerPageMode; icon: ReactNode }[] = [
  { value: 'list', icon: <ReorderIcon /> },
  { value: 'tasks', icon: <RecentActorsIcon /> },
  { value: 'grid', icon: <AppsIcon /> },
];

interface IProps {
  handlePageModeChange?: (newMode: ProcessManagerPageMode) => void;
  isActiveKanban?: boolean;
  pageMode?: ProcessManagerPageMode;
}

export const ViewButtons = ({ handlePageModeChange, isActiveKanban, pageMode }: IProps) => {
  const theme = useTheme();

  return (
    <ToggleButtonGroup
      value={pageMode}
      exclusive
      aria-label="Page mode"
      sx={{
        height: '40px',
        borderRadius: '10px',
        '& :disabled': { opacity: 0.5 },
      }}
    >
      {toggleModeButtons.map(({ value, icon }) => (
        <ToggleButton
          key={value}
          value={value}
          sx={{
            width: '40px',
            borderRadius: '10px',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
            },
            '&:disabled': { backgroundColor: theme.palette.info.main },
          }}
          onClick={() => handlePageModeChange?.(value as ProcessManagerPageMode)}
        >
          {icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
