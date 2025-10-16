import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { alpha } from '@mui/system';
import { Box } from '6_shared';

export const Title = styled(Box)`
  margin: 0;
  padding: 20px;
  width: 230px;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
`;

export const Content = styled(Box)`
  display: flex;
  justify-content: center;
  height: 100%;
`;

export const Panel = styled(Box)`
  flex-direction: column;
  /* flex-basis: 50%; */
  width: 50%;
  box-sizing: border-box;
  border-color: ${(props) => props.theme.palette.neutralVariant.outline};
  height: 100%;
`;

export const PanelTitle = styled(Box)`
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 25px;
  height: 2rem;
  font-weight: 300;
  background: ${(props) => alpha(props.theme.palette.neutral.surfaceContainer, 0.5)};
  line-height: 2rem;
  cursor: default;
`;

export const PanelContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100% - 5rem);
`;

export const PanelManagementContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  background-color: transparent;
`;

export const PanelListContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: flex-start;
  overflow-y: auto;
`;

export const PanelManagementInput = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  border-radius: 10px;

  &:hover {
    border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  }

  &:focus-within {
    outline: none !important;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
`;

export const ButtonAdd = styled(Button)`
  min-width: 41px;
  max-height: 41px;
  height: 41px;
  width: 41px;
  border-radius: 10px;
  transition: all 0.3s;
`;
