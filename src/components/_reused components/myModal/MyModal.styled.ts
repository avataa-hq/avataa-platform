import styled from '@emotion/styled';
import { Modal } from '@mui/material';

const MyModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    display: flex;
    border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
    border-radius: 20px;
    background: ${(props) => props.theme.palette.neutral.surfaceContainerLowVariant1};
    backdrop-filter: blur(50px);
    padding: 20px;
    flex-direction: column;
    align-items: center;
    position: relative;

    &.small {
      width: 30%;
      height: 30%;
    }

    &.medium {
      width: 50%;
      height: 60%;
    }

    &.large {
      width: 80%;
      height: 90%;
    }

    &.square {
      width: 500px;
      height: 500px;
    }

    .close_btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }
  }
`;

export default MyModalStyled;
