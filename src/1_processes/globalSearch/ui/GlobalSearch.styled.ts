import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface IGlobalSearchStyledProps extends BoxProps {
  state: 'expanded' | 'collapsed';
}

export const GlobalSearchStyled = styled(Box)<IGlobalSearchStyledProps>`
  position: relative;
  width: ${({ state }) => (state === 'collapsed' ? '60px' : '300px')};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;

  transition: width 0.3s;
`;

export const InputContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const Sphere = styled(Box)`
  position: relative;
  left: 50%;
  top: 50%;
  height: 90%;
  transform: translate(-50%, -50%);
  aspect-ratio: 1 / 1;
  cursor: pointer;
  transition: all 0.3s;

  &::after {
    content: '';
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: 100%;
    border-radius: 50%;
    color: ${(props) => props.theme.palette.primary.main};
    background: ${({ theme }) =>
      `radial-gradient(96% 96% at 70.4% 31.2%, ${theme.palette.primary.light} 0%, rgba(0, 2, 16, 0) 100%), ${theme.palette.primary.main}`};
    box-shadow: ${({ theme }) =>
      `0px 4px 80px ${theme.palette.primary.light}, inset 0px 2px 10px rgba(255, 255, 255, 0.58), inset 10px 20px 50px ${theme.palette.primary.light}`};
  }

  &::before {
    content: '';
    z-index: 1;
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 12%;
    border-radius: 50px;
    background: ${({ theme }) =>
      `radial-gradient(96% 96% at 70.4% 31.2%, ${theme.palette.primary.light} 0%, rgba(0, 2, 16, 0) 100%), ${theme.palette.primary.main}`};
    box-shadow: ${({ theme }) =>
      `0px 4px 80px ${theme.palette.primary.light}, inset 0px 2px 10px rgba(255, 255, 255, 0.58), inset 10px 20px 50px ${theme.palette.primary.light}`};
  }
`;

export const MiniSphere1 = styled(Box)`
  position: absolute;
  bottom: 10%;
  left: 5%;
  height: 15%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  color: ${(props) => props.theme.palette.primary.main};
  background: ${({ theme }) =>
    `radial-gradient(96% 96% at 70.4% 31.2%, ${theme.palette.primary.light} 0%, rgba(0, 2, 16, 0) 100%), ${theme.palette.primary.main}`};
  box-shadow: ${({ theme }) =>
    `0px 4px 80px ${theme.palette.primary.light}, inset 0px 2px 10px rgba(255, 255, 255, 0.58), inset 10px 20px 50px ${theme.palette.primary.light}`};
`;

export const MiniSphere2 = styled(Box)`
  position: absolute;
  top: 10%;
  right: 10%;
  height: 15%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  color: ${(props) => props.theme.palette.primary.main};
  background: ${({ theme }) =>
    `radial-gradient(96% 96% at 70.4% 31.2%, ${theme.palette.primary.light} 0%, rgba(0, 2, 16, 0) 100%), ${theme.palette.primary.main}`};
  box-shadow: ${({ theme }) =>
    `0px 4px 80px ${theme.palette.primary.light}, inset 0px 2px 10px rgba(255, 255, 255, 0.58), inset 10px 20px 50px ${theme.palette.primary.light}`};
`;
