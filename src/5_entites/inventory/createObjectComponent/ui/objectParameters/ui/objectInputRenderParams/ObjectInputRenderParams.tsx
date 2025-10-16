import { memo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IconButton, Tooltip, useTheme, alpha } from '@mui/material';
import { WarningRounded } from '@mui/icons-material';
import {
  ICreateTooltipTextProps,
  deleteObjectParameter,
  useDeleteObjectParameter,
} from '5_entites';
import {
  IInventoryObjectModel,
  IObjectComponentParams,
  Modal,
  useObjectCRUD,
  useTranslate,
} from '6_shared';
import { ObjectParametersInput } from '../objectParametersInput/ObjectParametersInput';
import * as SC from './ObjectInputRenderParams.styled';

interface IProps {
  params: IObjectComponentParams[];
  objectId: number | null;
  inventoryObjectData: IInventoryObjectModel | undefined;
  createTooltipText: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  handleParamsLoading: (loading: boolean) => void;
}

export const ObjectInputRenderParams = memo(
  ({ params, objectId, inventoryObjectData, createTooltipText, handleParamsLoading }: IProps) => {
    const theme = useTheme();
    const translate = useTranslate();
    const { clearErrors, setValue, getValues, unregister } = useFormContext();

    const { deleteObjectParameterFn } = useDeleteObjectParameter();

    const [paramToDelete, setParamToDelete] = useState<IObjectComponentParams | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
      objectCRUDComponentUi: { objectCRUDComponentMode },
    } = useObjectCRUD();

    const handleModalClose = () => {
      setIsModalOpen(false);
    };

    const handleDeleteObjectParameter = async (paramTypeId: string) => {
      const fieldValue = getValues(paramTypeId);

      await deleteObjectParameter({
        deleteObjectParameterFn,
        inventoryObjectData,
        objectId,
        paramTypeId: Number(paramTypeId),
        fieldValue,
      });

      setValue(paramTypeId, null);
    };

    const handleDeleteParamClick = () => {
      if (paramToDelete) {
        unregister(paramToDelete.id.toString());
      }

      if (paramToDelete !== null) {
        setValue(paramToDelete.id.toString(), null);
        clearErrors(paramToDelete.id.toString());

        const isParamCreated = inventoryObjectData?.params?.some(
          (param) => param.tprm_id === paramToDelete.id,
        );
        if (isParamCreated) {
          handleDeleteObjectParameter(paramToDelete.id.toString());
        }

        setIsModalOpen(false);
      }
    };

    return (
      <SC.ObjectInputRenderParamsStyled>
        {params.map((param: IObjectComponentParams) => (
          <SC.AccordionContent key={param.id.toString()}>
            <Tooltip
              title={createTooltipText({
                paramValType: param.val_type,
                paramConstraint: param.constraint,
              })}
              placement="right"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    boxShadow: `0px 4px 20px 0px ${alpha(theme.palette.text.primary, 0.15)}`,
                    borderRadius: '10px',
                  },
                },
              }}
            >
              <SC.Wrapper>
                <ObjectParametersInput param={param} handleParamsLoading={handleParamsLoading} />
              </SC.Wrapper>
            </Tooltip>

            <SC.ButtonWrapper>
              {param.value && !param?.primary && objectCRUDComponentMode !== 'creating' && (
                <IconButton
                  data-testid={`delete-button-${param.id.toString()}`}
                  onClick={() => {
                    setParamToDelete(param);
                    setIsModalOpen(true);
                  }}
                >
                  <SC.DeleteIconStyled />
                </IconButton>
              )}
            </SC.ButtonWrapper>
          </SC.AccordionContent>
        ))}

        <Modal open={isModalOpen} onClose={handleModalClose} width={350}>
          <SC.ModalHeader>
            <WarningRounded
              sx={{ fill: theme.palette.warning.main, width: '35px', height: '35px' }}
            />
            <SC.ModalTitle>
              {translate('Are you sure you want to delete attributes?')}
            </SC.ModalTitle>
          </SC.ModalHeader>

          <SC.ModalBody>
            <SC.ModalButton variant="outlined" onClick={handleModalClose}>
              {translate('Cancel')}
            </SC.ModalButton>
            <SC.ModalButton variant="contained" onClick={handleDeleteParamClick}>
              {translate('Delete')}
            </SC.ModalButton>
          </SC.ModalBody>
        </Modal>
      </SC.ObjectInputRenderParamsStyled>
    );
  },
);
