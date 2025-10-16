import { styled } from '@mui/material';
import Tab from '@mui/material/Tab';
import { TabList } from '@mui/lab';
import { TABS_PANEL_HEIGHT } from '../../../constants';

export const TabsContainer = styled('div')`
  display: flex;
  //flex: 1;
  width: 100%;
  border-radius: 20px;
  justify-content: space-between;
  align-items: center;
  height: ${TABS_PANEL_HEIGHT}px;
  box-shadow: -10px 10px 10px -10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const TabsListStyled = styled(TabList)`
  border-color: ${({ theme }) => theme.palette.neutralVariant.onSurfaceVariant10};
`;

export const TabsContainerSlot = styled('div')``;

export const TabLabel = styled('div')`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TabStyled = styled(Tab)`
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: none;
  }
`;
