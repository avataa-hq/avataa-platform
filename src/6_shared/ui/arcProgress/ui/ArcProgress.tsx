import { alpha, Popover, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { FillSegments } from './FillSegments';
import { TickMarks } from './TickMarks';
import { InsideIcon } from './InsideIcon';
import { ArcLabel } from './ArcLabel';
import { useArcProgressData } from '../hooks/useArcProgressData';
import { ArcBase } from './ArcBase';
import { IArcProgressData } from '../types';
import { ArcImage } from './ArcImage';
import { ArcImageText } from './ArcImageText';
import { ArcTooltipSimple } from './ArcTooltipSimple';

interface IProps extends IArcProgressData {
  name?: string;

  backgroundColor?: string;
  width?: number;
  viewBox?: string;

  onClick?: () => void;
  onContextMenu?: (event: any) => void;

  imageUrl?: string | null;

  type?: 'circle' | 'arc';

  simple?: boolean;

  isLoading?: boolean;
}

export const ArcProgress = ({
  name,

  value,
  additionalValue,
  icon,

  numberOfDecimals,

  backgroundColor,
  width,
  viewBox = '-40 0 180 130',

  onClick,
  onContextMenu,

  imageUrl,

  type = 'arc',
  simple,

  isLoading,
}: IProps) => {
  const { palette } = useTheme();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  // const svgRef = useRef<SVGSVGElement | null>(null);
  // const [svgWidth, setSvgWidth] = useState(100);

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handlePopoverLeave = () => {
    setAnchorEl(null);
  };

  const onInfoClick = () => {
    setAnchorEl(anchorRef.current);
  };

  const { fillSegments, ticksSegments, displayMainValue, displaySecondValue, tooltipData, unit } =
    useArcProgressData({
      value,
      additionalValue,
      numberOfDecimals,
    });

  // useEffect(() => {
  //   const container = svgRef.current;
  //   const updateDimensions = () => {
  //     if (container) {
  //       const { clientWidth } = container;
  //       setSvgWidth(clientWidth);
  //     }
  //   };
  //
  //   updateDimensions();
  //   const resizeObserver = new ResizeObserver(updateDimensions);
  //   if (container) resizeObserver.observe(container);
  //
  //   return () => {
  //     if (container) resizeObserver.unobserve(container);
  //   };
  // }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} ref={anchorRef}>
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        // viewBox="-40 0 180 130"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onContextMenu={onContextMenu}
        // ref={svgRef}
      >
        <ArcBase width={width} backgroundColor={backgroundColor} type={type} />
        {imageUrl && <ArcImage imageUrl={imageUrl} />}

        {simple && (
          <ArcImageText text={displayMainValue + unit} position={imageUrl ? 'bottom' : 'center'} />
        )}

        <FillSegments
          fillSegments={fillSegments}
          arcWidth={width}
          type={type}
          backgroundColor={backgroundColor}
        />
        <TickMarks ticks={ticksSegments} type={type} />
        {!simple && (
          <>
            <text
              x="50"
              y="30"
              textAnchor="middle"
              fontSize="10"
              fontWeight="normal"
              fill={alpha(palette.text.primary, 0.5)}
            >
              {displaySecondValue}
            </text>
            <text
              x="50"
              y="50"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={alpha(palette.text.primary, 1)}
            >
              {displayMainValue}
            </text>

            <text
              x="50"
              y="62"
              textAnchor="middle"
              fontSize="11"
              fontWeight="normal"
              fill={alpha(palette.text.primary, 1)}
            >
              {unit}
            </text>
            {icon && <InsideIcon {...icon} />}
            <ArcLabel label={name} />
          </>
        )}

        <circle
          cx="7.5"
          cy="90"
          r="7"
          fill={alpha(palette.primary.main, 0.1)}
          strokeWidth="0"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
        />
        <text
          x="6.5"
          y="93.5"
          // fontFamily="Arial"
          fontSize="8"
          fontStyle="italic"
          textAnchor="middle"
          fill={palette.text.primary}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
        >
          i
        </text>
      </svg>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        aria-hidden={false}
        slotProps={{
          paper: {
            sx: {
              background: palette.neutral.surfaceContainer,
            },
          },
        }}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <ArcTooltipSimple content={tooltipData} onContainerMouseLeave={handlePopoverLeave} />
      </Popover>
    </div>
  );
};
