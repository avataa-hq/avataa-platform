import { Typography } from '@mui/material';
import { useSettingsObject, useTranslate } from '6_shared';
import { dateTransform } from '../../utilities/dateTransform';
import {
  DescriptionField,
  Header,
  InputContainer,
  InputTitle,
  ModalClose,
  ModalTitle,
  ObjectAndParamTypeModalStyled,
  SmallContent,
} from '../ObjectAndParamTypeModal.styled';

const ShowParamTypeModal = () => {
  const translate = useTranslate();

  const { paramType, isShowParamModalOpen, setIsShowParamModalOpen } = useSettingsObject();

  const onModalClose = () => {
    setIsShowParamModalOpen(false);
  };

  const setTypeOfValue = (valType: string | undefined): string => {
    if (valType === 'str') return 'string';
    if (valType === 'int') return 'integer';
    if (valType === 'float') return 'float';
    if (valType === 'bool') return 'boolean';
    if (valType === 'date') return 'date';
    if (valType === 'datetime') return 'datetime';
    if (valType === 'mo_link') return 'link to object';
    if (valType === 'prm_link') return 'link to param';
    if (valType === 'formula') return 'formula';
    if (valType === 'user_link') return 'link to user';
    return '-';
  };

  const checkGroup = (group: null | undefined | string): string => {
    if (group === undefined) return '-';
    if (group === null || group === '') return '_Blank';

    return group;
  };

  return (
    <ObjectAndParamTypeModalStyled open={isShowParamModalOpen} onClose={onModalClose}>
      <Header>
        <ModalTitle>{translate('Parameter information')}</ModalTitle>
        <ModalClose onClick={onModalClose} />
      </Header>

      <SmallContent>
        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Name')}</InputTitle>
          <Typography fontWeight="400">
            {paramType?.name === undefined || paramType?.name === '' ? '-' : paramType?.name}
          </Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Group')}</InputTitle>
          <Typography fontWeight="400">{checkGroup(paramType?.group)}</Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Type of value')}</InputTitle>
          <Typography fontWeight="400">{setTypeOfValue(paramType?.val_type)}</Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Created by')}</InputTitle>
          <Typography fontWeight="400">
            {paramType?.created_by === undefined || paramType?.created_by === ''
              ? '-'
              : paramType?.created_by}
          </Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Date of creation')}</InputTitle>
          <Typography fontWeight="400">
            {paramType?.creation_date === undefined ? '-' : dateTransform(paramType?.creation_date)}
          </Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Modified by')}</InputTitle>
          <Typography fontWeight="400">
            {paramType?.modified_by === undefined || paramType?.modified_by === ''
              ? '-'
              : paramType?.modified_by}
          </Typography>
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Date of modification')}</InputTitle>
          <Typography fontWeight="400">
            {paramType?.modification_date === undefined
              ? '-'
              : dateTransform(paramType?.modification_date)}
          </Typography>
        </InputContainer>

        <InputContainer>
          <InputTitle>{translate('Description')}</InputTitle>
          <Typography fontWeight="400">
            {paramType?.description === undefined ||
            paramType?.description === '' ||
            paramType?.description === null ? (
              '-'
            ) : (
              <DescriptionField multiline minRows={2} maxRows={4} value={paramType.description} />
            )}
          </Typography>
        </InputContainer>
      </SmallContent>
    </ObjectAndParamTypeModalStyled>
  );
};

export default ShowParamTypeModal;
