import styled from '@emotion/styled';
import { Box } from '@mui/material';

const SettingsObjectsHeadStyled = styled(Box)`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    display: flex;
    gap: 8px;
    align-items: center;

    &__text {
      margin: 0;
      padding-left: 20px;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      overflow: hidden;
    }

    &__icon {
      cursor: pointer;
      transition: all 0.3s;
      color: ${({ theme }) => theme.palette.neutralVariant.icon};

      &:hover {
        cursor: pointer;
        color: ${(props) => props.theme.palette.primary.main};
      }
    }
  }

  .navigation {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    margin-right: 40px;

    &__btn {
      width: 41px;
      height: 41px;
      min-height: 41px;
      min-width: 41px;
      border-radius: 10px;
    }
  }
`;

export default SettingsObjectsHeadStyled;
