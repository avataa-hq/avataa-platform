import styled from '@emotion/styled';
import { alpha } from '@mui/material';
import { GANT_HEADER_PROGRESS_HEIGHT, GANT_HEADER_SCALE_HEIGHT } from '6_shared';

export const GanttTimeLineHeaderStyled = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
  scrollbar-width: none;
  position: relative;
`;

export const GanttTimeLineHeaderScaleContainer = styled.div`
  display: flex;
  height: ${GANT_HEADER_SCALE_HEIGHT}px;
  flex-direction: column;
`;

export const GanttTimeLineHeaderScaleRow = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

export const TimeLineHeaderScaleItem = styled.div`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  border-right: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
`;

export const GanttTimeLineHeaderProgressContainer = styled.div`
  height: ${GANT_HEADER_PROGRESS_HEIGHT}px;
  background: ${({ theme }) => alpha(theme.palette.primary.light, 0.1)};
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
`;

export const GanttHeaderProgressLine = styled.div<{
  progressSegments: { color: string; width: number }[];
  timeLineWidth?: number;
  progressPosition?: number;
  fillColor?: string;
}>`
  height: 5px;
  background: rgba(94, 94, 94, 0.16);
  width: 100%;
  border-radius: 10px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: ${({ progressPosition }) => progressPosition}px;
    height: 100%;
    width: ${({ timeLineWidth }) => timeLineWidth}px;
    //width: 300px;
    background: ${({ fillColor }) => fillColor};

    border-radius: 10px;
    transition: background 0.3s ease-in-out;
    filter: blur(1px);
  }
`;

export const Triangle = styled.div<{ direction: 'up' | 'down' }>`
  position: absolute;
  bottom: ${({ direction }) => (direction === 'up' ? '20px' : '5px')};
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-radius: 2px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: ${({ direction, theme }) =>
    direction === 'up' ? 'none' : `10px solid ${theme.palette.primary.main}`};
  border-top: ${({ direction, theme }) =>
    direction === 'up' ? `10px solid ${theme.palette.primary.main}` : 'none'};
`;

// background: ${({ progressSegments, timeLineWidth }) => {
//   const gradientParts: string[] = [];
//   let prevColor = progressSegments[0]?.color || 'transparent';
//   let accumulatedWidth = 0;
//
//   progressSegments.forEach(({ color, width }, index) => {
//     const percentStart = (accumulatedWidth / timeLineWidth) * 100;
//     const percentEnd = ((accumulatedWidth + width) / timeLineWidth) * 100;
//
//     if (index > 0 && color !== prevColor) {
//       const fadeStart = percentStart - 0.1;
//       const fadeMid = percentStart;
//       const fadeEnd = percentStart + 0.1;
//
//       gradientParts.push(`rgba(0, 0, 0, 0.0) ${fadeStart}%`);
//       gradientParts.push(`rgba(0, 0, 0, 0.2) ${fadeMid}%`);
//       gradientParts.push(`rgba(0, 0, 0, 0.0) ${fadeEnd}%`);
//     }
//
//     gradientParts.push(`${color} ${percentStart}%, ${color} ${percentEnd}%`);
//
//     prevColor = color;
//     accumulatedWidth += width;
//   });
//
//   return `linear-gradient(to right, ${gradientParts.join(', ')})`;
// }};
// /* background: ${({ progressSegments, timeLineWidth }) =>
//   `linear-gradient(to right, ${progressSegments
//     .map(({ color, width }, index, arr) => {
//       const percent = (width / timeLineWidth) * 100;
//       const prevPercent = arr
//         .slice(0, index)
//         .reduce((sum, seg) => sum + (seg.width / timeLineWidth) * 100, 0);
//
//       return `${color} ${prevPercent}%, ${color} ${prevPercent + percent}%`;
//     })
//     .join(', ')})`}; */
