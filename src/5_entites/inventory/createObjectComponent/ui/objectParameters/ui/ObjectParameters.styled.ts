import styled from '@emotion/styled';
import { Button, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const ObjectParametersStyled = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 20px 0 30px;
  position: relative;
`;

export const Form = styled.form`
  height: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export const ObjectParametersBody = styled(Box)`
  width: 100%;
  flex-grow: 1;
  overflow-y: scroll;
`;

export const ObjectParametersFooter = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
`;

export const CreateObjectParameterButton = styled(Button)`
  height: 37px;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 700;
  font-size: 14px;
  z-index: 2;
  font-family: Mulish;
`;

export const ObjectActionsButtons = styled(Box)`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.neutral.surface
      : theme.palette.neutralVariant.outlineVariant30};
`;

export const ObjectComponentButton = styled(Button)`
  height: 37px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  border-radius: 50px;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const ObjectParametersContentHeader = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

export const ObjectParametersCountBox = styled(Typography)`
  width: 37px;
  height: 22px;
  border-radius: 10px;
  padding: 2px 8px;
  color: ${(props) => props.theme.palette.common.white};
  background-color: ${(props) => props.theme.palette.primary.main};
  font-family: Montserrat;
  font-size: 12px;
  text-align: center;
`;

export const ObjectParametersTitleWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const ObjectParametersInputWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 5px;
  /* background: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.neutral.surface
      : theme.palette.neutralVariant.outlineVariant30}; */
`;
