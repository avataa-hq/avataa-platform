import { Typography } from '@mui/material';
import { useSettingsObject, useTranslate } from '6_shared';
import { dateTransform } from '../../utilities/dateTransform';
import {
  SmallContent,
  Header,
  InputContainer,
  InputTitle,
  ModalClose,
  ModalTitle,
  ObjectAndParamTypeModalStyled,
} from '../ObjectAndParamTypeModal.styled';

const ShowObjectTypeInfoModal = () => {
  const translate = useTranslate();

  const { objType, isShowObjectModalOpen, setIsShowObjectModalOpen } = useSettingsObject();

  const onModalClose = () => {
    setIsShowObjectModalOpen(false);
  };

  return (
    <ObjectAndParamTypeModalStyled open={isShowObjectModalOpen} onClose={onModalClose}>
      <Header>
        <ModalTitle>{translate('Object information')}</ModalTitle>
        <ModalClose onClick={onModalClose} />
      </Header>

      <SmallContent>
        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Name')}</InputTitle>
          <Typography fontWeight="400">{objType?.name}</Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Created by')}</InputTitle>
          <Typography fontWeight="400">
            {objType?.created_by === '' ? '-' : objType?.created_by}
          </Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Date of creation')}</InputTitle>
          <Typography fontWeight="400">
            {objType?.creation_date === undefined ? '-' : dateTransform(objType?.creation_date)}
          </Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Modified by')}</InputTitle>
          <Typography fontWeight="400">
            {objType?.modified_by === '' ? '-' : objType?.modified_by}
          </Typography>
        </InputContainer>

        <InputContainer>
          <InputTitle>{translate('Date of modification')}</InputTitle>
          <Typography fontWeight="400">
            {objType?.modification_date === undefined
              ? null
              : dateTransform(objType?.modification_date)}
          </Typography>
        </InputContainer>
      </SmallContent>
    </ObjectAndParamTypeModalStyled>
  );
};

export default ShowObjectTypeInfoModal;
