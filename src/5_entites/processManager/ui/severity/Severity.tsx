import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  ColumnFilter,
  GetSeverityByRangesBody,
  SeverityCount,
  useColorsConfigure,
  useProcessManager,
  useSeverity,
  useTabs,
} from '6_shared';
import { getClearedPeriod } from '5_entites/processManager/api/severity/getClearedPeriod';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { ScrollContainer, SeverityStyled } from './Severity.styled';
import { InfographicsElement } from './infographicsElement/InfographicsElement';
import { InfographicsElementCleared } from './infographicsElement/InfographicsElementCleared';

interface IProps {
  liveSeverityByRangesData?: SeverityCount[];
  setSeverityBody?: Dispatch<SetStateAction<GetSeverityByRangesBody | null>>;
  isNarrow?: boolean;
}
const Severity = ({ liveSeverityByRangesData, setSeverityBody, isNarrow }: IProps) => {
  const {
    selectedSeverity,
    isClearedSelected,
    severityValues,
    clearedInterval,
    period,
    severityRanges,
    severityInfo,
    setSelectedSeverity,
    setSeverityValues,
  } = useSeverity();
  const { pmTmoId, setSelectedColumnForColoring } = useProcessManager();

  const { selectedTab } = useTabs();

  const { withCleared, setCurrentTmoId, toggleIsOpenColorSelecting } = useColorsConfigure();
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('severity-container');
      if (container) {
        setShowScrollButtons(container.scrollWidth > container.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = (scrollOffset: number) => {
    const container = document.getElementById('severity-container');
    if (container) {
      container.scrollTo({
        left: container.scrollLeft + scrollOffset,
        behavior: 'smooth',
      });
      // setScrollPosition(container.scrollLeft);
    }
  };

  useEffect(() => {
    if (liveSeverityByRangesData) setSeverityValues(liveSeverityByRangesData);
  }, [liveSeverityByRangesData]);

  useEffect(() => {
    if (selectedSeverity.length || isClearedSelected) return;
    setSelectedSeverity(severityRanges);
  }, [selectedSeverity, severityRanges, isClearedSelected]);

  const getColorForType = (type: string): string => {
    const color = severityRanges.find((range) => type in range);
    return color ? color[type].color : '#3983ad';
  };

  const getValueForType = (type: string): number => {
    const value = severityValues.find((s) => s.filter_name === type);
    return value?.count ?? 0;
  };

  const onApplyInfographics = () => {
    const Cleared: ColumnFilter[] = [
      {
        columnName: 'state',
        rule: 'and',
        filters: [
          {
            operator: 'notEquals',
            value: 'ACTIVE',
          },
        ],
      },
      {
        columnName: 'endDate',
        rule: 'and',
        filters: getClearedPeriod(period, clearedInterval),
      },
    ];
    setSeverityBody?.((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rangesObject: {
          ...prev.rangesObject,
          ranges: {
            ...prev.rangesObject?.ranges,
            Cleared,
          },
        },
      };
    });
  };

  return (
    <SeverityStyled sx={isNarrow ? {} : { justifyContent: 'end' }}>
      <IconButton
        onClick={() => {
          toggleIsOpenColorSelecting({ module: selectedTab });
          if (severityInfo) setSelectedColumnForColoring(severityInfo);
          if (pmTmoId) setCurrentTmoId({ module: selectedTab, tmoId: pmTmoId });
        }}
      >
        {severityRanges?.length === 0 ? <AddIcon /> : <SettingsIcon />}
      </IconButton>
      {showScrollButtons && (
        <IconButton onClick={() => handleScroll(-65)}>
          <ArrowBackIosNewIcon />
        </IconButton>
      )}
      <ScrollContainer
        id="severity-container"
        sx={{ overflowX: showScrollButtons ? 'scroll' : 'hidden' }}
      >
        {severityRanges?.map((range) => {
          const [type, { color }] = Object.entries(range)[0];
          if (type === 'Cleared') return null;
          const value = getValueForType(type);
          const clicked = selectedSeverity.some((obj: any) => type in obj);
          return (
            <InfographicsElement
              key={type}
              type={type}
              color={color}
              value={value}
              clicked={clicked}
              range={range[type]}
            />
          );
        })}

        {withCleared && (
          <InfographicsElementCleared
            type="Cleared"
            clearedValue={getValueForType('Cleared')}
            color={getColorForType('Cleared')}
            onApply={onApplyInfographics}
          />
        )}
      </ScrollContainer>
      {showScrollButtons && (
        <IconButton onClick={() => handleScroll(65)}>
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </SeverityStyled>
  );
};

export default Severity;
