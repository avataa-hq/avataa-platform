import styled from '@emotion/styled';
import { Box } from '6_shared';

export const MuiIconLibraryStyled = styled(Box)`
  width: 100%;
  height: 100%;
  gap: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Header = styled(Box)`
  width: 100%;
`;
export const Body = styled(Box)`
  width: 100%;
  overflow-y: auto;

  svg {
    margin: 5px;
    transition: all 0.3s;
    &:hover {
      transform: scale(110%);
      transition: all 0.3s;
      filter: brightness(50%);
      cursor: pointer;
    }
    &:active {
      transform: scale(90%);
    }
  }
`;
