import styled from '@emotion/styled';
import { ButtonGroup, alpha, Button } from '@mui/material';

import { Box } from '6_shared';

export const ButtonGroupStyled = styled(ButtonGroup)`
  border-radius: 10px;
  &:hover {
    box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.25);
    opacity: 0.8;
  }
`;

export const InfographicsElementStyled = styled(Button)<{ isactive: string; buttoncolor: string }>`
  /* display: flex; */
  width: 3rem;
  height: 2rem;
  // min-width: 3rem;
  // min-height: 2rem;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  /* flex-shrink: 0; */
  border-radius: 10px;
  border: transparent;
  background-color: ${({ buttoncolor }) => buttoncolor};
  opacity: ${({ isactive }) => (isactive === 'true' ? '0.8' : '0.3')};

  &:hover {
    background-color: ${({ buttoncolor }) => buttoncolor};
    box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.5);
    opacity: 0.5;
  }
`;

export const InfographicsPseudoElement = styled(Box)`
  display: flex;
  width: 2px;
  height: 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  background-color: rgba(255, 255, 255, 1);
  border: transparent;
`;

export const TimePeriodPickerStyled = styled(Button)<{ backgroundcolor: any }>`
  display: flex;
  width: 1.5rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background-color: ${({ backgroundcolor }) => alpha(backgroundcolor, 0.8)};
  border-radius: 10px;
  border: transparent;

  &:hover {
    background-color: ${({ backgroundcolor }) => alpha(backgroundcolor, 0.6)};
  }
`;
