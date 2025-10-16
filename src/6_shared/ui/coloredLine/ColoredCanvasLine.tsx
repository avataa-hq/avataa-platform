import { useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip, useTheme } from '@mui/material';
import { IColoredLineData } from './types';
import { useTranslate } from '../../localization';
import { Tooltip as ColoredTooltip } from './Tooltip';

const gap = 0;
const monthGap = 2;

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface SegmentBound {
  outerIndex: number;
  innerIndex: number;
  xStart: number;
  xEnd: number;
}

interface IProps {
  data?: (IColoredLineData | null)[][];
  onCanvasClick?: () => void;

  currentMonthsNames?: string[];
}

export const ColoredCanvasLine = ({ data, onCanvasClick, currentMonthsNames }: IProps) => {
  const { palette } = useTheme();
  const translate = useTranslate();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltipData, setTooltipData] = useState<IColoredLineData | null>(null);
  const segmentBounds = useRef<SegmentBound[]>([]);

  const months = currentMonthsNames?.length ? currentMonthsNames : monthNames;

  const drawLine = useCallback(() => {
    segmentBounds.current = [];
    if (!canvasRef.current || !data?.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    if (!parent) return;

    // Set canvas size based on parent element
    canvas.width = parent.clientWidth * dpr;
    canvas.height = 25 * dpr;
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = '25px';

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const outerSegmentWidth = canvas.width / data.length - monthGap * dpr;

    for (let i = 0; i < data.length; i++) {
      const outerGap = monthGap * i;
      const outerX = outerSegmentWidth * i + outerGap * dpr;
      let outerW = outerSegmentWidth;

      if (i === data.length - 1) outerW += monthGap;

      ctx.fillStyle = palette.text.secondary;
      ctx.textAlign = 'center';
      const month = months[i];
      if (month) {
        const text = translate(months[i] as any);
        ctx.fillText(text, outerX + outerW / 2, canvas.height);
      }

      for (let j = 0; j < data[i].length; j++) {
        const previousItem = data[i][j - 1];
        const currentItem = data[i][j];
        let innerSegmentWidth = outerSegmentWidth / data[i].length - gap * dpr;
        if (innerSegmentWidth < 0) innerSegmentWidth = 0;

        const innerGap = gap * j;

        const innerX = innerSegmentWidth * j + innerGap * dpr + outerX;
        let innerW = innerSegmentWidth;

        if (data[i].length === j + 1) innerW += gap;

        const gradient = ctx.createLinearGradient(
          i * innerSegmentWidth,
          0,
          (i + 1) * innerSegmentWidth,
          0,
        );
        gradient.addColorStop(
          0,
          previousItem?.color ?? currentItem?.color ?? 'rgba(145,145,145,0.14)',
        );
        gradient.addColorStop(1, currentItem?.color ?? 'rgba(145,145,145,0.14)');
        ctx.fillStyle = currentItem?.color ?? 'rgba(145,145,145,0.14)';
        ctx.fillRect(innerX, 0, innerW, canvas.height / 2);

        segmentBounds.current.push({
          outerIndex: i,
          innerIndex: j,
          xStart: innerX,
          xEnd: innerX + innerW,
        });
      }
    }
  }, [data, palette.text.secondary, translate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mouseX = (e.clientX - rect.left) * dpr;

    const hoveredSegment = segmentBounds.current.find(
      (seg) => mouseX >= seg.xStart && mouseX < seg.xEnd,
    );

    if (hoveredSegment) {
      const neededData = data?.[hoveredSegment.outerIndex]?.[hoveredSegment.innerIndex];

      setTooltipData(neededData ?? null);
    } else {
      setTooltipData(null);
    }
  };

  useEffect(() => {
    if (!canvasRef.current?.parentElement) return () => {};

    const resizeObserver = new ResizeObserver(() => {
      drawLine();
    });

    resizeObserver.observe(canvasRef.current.parentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [drawLine]);

  return (
    <div style={{ width: '100%', height: '15px', position: 'relative' }}>
      <Tooltip
        title={tooltipData ? <ColoredTooltip data={tooltipData} /> : null}
        followCursor
        slotProps={{
          tooltip: {
            sx: !tooltipData ? { display: 'none' } : {},
          },
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', borderRadius: '5px' }}
          onMouseMove={handleMouseMove}
          onClick={onCanvasClick}
        />
      </Tooltip>
    </div>
  );
};
