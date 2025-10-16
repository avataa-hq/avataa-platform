import { LineChart, useLocale, LineChartData } from '6_shared';
import { ru, uk, de, enUS } from 'date-fns/locale';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useEffect, useMemo } from 'react';
import { useCompareIntervalData } from '../../lib/chart/useCompareIntervalData';
import { ComparePopover } from './ComparePopover';

function generateAllMonths(): Date[] {
  const months: Date[] = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(2025, i, 1));
  }
  return months;
}

interface IProps {
  chartData: (LineChartData & { unit?: string }) | null;
  currentHierarchyLevelId: number | null;

  calculateOnlyCurrent?: boolean;
}

export const Chart = ({ chartData, currentHierarchyLevelId, calculateOnlyCurrent }: IProps) => {
  const { currentLocale } = useLocale();

  const getLanguage = () => {
    const { code } = currentLocale;
    if (code === 'deDE') return de;
    if (code === 'ukUA') return uk;
    if (code === 'ruRU') return ru;

    return enUS;
  };

  const {
    handleSelectedRangeChange,
    compareResult,
    onPopoverClose,
    popoverPosition,
    chartBoxRef,
    selectedRange1,
    selectedRange2,
    setSelectedRange1,
    setSelectedRange2,
    multipleObjectsTooltipData,
  } = useCompareIntervalData({
    chartData,
    onlyCurrent: calculateOnlyCurrent,
  });

  useEffect(() => {
    onPopoverClose();
  }, [currentHierarchyLevelId]);

  const selectedRanges = useMemo(() => {
    return [selectedRange1, selectedRange2].filter((r) => r) as { start: string; end: string }[];
  }, [selectedRange1, selectedRange2]);

  return (
    chartData &&
    chartData.datasets && (
      <Tooltip
        title={!compareResult ? 'Click and hold «ctrl» key to select a range' : ''}
        placement="top-end"
        arrow
      >
        <div style={{ width: '100%', height: '100%' }}>
          <div
            style={{ width: '100%', height: '100%', padding: '10px', position: 'relative' }}
            ref={chartBoxRef}
          >
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: '35',
                width: '100%',
                display: 'flex',
                gap: '10px',
              }}
            >
              {selectedRange1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Typography variant="subtitle1">
                    {selectedRange1?.start} - {selectedRange1?.end}
                  </Typography>
                  <IconButton
                    onClick={() => setSelectedRange1(null)}
                    sx={{ width: '1rem', height: '1rem' }}
                  >
                    <Close fontSize="small" sx={{ width: '0.85rem', height: '0.85rem' }} />
                  </IconButton>
                </div>
              )}

              {selectedRange2 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Typography variant="subtitle1">
                    {selectedRange2?.start} - {selectedRange2?.end}
                  </Typography>
                  <IconButton
                    onClick={() => setSelectedRange2(null)}
                    sx={{ width: '1rem', height: '1rem' }}
                  >
                    <Close fontSize="small" sx={{ width: '0.85rem', height: '0.85rem' }} />
                  </IconButton>
                </div>
              )}
            </div>
            <LineChart
              multipleColors
              data={{
                labels: chartData.labels || generateAllMonths(),
                datasets: chartData.datasets,
              }}
              options={{
                elements: {
                  line: { tension: 0.5 },
                  point: { radius: 1 },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'month',
                      tooltipFormat: 'MMM dd',
                      minUnit: 'day',
                      displayFormats: {
                        month: 'LLL',
                      },
                    },
                    adapters: {
                      date: {
                        locale: getLanguage(),
                      },
                    },
                    ticks: {
                      source: 'auto',
                    },
                  },
                  y: {
                    ticks: {
                      callback(value) {
                        return `${Number(value).toFixed(chartData.decimals ?? 10)} ${
                          chartData?.unit || 'Mb/s'
                        }`;
                      },
                    },
                  },
                },
                interaction: {
                  intersect: false,
                  mode: 'nearest',
                },
              }}
              handleSelectedRangeChange={handleSelectedRangeChange}
              selectedRanges={selectedRanges}
            />
          </div>

          <ComparePopover
            isOpen={!!popoverPosition && (!!selectedRange1 || !!selectedRange2)}
            compareResult={compareResult}
            popoverPosition={popoverPosition}
            onPopoverClose={onPopoverClose}
            multipleObjectsTooltipData={calculateOnlyCurrent ? multipleObjectsTooltipData : []}
          />
        </div>
      </Tooltip>
    )
  );
};
