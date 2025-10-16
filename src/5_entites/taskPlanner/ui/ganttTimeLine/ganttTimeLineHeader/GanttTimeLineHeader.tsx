import { forwardRef, UIEvent, useMemo } from 'react';
import { Typography, useTheme } from '@mui/material';
import { GantScaleType, TimeLineSegments } from '6_shared';
import {
  GanttHeaderProgressLine,
  GanttTimeLineHeaderProgressContainer,
  GanttTimeLineHeaderScaleContainer,
  GanttTimeLineHeaderScaleRow,
  GanttTimeLineHeaderStyled,
  TimeLineHeaderScaleItem,
  Triangle,
} from './GanttTimeLineHeader.styled';
import { TodayLine } from '../../todayLine/TodayLine';

interface IColorSegments {
  color: string;
  width: number;
}

interface IProps {
  timeLineWidth?: number;
  headerProgressWidth?: number;
  onTimeLineHeaderScroll?: (e: UIEvent<HTMLDivElement>) => void;
  currentScale: GantScaleType;
  todayPosition?: number;
  timeLineSegments: TimeLineSegments | null;
  globalProgressColorSegments: IColorSegments[];
  presentOfProgress: number;
}

export const GanttTimeLineHeader = forwardRef<HTMLDivElement, IProps>(
  (
    {
      onTimeLineHeaderScroll,
      headerProgressWidth,
      currentScale,
      todayPosition,
      timeLineWidth = 10,
      timeLineSegments,
      globalProgressColorSegments,
      presentOfProgress,
    },
    ref,
  ) => {
    const { palette } = useTheme();

    const redToGreenIndex = globalProgressColorSegments.findIndex(
      (segment) =>
        segment.color === palette.success.light &&
        globalProgressColorSegments[globalProgressColorSegments.indexOf(segment) - 1]?.color ===
          palette.error.light,
    );

    const greenToYellowIndex = globalProgressColorSegments.findIndex(
      (segment) =>
        segment.color === palette.warning.light &&
        globalProgressColorSegments[globalProgressColorSegments.indexOf(segment) - 1]?.color ===
          palette.success.light,
    );

    const redToGreenPosition =
      redToGreenIndex !== -1
        ? globalProgressColorSegments[redToGreenIndex].width * redToGreenIndex
        : 0;

    const greenToYellowPosition =
      greenToYellowIndex !== -1
        ? globalProgressColorSegments[greenToYellowIndex].width * greenToYellowIndex
        : 0;

    const colorByPresent = useMemo(() => {
      if (presentOfProgress > 110) return palette.error.light;
      if (presentOfProgress < 80) return palette.warning.light;
      return palette.success.light;
    }, [palette.error.light, palette.success.light, palette.warning.light, presentOfProgress]);

    const timeLine = useMemo(() => {
      if (!timeLineSegments) return null;
      const { quarters, months, weeks, days } = timeLineSegments;
      let currentRenderList: Partial<TimeLineSegments> = { weeks };

      if (currentScale === 'quarters') currentRenderList = { quarters, months };
      if (currentScale === 'months') currentRenderList = { months, weeks };

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
        >
          {Object.values(currentRenderList).map((segments, rowIdx) => (
            <GanttTimeLineHeaderScaleRow key={`row-${rowIdx}`} style={{ height: '70%' }}>
              {segments.map((s, idx) => (
                <TimeLineHeaderScaleItem
                  key={`${s.label}${idx}`}
                  style={{ minWidth: s.width, maxWidth: s.width }}
                >
                  <Typography sx={{ opacity: 0.7 }} variant="body1">
                    {s.label}
                  </Typography>
                </TimeLineHeaderScaleItem>
              ))}
            </GanttTimeLineHeaderScaleRow>
          ))}
          <GanttTimeLineHeaderScaleRow style={{ maxHeight: '30%' }}>
            {days.map((s, idx) => (
              <TimeLineHeaderScaleItem
                key={`${s.label}${idx}`}
                style={{ minWidth: s.width, maxWidth: s.width }}
              >
                <Typography sx={{ opacity: 0.7 }} variant="subtitle1">
                  {s.label}
                </Typography>
              </TimeLineHeaderScaleItem>
            ))}
          </GanttTimeLineHeaderScaleRow>
        </div>
      );
    }, [currentScale, timeLineSegments]);

    return (
      <GanttTimeLineHeaderStyled
        id="ganttTimeLineHeaderScale"
        ref={ref}
        onScroll={onTimeLineHeaderScroll}
      >
        <GanttTimeLineHeaderScaleContainer style={{ width: timeLineWidth }}>
          {timeLine}
        </GanttTimeLineHeaderScaleContainer>
        <GanttTimeLineHeaderProgressContainer style={{ width: timeLineWidth }}>
          <GanttHeaderProgressLine
            progressSegments={globalProgressColorSegments}
            timeLineWidth={headerProgressWidth}
            progressPosition={redToGreenPosition - 20}
            fillColor={colorByPresent}
          />
          <Triangle direction="up" style={{ left: `${redToGreenPosition}px` }} />
          <Triangle direction="down" style={{ left: `${greenToYellowPosition}px` }} />
        </GanttTimeLineHeaderProgressContainer>
        {todayPosition && <TodayLine todayPosition={todayPosition} />}
      </GanttTimeLineHeaderStyled>
    );
  },
);
