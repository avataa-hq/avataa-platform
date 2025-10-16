import styled from '@emotion/styled';
import {
  Box,
  List,
  ListItemButton as MuiListItemButton,
  ListItemText as MuiListItemText,
} from '@mui/material';

export const ItemTreeListContainer = styled(List)`
  label: ItemTreeListContainer;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ListItemButtonActions = styled(Box)`
  label: ListItemButtonActions;
  display: flex;
  gap: 5px;

  & .MuiSvgIcon-root {
    opacity: 0;
    color: ${({ theme }) => theme.palette.neutralVariant.icon};
  }

  & .MuiSvgIcon-root:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const ListItemButton = styled(MuiListItemButton)`
  label: ListItemButton;
  padding: 5px 20px;

  &:hover ${ListItemButtonActions} .MuiSvgIcon-root {
    opacity: 1;
  }
`;

export const ListItemText = styled(MuiListItemText)`
  .MuiTypography-root {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
