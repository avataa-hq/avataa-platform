import styled from '@emotion/styled';
import { GANT_HEADER_PROGRESS_HEIGHT, GANT_HEADER_SCALE_HEIGHT } from '6_shared';

const HEADER_HEIGHT = GANT_HEADER_SCALE_HEIGHT + GANT_HEADER_PROGRESS_HEIGHT;

export const GanttChartHeaderStyled = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  height: ${HEADER_HEIGHT}px;
`;
