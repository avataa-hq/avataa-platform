import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';

export const CreateGroupStyled = styled(Box)`
  width: 100%;
  min-width: 600px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 15px;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & .MuiAccordion-root {
    border-radius: 10px;
    overflow: hidden;
  }
`;

export const BodyItem = styled(AccordionDetails)`
  max-height: 300px;
  overflow-y: auto;
`;

export const BodyContentText = styled(Typography)`
  opacity: 0.6;
`;

export const Footer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FooterButtonContainer = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 5px;
`;
