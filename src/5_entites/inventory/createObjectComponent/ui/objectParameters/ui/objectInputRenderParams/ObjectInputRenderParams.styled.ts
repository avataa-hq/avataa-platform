import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Box, Typography } from '@mui/material';

export const ObjectInputRenderParamsStyled = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const DeleteIconStyled = styled(DeleteIcon)`
  width: 20px;
  height: 20px;
  color: ${(props) => props.theme.palette.neutralVariant.icon};
`;

export const AccordionContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1%;
  width: 100%;
`;

export const Wrapper = styled(Box)`
  width: 100%;
`;

export const ButtonWrapper = styled(Box)`
  width: 10%;
`;

export const ModalHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 1.25rem;
  width: 224px;
  margin-left: auto;
  margin-right: auto;
`;

export const ModalBody = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3125rem;
`;

export const ModalTitle = styled(Typography)`
  font-size: 16px;
  text-align: center;
`;

export const ModalButton = styled(Button)`
  width: 150px;
  height: 37px;
`;
