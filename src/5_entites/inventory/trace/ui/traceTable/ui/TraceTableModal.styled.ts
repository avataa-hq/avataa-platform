import styled from '@emotion/styled';
import { Box } from '6_shared';
import { Modal } from '@mui/material';

// interface IProps {
//   isHidden: boolean;
// }

export const TraceTableModalStyled = styled(Modal)``;

export const TraceTableModalContainer = styled(Box)`
  background: ${(props) => props.theme.palette.background.default};
  opacity: 1;
  width: 70%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 9px 46px 8px rgba(0, 0, 0, 0.15);
  padding: 32px;
  border-radius: 10px;
`;
