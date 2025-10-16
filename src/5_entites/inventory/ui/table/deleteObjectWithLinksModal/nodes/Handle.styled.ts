import styled from '@emotion/styled';
import { Handle } from '@xyflow/react';

export const HandleStyled = styled(Handle)`
  width: 10px;
  height: 10px;
  background-color: ${({ theme }) => theme.palette.info.main};
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
`;
