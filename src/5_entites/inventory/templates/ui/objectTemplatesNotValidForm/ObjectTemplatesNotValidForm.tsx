import { useMemo, useState } from 'react';
import {
  Box,
  CenteredBox,
  DeleteIcon,
  INotValidParamWithObjectType,
  IObjectTemplateParameterModel,
  LoadingAvataa,
} from '6_shared';
import {
  useDeleteTemplateObjectParameter,
  useGetParamTypeById,
  useUpdateTemplateParameter,
} from '5_entites/inventory/api';
import { useFormContext } from 'react-hook-form';
import { ParameterComponents } from '5_entites/inventory/ui';
import { Divider, IconButton, TextField, Typography } from '@mui/material';
import { ITemplateParam, NOT_VALID_TEMPLATE_FORM_ID } from '../../model';

interface IProps {
  notValidTemplateParams: INotValidParamWithObjectType[];
  onCloseNotValidModal: () => void;
}

export const ObjectTemplatesNotValidForm = ({
  notValidTemplateParams,
  onCloseNotValidModal,
}: IProps) => {
  const { handleSubmit, reset } = useFormContext();

  const [currentIndex, setCurrentIndex] = useState(0);

  const { updateTemplateObjectParameterFn, isLoading: isUpdateLoading } =
    useUpdateTemplateParameter();
  const { deleteTemplateObjectParameterFn, isLoading: isDeleteLoading } =
    useDeleteTemplateObjectParameter();

  const { currentParamByIndex, objectTypeName } = useMemo(() => {
    const paramByIndex = notValidTemplateParams?.[currentIndex]?.param;
    const tmoName = notValidTemplateParams?.[currentIndex]?.objectTypeName;

    return { currentParamByIndex: paramByIndex, objectTypeName: tmoName };
  }, [notValidTemplateParams, currentIndex]);

  const { paramTypeData, isParamTypeFetching } = useGetParamTypeById({
    tprmId: currentParamByIndex?.parameter_type_id || 0,
    skip: !currentParamByIndex?.parameter_type_id,
  });

  const isLoading = isParamTypeFetching || isUpdateLoading || isDeleteLoading;

  const param = useMemo(() => {
    if (!currentParamByIndex || !paramTypeData) return null;

    const currentParam: ITemplateParam = {
      ...paramTypeData,
      templateParamId: currentParamByIndex?.id,
      tprm_id: currentParamByIndex.id,
      value: currentParamByIndex.value,
      expanded: false,
      showExpandButton: false,
      mo_id: 0,
      prm_id: null,
      required: false,
      primary: false,
    };

    return currentParam;
  }, [currentParamByIndex, paramTypeData]);

  const goToNextParam = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= notValidTemplateParams.length - 1) {
        onCloseNotValidModal();
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const onFormSubmit = async (data: Record<string, any>) => {
    if (!param || !param.templateParamId || !data[param.tprm_id.toString()]) return;

    await updateTemplateObjectParameterFn({
      parameter_id: param.templateParamId,
      parameter_type_id: param.id,
      value: data[param.tprm_id.toString()],
      required: param?.required,
      constraint: param?.constraint || undefined,
    });

    reset();
    goToNextParam();
  };

  const onDeleteTemplateParamClick = async (templateParam: IObjectTemplateParameterModel) => {
    await deleteTemplateObjectParameterFn(templateParam.id);
    goToNextParam();
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      id={NOT_VALID_TEMPLATE_FORM_ID}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      {isLoading && (
        <CenteredBox>
          <LoadingAvataa />
        </CenteredBox>
      )}
      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Typography>{objectTypeName || ''}</Typography>
          <Divider />

          {!param && !paramTypeData && (
            <Box>
              <Typography>
                Parameter type was deleted, you need to delete it from the template
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                <TextField value={currentParamByIndex?.value} disabled fullWidth />
                <IconButton onClick={() => onDeleteTemplateParamClick(currentParamByIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {param && (
            <Box>
              <Typography>{param.name}</Typography>
              <ParameterComponents
                key={param.templateParamId}
                param={param}
                showDeleteButton={false}
                isEdited
                customNotMultipleWrapperSx={{ width: '100%' }}
                customMultipleWrapperSx={{ width: '100%' }}
                testid={`object-templates-not-valid-form__${param.name}`}
              />
            </Box>
          )}
        </Box>
      )}
    </form>
  );
};
