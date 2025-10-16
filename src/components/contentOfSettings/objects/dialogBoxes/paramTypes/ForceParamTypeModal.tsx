import { CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslate, parameterTypesApi, getErrorMessage, useSettingsObject } from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  HeaderInTheMiddle,
  HorizontalContainer,
  ModalTitleWithoutCloseIcon,
  ObjectAndParamTypeModalStyled,
  SmallContent,
} from '../ObjectAndParamTypeModal.styled';

const { useGetObjectTypeParamTypesQuery, useUpdateParamTypeMutation, useUpdateValTypeMutation } =
  parameterTypesApi;

const ForceParamTypeModal = () => {
  const translate = useTranslate();

  const [editProduct, { isLoading }] = useUpdateParamTypeMutation();
  const [changeValType] = useUpdateValTypeMutation();

  const {
    isForceModalOpen,
    paramType,
    paramTypeDataAtTheStartEditing,
    paramState,
    objType,
    isChangedTypeInValueWithColorPalete,
    setIsChangedTypeInValueWithColorPalete,
    setIsEditParamModalOpen,
    setIsForceModalOpen,
    setParamState,
    setParamType,
  } = useSettingsObject();

  const { data: paramTypes = [] } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    {
      skip: !objType?.id,
    },
  );

  useEffect(() => {
    if (!paramTypes) return;

    const prm = paramTypes.filter((p) => p.id === paramTypeDataAtTheStartEditing?.id);

    setParamType(prm[0]);
  }, [paramTypes, paramTypeDataAtTheStartEditing?.id]);

  const setConstraint = () => {
    if (paramState?.type === 'str' && paramState?.constraint) return paramState?.regex;
    if (paramState?.type === 'int' && paramState?.constraint)
      return `${paramState?.intMin}:${paramState?.intMax}`;
    if (paramState?.type === 'float' && paramState?.constraint)
      return `${paramState?.floatMin}:${paramState?.floatMax}`;
    if (paramState?.type === 'mo_link' && paramState?.objLink) return paramState?.objLink.id;
    if (paramState?.type === 'prm_link' && paramState?.paramLink) return paramState?.paramLink.id;
    if (paramState?.type === 'sequence') return paramState?.sequenceConstraint?.id || null;
    if (paramState?.type === 'formula') return paramState?.formula;
    if (paramState?.type === 'two-way link') return paramState?.tmoWayMoLink?.id;
    if (paramState?.type === 'enum')
      return `[${paramState?.enumConstraint.map((item) => `'${item}'`).join(',')}]`;

    return null;
  };

  const refusalToChangeForValueWithColorPallete = () => {
    setIsChangedTypeInValueWithColorPalete(false);
    setParamState({ ...paramState, type: paramTypeDataAtTheStartEditing?.val_type });
    setIsForceModalOpen(false);
  };

  const refusalToChange = async () => {
    if (paramType?.val_type !== paramTypeDataAtTheStartEditing?.val_type) {
      const changeValTypeRequestBody = {
        val_type: paramTypeDataAtTheStartEditing?.val_type ?? 'str',
        force: true,
        field_value: paramState?.fieldValue,
      };

      const changeValTypeRequestBodyWithVersion = {
        ...changeValTypeRequestBody,
        version: paramType?.version ?? 0,
      };
      const changeValTypeRequest = { id: paramType?.id!, ...changeValTypeRequestBodyWithVersion };
      const changeType = changeValType(changeValTypeRequest).unwrap;
      await changeType();
    }
    setIsForceModalOpen(false);
  };

  const consentToChangeForValueWithColorPallete = () => {
    setIsForceModalOpen(false);
  };

  const consentToChange = async () => {
    const editedFields: Record<string, any> = { force: true };

    // name check
    if (paramState.name !== paramType?.name) {
      editedFields.name = paramState.name;
    }
    // description check
    if (paramState.description !== paramType?.description) {
      editedFields.description = paramState.description;
    }
    // required check
    if (paramState.required !== paramType?.required) {
      editedFields.required = paramState.required;
    }
    // searchable check
    if (paramState.searchable !== paramType?.searchable) {
      editedFields.searchable = paramState.searchable;
    }
    // returnable check
    if (paramState.returnable !== paramType?.returnable) {
      editedFields.returnable = paramState.returnable;
    }
    // automation check
    if (paramState.automation !== paramType?.automation) {
      editedFields.automation = paramState.automation;
    }
    // group check
    if (paramState.group !== paramType?.group) {
      editedFields.group = paramState.group;
    }
    // fieldValue check
    if (paramState.fieldValue) {
      editedFields.field_value = paramState.fieldValue;
    }
    // constraint check
    if (setConstraint() !== paramType?.constraint) {
      editedFields.constraint = setConstraint()?.toString();
    }
    // prm_link_filter check
    if (paramState.type === 'prm_link') {
      if (!paramState.internalPrmLinkFilter && !paramState.externalPrmLinkFilter) {
        editedFields.prm_link_filter = null;
      }
      if (paramState.internalPrmLinkFilter && paramState.externalPrmLinkFilter) {
        editedFields.prm_link_filter = `${paramState.internalPrmLinkFilter.id}:${paramState.externalPrmLinkFilter.id}`;
      }
    }

    const changeValTypeRequestBody = {
      val_type: paramState.type,
      force: true,
      field_value: paramState.fieldValue,
    };

    if (paramState.type === paramType?.val_type) {
      const editParamTypeRequestBodyWithVersion = {
        ...editedFields,
        version: paramType?.version,
      };
      const editParamTypeRequest = { id: paramType?.id, ...editParamTypeRequestBodyWithVersion };

      try {
        await editProduct(editParamTypeRequest).unwrap();
        enqueueSnackbar(translate('Parameter type changed successfully'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    }

    if (paramState.type !== paramType?.val_type) {
      const changeValTypeRequestBodyWithVersion = {
        ...changeValTypeRequestBody,
        version: paramType?.version ?? 0,
      };
      const changeValTypeRequest = { id: paramType?.id!, ...changeValTypeRequestBodyWithVersion };
      await changeValType(changeValTypeRequest);

      const editParamTypeRequestBodyWithVersion = {
        ...editedFields,
        version: (paramType?.version ?? 0) + 1,
      };
      const editParamTypeRequest = { id: paramType?.id!, ...editParamTypeRequestBodyWithVersion };

      try {
        await editProduct(editParamTypeRequest).unwrap();
        enqueueSnackbar(translate('Parameter type changed successfully'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    }
    setIsForceModalOpen(false);
    setIsEditParamModalOpen(false);

    setParamType(null);

    setParamState({
      name: '',
      isErrorName: false,
      errorNameMessage: ' ',
      description: '',
      group: '',
      type: 'str',
      constraint: false,
      regex: null,
      isErrorRegex: false,
      errorRegexMessage: ' ',
      intMin: '0',
      isErrorIntMin: false,
      errorIntMinMessage: ' ',
      intMax: '0',
      isErrorIntMax: false,
      errorIntMaxMessage: ' ',
      floatMin: '0',
      isErrorFloatMin: false,
      errorFloatMinMessage: ' ',
      floatMax: '0',
      isErrorFloatMax: false,
      errorFloatMaxMessage: ' ',
      objLink: null,
      isErrorObjLink: false,
      errorObjLinkMessage: ' ',
      paramLink: null,
      isErrorParamLink: false,
      errorParamLinkMessage: ' ',
      formula: '',
      isErrorFormula: false,
      errorFomulaMessage: ' ',
      multiple: false,
      required: false,
      searchable: false,
      automation: false,
      returnable: false,
      fieldValue: null,
      internalPrmLinkFilter: null,
      errorInternalMessage: ' ',
      isErrorInternal: false,
      externalPrmLinkFilter: null,
      errorExternalMessage: ' ',
      isErrorExternal: false,
      sequenceConstraint: null,
      isErrorSequenceConstraint: false,
      errorSequenceConstraintMessage: ' ',
      tmoWayMoLink: null,
      isErrorEnumConstraint: false,
    });
  };

  return (
    <ObjectAndParamTypeModalStyled
      open={isForceModalOpen}
      onClose={
        isChangedTypeInValueWithColorPalete
          ? refusalToChangeForValueWithColorPallete
          : refusalToChange
      }
    >
      <HeaderInTheMiddle>
        <ModalTitleWithoutCloseIcon>
          {isChangedTypeInValueWithColorPalete
            ? `${translate('This parameter type has a color palette for the')} ${
                paramTypeDataAtTheStartEditing?.val_type
              } ${translate(
                'type. Changing the parameter type may result in data loss. Do you want to proceed?',
              )}`
            : translate('This operation will result in the data loss. Do you want to proceed?')}
        </ModalTitleWithoutCloseIcon>
      </HeaderInTheMiddle>

      <SmallContent>
        <HorizontalContainer>
          <LoadingButton
            loadingIndicator={<CircularProgress color="primary" size={23} />}
            loading={isLoading}
            variant="contained"
            sx={{ width: '100px', transition: 'all 0.3s' }}
            onClick={
              isChangedTypeInValueWithColorPalete
                ? refusalToChangeForValueWithColorPallete
                : refusalToChange
            }
          >
            {translate('Back')}
          </LoadingButton>
          <LoadingButton
            loadingIndicator={<CircularProgress color="primary" size={23} />}
            loading={isLoading}
            variant="contained"
            sx={{ width: '100px', transition: 'all 0.3s' }}
            onClick={
              isChangedTypeInValueWithColorPalete
                ? consentToChangeForValueWithColorPallete
                : consentToChange
            }
          >
            {translate('Okay')}
          </LoadingButton>
        </HorizontalContainer>
      </SmallContent>
    </ObjectAndParamTypeModalStyled>
  );
};

export default ForceParamTypeModal;
