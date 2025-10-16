import styled from '@emotion/styled';
import { Box } from '../../../ui';

export const InputWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 100px;
`;

export const ErrorMessage = styled(Box)`
  width: 180px;
  color: ${({ theme }) => theme.palette.error.main};
  font-size: 10px;
`;
