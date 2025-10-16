import { useState } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { sliderValueRounder } from '6_shared/lib/utils/valueDimensioners';
import { useColorsConfigure, useProcessManager, useSeverity, useTabs } from '6_shared';
import { InfographicsElementStyled } from './InfographicsElement.styled';

interface IProps {
  type: string;
  value: number;
  color: string;
  clicked?: boolean;
  range?: { from?: number; to?: number; color?: string };
}

export const InfographicsElement = ({ color, value, type, clicked, range }: IProps) => {
  const theme = useTheme();

  const [isHovered, setIsHovered] = useState(false);

  const { toggleIsOpenColorSelecting, setCurrentTmoId } = useColorsConfigure();
  const {
    selectedSeverity,
    isClearedSelected,
    severityInfo,
    setIsClearedSelected,
    setSelectedSeverity,
  } = useSeverity();
  const { selectedTab } = useTabs();
  const { pmTmoId, setSelectedColumnForColoring } = useProcessManager();

  const handleClick = () => {
    if (type === 'Cleared') {
      setIsClearedSelected(!isClearedSelected);
    } else {
      const keyToMutate = type;
      const updatedSeverityData = [...selectedSeverity];

      const existingIndex = updatedSeverityData.findIndex(
        (item) => Object.keys(item)[0] === keyToMutate,
      );

      if (existingIndex === -1) {
        const newObj = {
          [keyToMutate]: { from: range?.from, to: range?.to, color: range?.color || '#ffffff' },
        };
        updatedSeverityData.push(newObj);
      } else {
        updatedSeverityData.splice(existingIndex, 1);
      }
      setSelectedSeverity(updatedSeverityData);
    }
  };

  const handleColorSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (pmTmoId) setCurrentTmoId({ module: selectedTab, tmoId: pmTmoId });
    if (severityInfo) setSelectedColumnForColoring(severityInfo);
    toggleIsOpenColorSelecting({ module: selectedTab });
  };

  const isActive = (): boolean => {
    if (type === 'Cleared') return isClearedSelected;
    return clicked || (selectedSeverity.length === 0 && !isClearedSelected);
  };

  return (
    <Tooltip title={`${String(type)}: ${String(value)}`} open={isHovered}>
      <InfographicsElementStyled
        isactive={isActive().toString()}
        buttoncolor={color}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleClick()}
        onContextMenu={handleColorSettings}
      >
        <Typography color={theme.palette.common.white}>
          {String(sliderValueRounder(value))}
        </Typography>
      </InfographicsElementStyled>
    </Tooltip>
  );
};
