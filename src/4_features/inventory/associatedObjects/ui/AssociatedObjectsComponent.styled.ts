import styled from '@emotion/styled';
import { Box } from '6_shared';

export const AssociatedObjectsComponentContainer = styled(Box)`
  height: 80%;
  width: 70%;
  min-width: 800px;
  padding: 20px 0;

  display: flex;
  flex-direction: column;

  border-radius: 10px;
  background: ${(props) => props.theme.palette.background.default};
  box-shadow: 0 9px 46px 8px rgba(0, 0, 0, 0.15);
`;

export const HeaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px 10px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary.main};
`;
export const HeaderContainerTop = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const HeaderContainerBottom = styled(Box)``;

export const BodyContainer = styled(Box)`
  padding: 10px 0;
  flex: 1;
  height: 80%;
`;
