import { ActionTypes } from '6_shared';
import styled from '@emotion/styled';
import { Box, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const ObjectParametersStyled = styled(Box)`
  flex-basis: 70%;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  height: 38px;
  cursor: default;
  background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 0.5)};
`;

export const HeaderParameterTypeName = styled(Typography)`
  flex-basis: 40%;
  padding: 0 20px;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderParameterTypeIcon = styled(Typography)`
  flex-basis: 20%;
  padding: 0 20px;
  text-align: center;
  user-select: none;
`;

export const ParamTypesTable = styled(Box)`
  height: calc(100vh - 146px);
  overflow: auto;
`;

export const ParamTypeRow = styled(Box)`
  display: flex;
  align-items: center;
  height: 38px;
  cursor: default;
  opacity: 0;
  animation: parameter 2s forwards;

  @keyframes parameter {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100;
    }
  }

  &:nth-of-type(2n) {
    background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 0.3)};
  }

  &:hover {
    color: ${(props) => alpha(props.theme.palette.primary.main, 1)};
  }
`;

export const RowName = styled(Typography)`
  flex-basis: 40%;
  padding: 0 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RowIconContainer = styled(Box)`
  flex-basis: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RowIconInfo = styled(IconButton)<{ permissionsView: true | false }>`
  height: 38px;
  cursor: pointer;

  .MuiSvgIcon-root {
    color: ${({ theme, permissionsView }) =>
      permissionsView
        ? theme.palette.neutralVariant.icon
        : theme.palette.neutralVariant.iconDisabled};
  }
`;

export const RowIconEdit = styled(IconButton)<{ permissionsUpdate: true | false }>`
  height: 38px;
  cursor: pointer;

  .MuiSvgIcon-root {
    color: ${({ theme, permissionsUpdate }) =>
      permissionsUpdate
        ? theme.palette.neutralVariant.icon
        : theme.palette.neutralVariant.iconDisabled};
  }
`;

export const RowIconDelete = styled(IconButton)<{ permissionsUpdate: true | false }>`
  height: 38px;
  cursor: pointer;

  .MuiSvgIcon-root {
    color: ${({ theme, permissionsUpdate }) =>
      permissionsUpdate
        ? theme.palette.neutralVariant.icon
        : theme.palette.neutralVariant.iconDisabled};
  }
`;
