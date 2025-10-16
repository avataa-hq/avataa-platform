import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const MyInputStyled = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  border-radius: 10px;
  background-color: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant2};
  transition: all 0.3s;
  font-size: 14px;
  line-height: 17px;
  padding: 10px;

  &:focus-within {
    border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  }

  .MuiInputBase-input {
    padding: 0;
  }

  .text {
    width: 100%;
  }

  .icon {
    margin-left: 10px;
  }

  .expanded-input {
    width: 100%;
    transition: width 0.3s ease;
  }
`;
