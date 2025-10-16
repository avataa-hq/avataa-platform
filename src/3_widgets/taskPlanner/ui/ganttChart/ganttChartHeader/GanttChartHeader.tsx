import { forwardRef, UIEvent } from 'react';
import { GanttTaskListHeader, GanttTimeLineHeader } from '5_entites';
import { GantScaleType, IColorSegments, TimeLineSegments } from '6_shared';
import { GanttChartHeaderStyled } from './GanttChartHeader.styled';

interface IProps {
  timeLineWidth?: number;
  headerProgressWidth?: number;
  onTimeLineHeaderScroll?: (e: UIEvent<HTMLDivElement>) => void;
  currentScale: GantScaleType;
  todayPosition?: number;
  timeLineSegments: TimeLineSegments | null;
  globalProgressColorSegments: IColorSegments[];
  toggleProjectExpand: () => void;
  projectExpanded: boolean;

  presentOfProgress: number;
}

export const GanttChartHeader = forwardRef<HTMLDivElement, IProps>(
  (
    {
      timeLineWidth,
      headerProgressWidth,
      onTimeLineHeaderScroll,
      currentScale,
      todayPosition,
      timeLineSegments,
      globalProgressColorSegments,
      toggleProjectExpand,
      projectExpanded,
      presentOfProgress,
    },
    ref,
  ) => {
    return (
      <GanttChartHeaderStyled>
        <GanttTaskListHeader
          progressValue={Math.round(presentOfProgress)}
          toggleProjectExpand={toggleProjectExpand}
          projectExpanded={projectExpanded}
        />
        <GanttTimeLineHeader
          timeLineSegments={timeLineSegments}
          todayPosition={todayPosition}
          currentScale={currentScale}
          timeLineWidth={timeLineWidth}
          ref={ref}
          onTimeLineHeaderScroll={onTimeLineHeaderScroll}
          globalProgressColorSegments={globalProgressColorSegments}
          headerProgressWidth={headerProgressWidth}
          presentOfProgress={presentOfProgress}
        />
      </GanttChartHeaderStyled>
    );
  },
);
