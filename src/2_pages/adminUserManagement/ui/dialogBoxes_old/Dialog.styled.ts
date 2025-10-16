import styled from '@emotion/styled';
import { Button, Dialog, DialogTitle, IconButton, TextField, Box } from '@mui/material';

export const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: ${({ theme }) => theme.palette.neutral.backdrop};
  }

  .MuiPaper-root {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 20px;
    background: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant1};
    border-radius: 20px;
    backdrop-filter: blur(50px);
    opacity: 0;
    animation: an_ae_prm 0.7s forwards;

    @keyframes an_ae_prm {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 100;
      }
    }
  }
`;

export const Container = styled(Box)`
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 377px;
`;

export const StyledDialogTitle = styled(DialogTitle)`
  padding: 0;
  width: 279px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
`;

export const InputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputTitle = styled(Box)`
  height: 18px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
`;

export const StyledTextField = styled(TextField)`
  width: 377px;
`;

export const StyledButton = styled(Button)`
  align-self: flex-end;
  padding: 10px;
  width: 76px;
  height: 42px;
  border-radius: 50px;
  transition: all 0.3s;
  text-transform: none;

  &:hover {
    background: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.primary.contrastText};
  }
`;

export const StyledIconButton = styled(IconButton)`
  width: 20px;
  height: 20px;
  color: ${(props) => props.theme.palette.neutralVariant.icon};
  transition: all 0.3s;

  &:hover {
    color: ${(props) => props.theme.palette.primary.main};
    background: none;
  }
`;
