import React from 'react';
import {
  alpha,
  Box,
  Divider,
  IconButton,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  SearchInput,
  DAYS_DAY_WIDTH,
  GantScaleType,
  MONTH_DAY_WIDTH,
  QUARTER_DAY_WIDTH,
  WEEK_DAY_WIDTH,
} from '6_shared';
import { ChartToolsStyled } from './ChartTools.styled';

const togglePeriodButtons = [
  { label: 'Day', value: 'days', mode: 'Day' },
  { label: 'Week', value: 'weeks', mode: 'Week' },
  { label: 'Months', value: 'months', mode: 'Month' },
  { label: 'Quarter', value: 'quarters', mode: 'Quarter' },
];

const toggleZoomButtons = [
  { value: 'zoomIn', icon: 'ZoomInIcon' },
  { value: 'zoomOut', icon: 'ZoomOutIcon' },
];

const toggleArrowButtons = [
  { value: 'arrowLeft', icon: 'KeyboardArrowLeftIcon' },
  { value: 'arrowRight', icon: 'KeyboardArrowRightIcon' },
];

const customButtonSx = (theme: Theme) => ({
  borderRadius: '10px',
  border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  width: '40px',
  height: '40px',
});

interface IProps {
  currentScale: GantScaleType;
  setCurrentScale: (mode: GantScaleType) => void;
  onTodayClick: () => void;
  setDayScaleWidth: (dayWidth: number) => void;
  dayWidth: number;
  handleSearchChange: (newSearchQuery: string | undefined) => void;
}

export const ChartTools = ({
  currentScale,
  setCurrentScale,
  onTodayClick,
  setDayScaleWidth,
  dayWidth,
  handleSearchChange,
}: IProps) => {
  const theme = useTheme();
  const buttonSx = customButtonSx(theme);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newMode: GantScaleType | null) => {
    // @ts-ignore
    if (newMode === 'Today' || newMode === null) return;

    setCurrentScale(newMode);
    if (newMode === 'days') setDayScaleWidth(DAYS_DAY_WIDTH);
    if (newMode === 'weeks') setDayScaleWidth(WEEK_DAY_WIDTH);
    if (newMode === 'months') setDayScaleWidth(MONTH_DAY_WIDTH);
    if (newMode === 'quarters') setDayScaleWidth(QUARTER_DAY_WIDTH);

    setTimeout(() => {
      onTodayClick?.();
    }, 100);
  };

  const handleZoom = (value: 'zoomIn' | 'zoomOut') => {
    if (value === 'zoomOut' && dayWidth > 30) {
      setDayScaleWidth(dayWidth - 10);
    }
    if (value === 'zoomIn' && dayWidth < 110) {
      setDayScaleWidth(dayWidth + 10);
    }

    setTimeout(() => {
      onTodayClick?.();
    }, 100);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollAmount = 150;
    const timelineArea = document.getElementById('timeLineArea');

    if (timelineArea) {
      const newScrollLeft =
        direction === 'left'
          ? timelineArea.scrollLeft - scrollAmount
          : timelineArea.scrollLeft + scrollAmount;

      timelineArea.scrollTo({ left: newScrollLeft });
    }
  };

  return (
    <ChartToolsStyled>
      <Box
        component="div"
        sx={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
            borderRadius: '10px',
            height: '40px',
            '& .MuiInputBase-root': {
              padding: '5px',
            },
            '& input': {
              padding: '0',
            },
            '& svg': {
              fill: theme.palette.text.primary,
            },
          }}
        >
          <SearchInput expandable onChange={(_, searchVal) => handleSearchChange(searchVal)} />
        </Box>
        {/* <IconButton sx={buttonSx} onClick={() => {}}>
          <SearchIcon fontSize="small" sx={{ fill: theme.palette.text.primary }} />
        </IconButton> */}

        <IconButton sx={buttonSx} onClick={() => {}}>
          <FilterAltIcon fontSize="small" sx={{ fill: theme.palette.text.primary }} />
        </IconButton>
      </Box>

      <ToggleButtonGroup
        value={currentScale}
        exclusive
        onChange={handleChange}
        aria-label="View mode"
        sx={{
          borderRadius: '50px',
          overflow: 'hidden',
          boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
          height: '40px',
          gap: '5px',
          border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
          '& .MuiToggleButtonGroup-middleButton, & .MuiToggleButtonGroup-lastButton': {
            borderRadius: '50px',
          },
        }}
      >
        <ToggleButton
          value="Today"
          onClick={() => {
            onTodayClick();
          }}
          sx={{
            borderRadius: '50px',
            border: 'none',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              borderRadius: '50px',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
            },
            '&:hover': {
              borderRadius: '50px',
            },
          }}
        >
          Today
        </ToggleButton>
        {togglePeriodButtons.map((button) => (
          <ToggleButton
            key={button.value}
            value={button.value}
            aria-label={button.label}
            onClick={() => setCurrentScale(button.value as GantScaleType)}
            sx={{
              borderRadius: '50px',
              border: 'none',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              color: theme.palette.text.primary,
              '&.Mui-selected': {
                borderRadius: '50px',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
              },
              '&:hover': {
                borderRadius: '50px',
              },
            }}
          >
            {button.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem />

      <ToggleButtonGroup sx={{ maxWidth: '80px', height: '40px', borderRadius: '10px' }}>
        {toggleZoomButtons.map((button) => (
          <ToggleButton
            key={button.value}
            value={button.value}
            aria-label={button.value}
            sx={{ width: '40px', borderRadius: '10px' }}
            onClick={() => handleZoom(button.value as any)}
          >
            {button.icon === 'ZoomInIcon' ? <ZoomInIcon /> : <ZoomOutIcon />}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup sx={{ maxWidth: '70px', height: '40px' }}>
        {toggleArrowButtons.map((button) => (
          <ToggleButton
            key={button.value}
            value={button.value}
            aria-label={button.value}
            sx={{ width: '40px', borderRadius: '10px' }}
            onClick={() =>
              button.icon === 'KeyboardArrowLeftIcon' ? handleScroll('left') : handleScroll('right')
            }
          >
            {button.icon === 'KeyboardArrowLeftIcon' ? (
              <KeyboardArrowLeftIcon fontSize="small" />
            ) : (
              <KeyboardArrowRightIcon fontSize="small" />
            )}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </ChartToolsStyled>
  );
};
