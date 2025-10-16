import { useState } from 'react';
import { Button, CircularProgress, FormControlLabel, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Box, useTranslate, objectTypesApi, getErrorMessage, useSettingsObject } from '6_shared';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import { enqueueSnackbar } from 'notistack';
import {
  SmallContent,
  HeaderInTheMiddle,
  ModalTitleWithoutCloseIcon,
  HorizontalContainer,
  ObjectAndParamTypeModalStyled,
} from '../ObjectAndParamTypeModal.styled';

const { useDeleteObjectTypeMutation } = objectTypesApi;

interface IProps {
  hasTemplates: boolean;
}

const DeleteObjectTypeModal = ({ hasTemplates }: IProps) => {
  const translate = useTranslate();
  const [deleteChilds, setDeleteChilds] = useState(false);

  const { isDeleteObjectModalOpen, objType, setIsDeleteObjectModalOpen, setObjType } =
    useSettingsObject();

  const onModalClose = () => {
    setIsDeleteObjectModalOpen(false);
  };

  const [deleteInventoryObjectType, { isLoading }] = useDeleteObjectTypeMutation();

  const deleteObjectType = async () => {
    const tmoId = objType?.id;
    setObjType(null);
    try {
      await deleteInventoryObjectType({ id: tmoId!, delete_childs: deleteChilds }).unwrap();
      setIsDeleteObjectModalOpen(false);
      enqueueSnackbar(translate('Object type deleted successfully'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <ObjectAndParamTypeModalStyled open={isDeleteObjectModalOpen} onClose={onModalClose}>
      <HeaderInTheMiddle>
        <Box
          component="div"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <ModalTitleWithoutCloseIcon>{`Delete ${objType?.name}?`}</ModalTitleWithoutCloseIcon>
          <FormControlLabel
            sx={{ mb: '10px' }}
            control={
              <CheckBoxCustom
                sx={{ p: '4px', marginX: 1.1 }}
                checked={deleteChilds}
                onChange={(event) => setDeleteChilds(event.target.checked)}
              />
            }
            label={translate('Do you want to remove child elements?')}
          />

          {hasTemplates && (
            <Typography>
              {translate('This object type has templates, they will be deleted')}.
            </Typography>
          )}
        </Box>
      </HeaderInTheMiddle>

      <SmallContent>
        <HorizontalContainer>
          <Button variant="outlined" sx={{ width: '100px' }} onClick={onModalClose}>
            {translate('Back')}
          </Button>
          <LoadingButton
            loadingIndicator={<CircularProgress color="primary" size={23} />}
            loading={isLoading}
            variant="contained"
            sx={{ width: '100px', transition: 'all 0.3s' }}
            onClick={deleteObjectType}
          >
            {translate('Delete')}
          </LoadingButton>
        </HorizontalContainer>
      </SmallContent>
    </ObjectAndParamTypeModalStyled>
  );
};

export default DeleteObjectTypeModal;
