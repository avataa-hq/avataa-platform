import styled from '@emotion/styled';
import { Box, InputBase } from '@mui/material';

export const InputBaseStyled = styled(InputBase)`
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  border-radius: 10px;
  padding: 6px 10px;
  width: 100%;
`;

export const Body = styled(Box)`
  width: 100%;
  height: 400px;
  overflow-y: scroll;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Footer = styled(Box)`
  width: 100%;
  padding-top: 20px;
  padding-top: 15px;
  margin-top: 20px;
  border-top: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
