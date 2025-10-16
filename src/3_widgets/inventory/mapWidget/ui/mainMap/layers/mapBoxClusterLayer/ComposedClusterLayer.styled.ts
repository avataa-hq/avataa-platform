import styled from '@emotion/styled';

export const MinimizeMarker = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
export const MinimizeMarkerIcon = styled.div``;
export const MinimizeMarkerName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //min-width: 60px;
  padding: 3px 7px;
  text-align: center;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.background.default};
`;
