import styled from '@emotion/styled';
import { Box } from '@mui/system';
import { BoxProps } from '@mui/material';
import { TransitionStatus } from 'react-transition-group';
import { keyframes, css } from '@emotion/react';

export const TableSettingsStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;
export const Body = styled(Box)``;

export const SettingsControl = styled(Box)`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

interface ICreateNewSettingContainerProps extends BoxProps {
  status?: Partial<TransitionStatus>;
}

const fadeInFilter = () => keyframes`
  0% { height: 0; padding: 0; }
  100% { height: 150px; padding: 10px 0; }
`;

const fadeOutFilter = () => keyframes`
  0% { height: 150px; padding: 10px 0; }
  100% { height: 0; padding: 0; }
`;
export const CreateNewSettingContainer = styled(Box)<ICreateNewSettingContainerProps>`
  width: 100%;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.status === 'entered' &&
    css`
      animation: 0.3s ease forwards ${fadeInFilter()};
    `}

  ${(props) =>
    props.status === 'exiting' &&
    css`
      animation: 0.3s ease-out forwards ${fadeOutFilter()};
    `}
`;
