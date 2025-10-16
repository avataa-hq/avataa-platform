import styled from '@emotion/styled';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Autocomplete,
  IconButton,
  Dialog,
  TextField,
  FormHelperText,
  Typography,
} from '@mui/material';

import { Box } from '6_shared';
import { LoadingButton } from '@mui/lab';
import { Close } from '@mui/icons-material';

export const ObjectAndParamTypeModalStyled = styled(Dialog)<any>`
  .MuiBackdrop-root {
    background-color: ${({ theme }) => theme.palette.neutral.backdrop};
  }

  .MuiPaper-root {
    display: flex;
    flex-direction: column;
    padding: 20px 15px 20px 30px;
    max-width: 100%;
    border-radius: 10px;
    background: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant1};
    backdrop-filter: blur(25px);
    opacity: 0;
    animation: object_type_modal_anim 0.3s forwards;

    @keyframes object_type_modal_anim {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-right: 15px;
`;

export const HeaderInTheMiddle = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const ModalTitle = styled(Typography)`
  width: 80%;
  font-size: 16px;
  font-weight: 700;
`;

export const ModalTitleWithoutCloseIcon = styled(Typography)`
  width: 100%;
  max-width: 300px;
  overflow: hidden;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  text-overflow: ellipsis;
`;

export const ParamOrObjName = styled('span')`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.palette.primary.main};
`;

export const ModalClose = styled(Close)<any>`
  cursor: pointer;
  transition: all 0.3s;
  font-size: 20px;

  &:hover {
    transform: scale(110%);
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

export const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px;
  width: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SmallContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const InputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 96%;
`;
export const StrInputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputTitle = styled(Typography)`
  margin-bottom: 4px;
`;

export const InputAutocomplete = styled(Autocomplete)`
  width: 100%;
`;

export const HorizontalContainer = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
`;

export const DescriptionField = styled(TextField)`
  width: 100%;
`;

export const ConstraintContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 96%;
`;

export const HorContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10%;
`;

export const CheckboxesSection = styled(Box)`
  display: flex;
  width: 100%;
`;

export const CheckboxesContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

export const Bottom = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: end;
  height: 50px;
  width: 100%;
`;

export const CreateButton = styled(LoadingButton)<any>`
  align-self: end;
  padding: 10px;
  margin-right: 15px;
  width: auto;
  height: 42px;
  border-radius: 50px;
  transition: all 0.3s;
  text-transform: none;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background: ${(props) => props.theme.palette.primary.main};
    transform: scale(105%);
  }

  &:active {
    transform: scale(95%);
  }
`;

export const ErrrorText = styled(FormHelperText)`
  height: 20px;
  color: ${({ theme }) => theme.palette.error.light};
  margin-left: 14px;
`;

export const IconContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ListMark = styled(Typography)`
  height: 40px;
  line-height: 40px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const DatePick = styled(DatePicker)`
  padding-bottom: 4px;
  width: 285px;
  margin-bottom: 10px;
`;

export const DateTimePick = styled(DateTimePicker)`
  padding-bottom: 4px;
  width: 285px;
  margin-bottom: 10px;
`;

export const ParamLinkFilterContainer = styled(Box)`
  opacity: 0;
  animation: anim_born 1s ease forwards 0.3s;
  @keyframes anim_born {
    100% {
      opacity: 1;
    }
  }
`;

export const Icon = styled(IconButton)`
  height: 40px;
  color: ${({ theme }) => theme.palette.neutralVariant.icon};
`;

export const Text = styled(Typography)`
  display: inline;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const TextWithColor = styled(Typography)`
  display: inline;
  font-size: 12px;
  margin-bottom: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const TitleText = styled(Typography)`
  display: inline;
  font-size: 16px;
  line-height: 16px;
`;

export const TitleTextWithColor = styled(Typography)`
  display: inline;
  font-size: 16px;
  line-height: 16px;
  text-decoration: underline;
  color: ${({ theme }) => theme.palette.primary.main};
`;
