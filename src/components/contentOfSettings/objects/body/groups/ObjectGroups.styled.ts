import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';
import { Typography } from '@mui/material';

import { Box } from '6_shared';

export const ObjectGroupsStyled = styled(Box)`
  width: 30%;
  min-width: 200px;
  border-right: 1px solid ${(props) => props.theme.palette.neutral.surfaceContainer};
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowVariant1};

  .group-list {
    height: calc(100vh - 108px);
    overflow: auto;
  }

  .loading-text {
    text-align: center;
    padding: 20px;
  }

  .group-item {
    transform: translate(0%);
    animation: an_grp 0.3s forwards;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    @keyframes an_grp {
      0% {
        transform: translate(-30%);
      }
      100% {
        transform: translate(0%);
      }
    }

    &__btn {
      padding: 4px 20px;

      &:hover {
        background: ${(props) => alpha(props.theme.palette.primary.dark, 0.12)};
      }
    }

    &__btn--active {
      padding: 4px 20px;
      color: ${(props) => props.theme.palette.primary.main};

      &:hover {
        background: ${(props) => alpha(props.theme.palette.primary.dark, 0.12)};
      }
    }
  }
`;

export const ListItemContainer = styled(Box)`
  display: flex;
  justify-content: start;
  gap: 6px;
  width: 100%;
`;

export const GroupName = styled(Typography)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const GroupCount = styled(Typography)``;
