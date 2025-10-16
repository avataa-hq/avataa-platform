import styled from '@emotion/styled';
import { Box } from '@mui/material';

const SettingsObjectsHeadStyled = styled(Box)`
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    position: relative;
    z-index: 2;

    &__text {
      margin: 0;
      font-style: normal;
      font-weight: 600;
      font-size: 1.125rem;
      line-height: 1.325rem;
      overflow: hidden;
    }

    &__icon {
      color: ${(props) => props.theme.palette.neutralVariant.icon};
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        cursor: pointer;
        color: ${(props) => props.theme.palette.primary.main};
      }
    }
  }
`;

export default SettingsObjectsHeadStyled;
