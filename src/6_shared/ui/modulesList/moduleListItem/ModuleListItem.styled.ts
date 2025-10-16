import { styled } from '@mui/material';

// const slideIn = keyframes({
//   '0%': {
//     transform: 'translateX(-100%)',
//   },
//   '100%': {
//     transform: 'translateX(0)',
//   },
// });

export const ModuleListItemStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
  cursor: pointer;
  transition: transform 0.3s;
  width: 100%;

  &:hover {
    color: ${({ theme }) => theme.palette.components.sidebar.activeText};
  }
`;

export const IconContainer = styled('div')`
  width: 30px;
  display: flex;
  justify-content: start;
  align-items: start;
`;

export const TitleContainer = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 30px);
`;

export const GroupIconContainer = styled('div')`
  //display: flex;
  //align-items: center;
  //justify-content: center;
`;
