import styled from '@emotion/styled';
import { alpha } from '@mui/system';

const SettingsObjectsStyled = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;

  .objects-page {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .hierarchies__container {
    display: flex;
    flex-direction: column;
  }

  .hierarchy__main-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-left: 6px;
    /* margin-bottom: 15px; */
    height: 32px;
    transition: all 0.3s;
    animation: anim_main-container 0.3s forwards;

    &--active {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    }

    @keyframes anim_main-container {
      0% {
        transform: translate(-100px);
      }

      100% {
        transform: translate(0);
      }
    }

    &:hover {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    }

    .hierarchy_icon {
      display: none;
      margin-right: 12px;
      cursor: pointer;
    }

    &:hover {
      .hierarchy_icon {
        display: block;
      }
    }
  }

  .hierarchy__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-left: 6px;
    margin-bottom: 15px;
    height: 32px;
    transition: all 0.3s;
    animation: anim_container 0.7s forwards;

    @keyframes anim_container {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 100;
      }
    }

    &:hover {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    }

    .hierarchy_icon-edit {
      display: none;
      margin-right: 12px;
      cursor: pointer;
    }

    &:hover {
      .hierarchy_icon-edit {
        display: block;
      }
    }

    .hierarchy_icon-delete {
      display: none;
      margin-right: 12px;
      cursor: pointer;
    }

    &:hover {
      .hierarchy_icon-delete {
        display: block;
      }
    }
  }

  .hierarchy__name {
    margin-left: 10px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.2px;
    cursor: pointer;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
  }

  .hierarchy__name--active {
    margin-left: 10px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.2px;
    color: ${(props) => props.theme.palette.primary.main};
    cursor: pointer;
  }
`;

export default SettingsObjectsStyled;
