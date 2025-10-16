import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const CronExpressionInputContainer = styled(Box)`
  * {
    color: ${({ theme }) => theme.palette.text.primary};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.875rem;
    line-height: 1.125rem;
  }

  .cronInput {
    .cronInsideInput {
      background-color: ${({ theme }) => theme.palette.neutral.surfaceContainerLowestVariant2};
      border-radius: 10px;
      border-color: ${({ theme }) => theme.palette.neutralVariant.outline};
    }

    .cronButtonUI {
      display: flex;
      align-items: center;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      border-color: ${({ theme }) => theme.palette.primary.main};
      background-color: ${({ theme }) => theme.palette.primary.main};
    }

    .cronButtonUi:hover,
    .btn-custom:hover {
      background-color: ${({ theme }) => theme.palette.primary.dark};
      border-color: ${({ theme }) => theme.palette.primary.dark};
    }
  }

  .modal {
    position: absolute;
    overflow: visible;

    .modal-content {
      border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
      border-radius: 20px;
      background: ${({ theme }) => theme.palette.neutral.surfaceContainerLowestVariant1};
      backdrop-filter: blur(50px);
      box-shadow: ${({ theme }) => theme.shadows[10]};

      .nav > li > a:focus,
      .nav > li > a:hover {
        background-color: ${({ theme }) => theme.palette.action.hover};
      }

      .nav-tabs {
        border-bottom-color: transparent;
      }

      .nav-tabs > li.active > a,
      .nav-tabs > li.active > a:focus,
      .nav-tabs > li.active > a:hover {
        color: ${({ theme }) => theme.palette.text.secondary};
        background-color: ${({ theme }) => theme.palette.action.selected};
        border-color: transparent;
      }

      .nav-link {
        border-bottom-color: transparent;
      }

      .form-control {
        box-shadow: none;
      }

      .inputCronMsg {
        color: ${({ theme }) => theme.palette.text.secondary};
      }

      input,
      select {
        background-color: ${({ theme }) => theme.palette.neutral.surfaceContainerLowestVariant2};
        color: ${({ theme }) => theme.palette.text.primary};
        border-radius: 10px;
        border-color: ${({ theme }) => theme.palette.neutralVariant.outline};
      }

      select > option {
        background-color: ${({ theme }) => theme.palette.background.default};
        color: ${({ theme }) => theme.palette.text.primary};
      }

      input[type='radio'] {
        border-color: ${({ theme }) => theme.palette.text.secondary};
      }

      input[type='radio']:checked:after {
        top: 0 !important;
        left: 0 !important;
      }

      .tab-content {
        .panel,
        .panel-default {
          background-color: ${({ theme }) => theme.palette.background.paper};
          border-color: ${({ theme }) => theme.palette.neutralVariant.outline};
          box-shadow: none;

          .panel-heading {
            background-color: ${({ theme }) => theme.palette.background.default};
            border-color: ${({ theme }) => theme.palette.neutralVariant.outline};
          }
        }
      }
    }
  }

  .nav-link {
    cursor: pointer;
  }
`;
