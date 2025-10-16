import { Button, CircularProgress, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslate, parameterTypesApi, getErrorMessage, useSettingsObject } from '6_shared';
import { enqueueSnackbar } from 'notistack';
import {
  HeaderInTheMiddle,
  HorizontalContainer,
  ModalTitleWithoutCloseIcon,
  ObjectAndParamTypeModalStyled,
  SmallContent,
  ParamOrObjName,
} from '../ObjectAndParamTypeModal.styled';

const { useDeleteParamTypeMutation } = parameterTypesApi;

const DeleteParamTypeModal = () => {
  const translate = useTranslate();

  const { isDeleteParamModalOpen, paramType, objType, setIsDeleteParamModalOpen } =
    useSettingsObject();

  const [deleteParamType, { isLoading }] = useDeleteParamTypeMutation();

  const onDeleteParamType = async () => {
    try {
      await deleteParamType(paramType?.id!).unwrap();
      setIsDeleteParamModalOpen(false);
      enqueueSnackbar(translate('Parameter deleted successfully'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const onModalClose = () => {
    setIsDeleteParamModalOpen(false);
  };

  return (
    <ObjectAndParamTypeModalStyled open={isDeleteParamModalOpen} onClose={onModalClose}>
      {!objType?.primary.includes(paramType?.id!) && (
        <HeaderInTheMiddle>
          <ModalTitleWithoutCloseIcon>
            {translate('Do you really want to delete')}{' '}
            <ParamOrObjName>{paramType?.name}</ParamOrObjName>,{' '}
            {translate('because this can lead to irreversible data loss?')}
          </ModalTitleWithoutCloseIcon>
        </HeaderInTheMiddle>
      )}

      <SmallContent>
        {objType?.primary.includes(paramType?.id!) && (
          <Typography width="100%" textAlign="center" marginBottom="20px">
            {translate('You cannot delete parameter type')}{' '}
            <ParamOrObjName>{paramType?.name}</ParamOrObjName>{' '}
            {translate('because it is a Primary for object type')}{' '}
            <ParamOrObjName>{objType.name}</ParamOrObjName>!
          </Typography>
        )}

        <HorizontalContainer>
          <Button variant="outlined" sx={{ width: '100px' }} onClick={onModalClose}>
            {translate('Back')}
          </Button>
          <LoadingButton
            disabled={objType?.primary.includes(paramType?.id!)}
            loadingIndicator={<CircularProgress color="primary" size={23} />}
            loading={isLoading}
            variant="contained"
            sx={{ width: '100px', transition: 'all 0.3s' }}
            onClick={onDeleteParamType}
          >
            {translate('Delete')}
          </LoadingButton>
        </HorizontalContainer>
      </SmallContent>
    </ObjectAndParamTypeModalStyled>
  );
};

export default DeleteParamTypeModal;
