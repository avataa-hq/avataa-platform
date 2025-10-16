import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const TaskPlannerWidgetStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 35px -10px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  overflow: hidden;
`;

export const Header = styled.div`
  width: 100%;
  padding: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
`;

export const HeaderLeft = styled.div`
  width: 50%;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
`;
export const HeaderRight = styled(Box)``;
