import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const NamedObjectPointStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100%;

  &:hover {
    cursor: pointer;
  }
`;

export const PointContainer = styled(Box)`
  width: 25%;
  position: relative;
`;
export const PointActiveContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%);
  z-index: -1;
  opacity: 0.5;
`;
export const PointLoadingContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -47%);
  opacity: 1;
`;
export const Point = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20%;
  color: white;
  aspect-ratio: 1/1;
  border-radius: 50%;
`;
export const PointName = styled(Box)`
  padding: 5px 10px;
  display: flex;
  /* width: 80%; */
  /* min-width: 80px; */
  //width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  border-radius: 10px;

  box-shadow: 12px 9px 8px 0 rgba(0, 0, 0, 0.29);
`;
