import { Box } from '6_shared';
import styled from '@emotion/styled';
import { TabList } from '@mui/lab';
import Tab from '@mui/material/Tab';

export const CreateObjectFeaturesBarStyled = styled(Box)`
  height: 100%;

  .MuiTabPanel-root {
    height: 100%;
    background: ${({ theme }) =>
      theme.palette.mode === 'light'
        ? theme.palette.neutral.surface
        : theme.palette.neutralVariant.outlineVariant30};

    &::-webkit-scrollbar {
      width: 6px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 50px;
    }
  }
`;

export const CreateObjectFeatureTabList = styled(TabList)`
  padding: 20px 20px 25px;
  height: 7%;
  align-items: center;
`;

export const CreateObjectFeaturesTab = styled(Tab)`
  padding: 0;
  margin-right: 10px;
  height: 17px;
  text-transform: none;
  font-weight: 600;

  &.Mui-selected {
    color: ${(props) => props.theme.palette.text.primary};
    font-weight: 600;
  }
`;

export const ObjectHistoryWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px 20px 30px;
`;

export const ObjectAttachmentsWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 20px 20px 30px;
`;
