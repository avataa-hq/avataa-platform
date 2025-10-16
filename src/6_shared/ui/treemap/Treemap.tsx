import { useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';
import { TreeNode } from './types';
import { useTreemap } from './lib/useTreemap';
import { getOptimalFontSize } from './lib/getOptimalFontSize';
import { getTransformedText } from './lib/getTransformedText';
import { TooltipContent } from './TooltipContent';
import { createFormatter } from '../../lib';

interface IProps {
  data?: TreeNode[];
  onRectClick?: (data: TreeNode) => void;
}
export const Treemap = ({ data, onRectClick }: IProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [containerDimensions, setContainerDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const container = containerRef.current;
    const updateDimensions = () => {
      if (container) {
        const { clientWidth, clientHeight } = container;
        setContainerDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (container) resizeObserver.observe(container);

    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  }, []);

  const { levels } = useTreemap({ ...containerDimensions, data });

  const allShapes = useMemo(() => {
    return levels.map((leaf, idx) => {
      const color = leaf.data.properties?.color ?? 'steelblue';

      const rectWidth = leaf.x1 - leaf.x0;
      const rectHeight = leaf.y1 - leaf.y0;
      const fontSize = getOptimalFontSize(leaf);
      const nameLines = getTransformedText(leaf.data.name, rectWidth - 6, fontSize);
      const totalLines = nameLines.length + 1; // имя + значение

      const lineHeight = fontSize * 1.2;
      const totalTextHeight = totalLines * lineHeight;

      const xCenter = leaf.x0 + rectWidth / 2;
      const yCenter = leaf.y0 + rectHeight / 2;
      const yStart = yCenter - totalTextHeight / 2;

      return (
        <Tooltip
          followCursor
          key={`${leaf.data.name}_${leaf.data.value}_${idx}`}
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: 'transparent',
              },
            },
          }}
          title={
            <TooltipContent
              object={{
                name: leaf.data.name,
                eventValues: leaf.data.properties?.eventValues ?? {},
              }}
            />
          }
        >
          <g key={leaf.id}>
            <rect
              x={leaf.x0}
              y={leaf.y0}
              width={rectWidth}
              height={rectHeight}
              stroke="transparent"
              fill={color}
              onClick={() => {
                onRectClick?.(leaf.data);
              }}
            />

            <text
              x={xCenter}
              y={yStart}
              fontSize={fontSize}
              textAnchor="middle"
              alignmentBaseline="hanging"
              fill="white"
            >
              {nameLines.map((line, i) => (
                <tspan x={xCenter} dy={i === 0 ? '0' : '1.2em'} key={i}>
                  {line}
                </tspan>
              ))}
              <tspan x={xCenter} dy="1.2em" className="font-light">
                {createFormatter(leaf.data.valueDecimals ?? 10).format(leaf.data.value)}{' '}
                {leaf.data.properties?.unitValue}
              </tspan>
            </text>
          </g>
        </Tooltip>
      );
    });
  }, [levels, onRectClick]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={containerRef}>
      <svg width="100%" height="100%">
        {allShapes}
      </svg>
    </div>
  );
};
