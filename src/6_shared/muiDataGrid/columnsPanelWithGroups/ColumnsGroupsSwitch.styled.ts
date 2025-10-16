import styled from '@emotion/styled';
import { Box } from '6_shared';

export const ColumnsGroupsSwitchContainer = styled(Box)`
  display: flex;
`;

export const ColumnsGroupsSwitchBox = styled(Box)`
  border-radius: 20px;
  position: relative;
  //background: #74cee1;
  box-shadow: 1px 1px 2px rgb(165, 165, 165) inset;
  width: 100%;
`;

type ColumnsGroupsSwitchMaskProps = {
  subtype: 'columns' | 'groups';
  theme?: any;
};
export const ColumnsGroupsSwitchMask = styled(Box)<ColumnsGroupsSwitchMaskProps>`
  width: 50%;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.palette.primary.main};
  position: absolute;
  transition: all 0.5s ease;
  transform: translateX(${(props) => (props.subtype === 'columns' ? 0 : '100%')});
  .MuiButton-root {
    border-radius: 20px;
    width: 50%;
    height: 40px;
    font-weight: bold;
    transition: all 0.2s 0.1s ease;
  }
`;
