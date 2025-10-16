import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const CustomSearchStyled = styled(Box)`
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 41px;
  width: 100%;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  border-radius: 10px;
  transition: all 0.3s;
  font-size: 14px;
  line-height: 17px;
  padding: 10px;

  MuiInputBase-input &:hover {
    border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  }

  &:focus-within {
    border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  }

  .MuiInputBase-input {
    padding: 0;
  }

  .text {
    flex-basis: 75%;
    margin-left: 0 10px;
  }

  .icon {
    margin-left: 10px;
  }
`;

export const SearchListContainer = styled(Box)`
  z-index: 2;
  position: absolute;
  top: 10%;
  width: calc(100% - 10%);
  display: flex;
  flex-direction: column;
  max-height: 50%;
  font-size: 14px;
  line-height: 17px;
  padding: 10px;
  backdrop-filter: blur(25px);
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  background: ${(props) => props.theme.palette.background.default};
  overflow-y: auto;
  transition: all 0.3s;
  animation: openDataListContainer 0.3s ease-out forwards;

  @keyframes openDataListContainer {
    0% {
      max-height: 0%;
    }
    100% {
      max-height: 50%;
    }
  }
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: ${(props) => props.theme.palette.text.primary};
`;

export const NoResultItem = styled(Typography)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 5%;
  height: 35px;
  color: ${(props) => props.theme.palette.text.primary};
  cursor: default;
`;

export const SearchedResultItemContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 2%;
  padding: 0 5%;
  min-height: 35px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.palette.action.hover};
  }
`;

export const SearchedResultItemName = styled(Typography)`
  width: 50%;
  color: ${(props) => props.theme.palette.text.primary};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
