import { useCallback, useEffect, useRef, useState } from 'react';
import { format, startOfMonth, subYears } from 'date-fns';
import {
  LineChartData,
  LineChartDatasets,
  CompareResult,
  IMultipleObjectsCompareResult,
} from '6_shared';

const getStats = (values: number[]) => {
  if (!values.length) return { min: 0, avg: 0, max: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return { min, avg, max };
};

const calcDelta = (current: number, previous: number) => {
  const diff = current - previous;
  const percent = current !== 0 ? 100 * (1 - previous / current) : 0;
  return { diff, percent };
};

const getValuesInRange = (dataset: LineChartDatasets, start: Date, end: Date) => {
  const startTime = start.getTime();
  const endTime = new Date(end).setHours(23, 59, 59, 999);

  return dataset.data.reduce((acc: number[], p: any) => {
    const time = new Date(p.x).getTime();
    if (time >= startTime && time <= endTime && p.y != null && !Number.isNaN(p.y)) {
      acc.push(p.y);
    }
    return acc;
  }, []);
};

interface IProps {
  chartData: (LineChartData & { unit?: string }) | null;

  onlyCurrent?: boolean;
}

export const useCompareIntervalData = ({ chartData, onlyCurrent }: IProps) => {
  const chartBoxRef = useRef<HTMLDivElement>(null);

  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [selectedRange1, setSelectedRange1] = useState<{ start: string; end: string } | null>(null);
  const [selectedRange2, setSelectedRange2] = useState<{ start: string; end: string } | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

  const [multipleObjectsTooltipData, setMultipleObjectsTooltipData] = useState<
    IMultipleObjectsCompareResult[]
  >([]);

  const handleCompare = useCallback(
    ({ datasets }: { datasets: LineChartDatasets[] }): CompareResult | null => {
      if (selectedRange1 && !selectedRange2) {
        const currentStartDate = new Date(selectedRange1.start);
        const currentEndDate = new Date(selectedRange1.end);

        const currentYearLabel = format(currentStartDate, 'yyyy');
        const prevYearLabel = format(subYears(currentStartDate, 1), 'yyyy');

        const currentYearDataset = datasets.find((d) => d.label.includes(currentYearLabel));
        const prevYearDataset = datasets.find((d) => d.label.includes(prevYearLabel));

        if (!currentYearDataset || !prevYearDataset) return null;

        const currentValues = getValuesInRange(
          currentYearDataset,
          currentStartDate,
          currentEndDate,
        );

        const prevValues = getValuesInRange(prevYearDataset, currentStartDate, currentEndDate);

        const current = getStats(currentValues);
        const previous = getStats(prevValues);

        const res = {
          previousLabel: prevYearLabel,
          currentLabel: currentYearLabel,
          previous,
          current,
          delta: {
            min: calcDelta(current.min, previous.min),
            avg: calcDelta(current.avg, previous.avg),
            max: calcDelta(current.max, previous.max),
          },
        };

        setCompareResult(res);
      }

      if (selectedRange1 && selectedRange2) {
        const currentStartDate = new Date(selectedRange1.start);
        const currentEndDate = new Date(selectedRange1.end);
        const prevStartDate = new Date(selectedRange2.start);
        const prevEndDate = new Date(selectedRange2.end);

        const currentYearLabel = format(currentStartDate, 'yyyy');

        const currentYearDataset = datasets.find((d) => d.label.includes(currentYearLabel));

        if (!currentYearDataset) return null;

        const currentValues = getValuesInRange(
          currentYearDataset,
          currentStartDate,
          currentEndDate,
        );
        const prevValues = getValuesInRange(currentYearDataset, prevStartDate, prevEndDate);

        const current = getStats(currentValues);
        const previous = getStats(prevValues);

        const res = {
          previousLabel: `${selectedRange1.start} - ${selectedRange1.end}`,
          currentLabel: `${selectedRange2.start} - ${selectedRange2.end}`,
          previous,
          current,
          delta: {
            min: calcDelta(current.min, previous.min),
            avg: calcDelta(current.avg, previous.avg),
            max: calcDelta(current.max, previous.max),
          },
        };

        setCompareResult(res);
      }

      return null;
    },
    [selectedRange1, selectedRange2],
  );
  const handleCompareMultipleObjects = useCallback(
    ({ datasets }: { datasets: LineChartDatasets[] }) => {
      const res: IMultipleObjectsCompareResult[] = [];
      datasets.forEach((dataset) => {
        if (selectedRange1) {
          const currentStartDate = startOfMonth(new Date(selectedRange1.start));
          const currentEndDate = startOfMonth(new Date(selectedRange1.end));
          const currentValues = getValuesInRange(dataset, currentStartDate, currentEndDate);
          const { min, avg, max } = getStats(currentValues);
          res.push({ label: dataset.label, states: { min, avg, max } });
        }
      });
      setMultipleObjectsTooltipData(res);
    },
    [selectedRange1],
  );

  useEffect(() => {
    if (onlyCurrent) {
      handleCompareMultipleObjects({ datasets: chartData?.datasets || [] });
    } else {
      handleCompare({ datasets: chartData?.datasets || [] });
    }
  }, [chartData, handleCompare, handleCompareMultipleObjects, onlyCurrent]);

  const handleSelectedRangeChange = (range: { start: string; end: string } | null) => {
    const rect = chartBoxRef.current?.getBoundingClientRect();
    if (rect) {
      setPopoverPosition({
        top: rect.top - 250,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }

    if (selectedRange1 && !selectedRange2) {
      setTimeout(() => {
        setSelectedRange2(range);
      }, 100);
      return;
    }

    if (!selectedRange1) {
      setTimeout(() => {
        setSelectedRange1(range);
      }, 100);
    }
  };

  const onPopoverClose = () => {
    setPopoverPosition(null);
    setSelectedRange1(null);
    setSelectedRange2(null);
    setCompareResult(null);
  };

  return {
    handleSelectedRangeChange,
    popoverPosition,
    compareResult,
    chartBoxRef,
    onPopoverClose,
    selectedRange1,
    selectedRange2,
    setSelectedRange1,
    setSelectedRange2,

    multipleObjectsTooltipData,
  };
};
