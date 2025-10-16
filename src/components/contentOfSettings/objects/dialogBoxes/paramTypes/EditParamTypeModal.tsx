import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Autocomplete,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  IColorRangeModel,
  useTranslate,
  parameterTypesApi,
  objectTypesApi,
  InventoryObjectTypesModel,
  convertTypeForParamType,
  getErrorMessage,
  useTabs,
  useColorsConfigure,
  useSettingsObject,
} from '6_shared';
import { ColorSettings, ColorSelecting } from '3_widgets';
import { enqueueSnackbar } from 'notistack';
import { IGroup } from '../../utilities/interface';
import { isValidParameterName } from '../lib/isValidName';
import { isValidRegex, validFloatValue, validIntValue } from '../lib/regExp';
import {
  Bottom,
  Content,
  CreateButton,
  Header,
  InputContainer,
  InputTitle,
  ModalClose,
  ModalTitle,
  ObjectAndParamTypeModalStyled,
} from '../ObjectAndParamTypeModal.styled';
import {
  ParamTypeBoolDateDateTime,
  ParamTypeEnum,
  ParamTypeFloat,
  ParamTypeFormula,
  ParamTypeInt,
  ParamTypeLinkToObj,
  ParamTypeLinkToParam,
  ParamTypeSequence,
  ParamTypeStr,
  ParamTypeTwoWayMoLink,
} from './sectionParamType';
import SectionCheckboxes from './sectionCheckboxes/SectionCheckboxes';
import { normalizeSpaces } from '../lib/normalizeSpaces';

const {
  useGetObjectTypeParamTypesQuery,
  useLazyGetParamTypeByIdQuery,
  useUpdateParamTypeMutation,
  useUpdateValTypeMutation,
} = parameterTypesApi;
const { useGetObjectTypesQuery } = objectTypesApi;

interface IProps {
  colorRangesData: IColorRangeModel[] | undefined;
  username: string;
  onOpenEditColorRangesModal: () => void;
  onOpenCreateColorRangesModal: () => void;
  onCreateColorRange: () => void;
  onEditColorRange: () => void;
  onDeleteRange: () => void;
}

const EditParamTypeModal = ({ colorRangesData }: IProps) => {
  const translate = useTranslate();

  const { isOpenColorSelecting, toggleIsOpenColorSelecting, setCurrentTmoId } =
    useColorsConfigure();
  const { selectedTab } = useTabs();
  const {
    isEditParamModalOpen,
    arrayOfGroupsObjects,
    paramState,
    objType,
    paramType,
    paramTypeDataAtTheStartEditing,
    isRequiredModalOpen,
    isRequiredAndMultipleModalOpen,
    isChangedTypeInValueWithColorPalete,
    setIsChangedTypeInValueWithColorPalete,
    setIsEditParamModalOpen,
    setIsForceModalOpen,
    setIsRequiredAndMultipleModalOpen,
    setIsRequiredModalOpen,
    setParamState,
    setParamType,
  } = useSettingsObject();

  const { data: paramTypes = [] } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    {
      skip: !objType?.id,
    },
  );

  const { data: constraintParamTypes } = useGetObjectTypeParamTypesQuery(
    { id: paramState.objLink?.id! },
    {
      skip: !paramState.objLink,
    },
  );

  const { data: listOfObjectTypes = [] } = useGetObjectTypesQuery({});
  const [getParamType, { data: external }] = useLazyGetParamTypeByIdQuery();
  const [changeValType] = useUpdateValTypeMutation();
  const [editProduct, { isLoading }] = useUpdateParamTypeMutation();

  const {
    type,
    constraint,
    objLink,
    multiple,
    paramLink,
    required,
    returnable,
    searchable,
    group,
    automation,
    isErrorName,
    errorNameMessage,
    fieldValue,
    formula,
    sequenceConstraint,
    tmoWayMoLink,
    enumConstraint,
    isErrorEnumConstraint,
  } = paramState;

  const [localName, setLocalName] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [localRegex, setLocalRegex] = useState('');
  const [localIntMin, setLocalIntMin] = useState('0');
  const [localIntMax, setLocalIntMax] = useState('0');
  const [localFloatMin, setLocalFloatMin] = useState('0');
  const [localFloatMax, setLocalFloatMax] = useState('0');

  // Рефы для хранения таймаутов
  const nameDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const regexDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intMinDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intMaxDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const floatMinDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const floatMaxDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!paramType || !isEditParamModalOpen) return;
    const editableParamsFromServer = {
      name: paramType.name,
      description: paramType.description,
      group: paramType.group,
      type: paramType.val_type,
      multiple: paramType.multiple,
      required: paramType.required,
      searchable: paramType.searchable,
      automation: paramType.automation,
      returnable: paramType.returnable,
    };

    setLocalName(paramType.name);
    setLocalDescription(paramType.description!);

    if (paramTypeDataAtTheStartEditing?.val_type !== paramType.val_type) {
      setParamState({ ...paramState, type: paramType.val_type });
    }

    if (paramTypeDataAtTheStartEditing?.val_type === paramType.val_type) {
      if (!paramType.constraint) {
        setParamState({ ...paramState, ...editableParamsFromServer });
      } else {
        if (paramType.val_type === 'str') {
          setLocalRegex(paramType.constraint);

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            constraint: true,
            regex: paramType.constraint,
          });
        }

        if (paramType.constraint && paramType.val_type === 'int') {
          const parts = paramType.constraint.split(':');
          const min = parts[0];
          const max = parts[1];
          setLocalIntMin(min);
          setLocalIntMax(max);

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            constraint: true,
            intMin: min,
            intMax: max,
          });
        }

        if (paramType.constraint && paramType.val_type === 'float') {
          const parts = paramType.constraint.split(':');
          const min = parts[0];
          const max = parts[1];
          setLocalFloatMin(min);
          setLocalFloatMax(max);

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            constraint: true,
            floatMin: min,
            floatMax: max,
          });
        }
        if (listOfObjectTypes && paramType.val_type === 'mo_link' && !objLink) {
          const selectedObj = listOfObjectTypes.find(
            (item: InventoryObjectTypesModel) => item.id.toString() === paramType.constraint,
          );

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            constraint: true,
            objLink: selectedObj,
          });
        }

        if (paramType.constraint && paramType.val_type === 'prm_link') {
          const parts = paramType.constraint.split(':');
          const selectedObj = listOfObjectTypes.find(
            (item: InventoryObjectTypesModel) => item.id.toString() === parts[0],
          );
          const selectParam = constraintParamTypes?.find((item) => item.id.toString() === parts[1]);

          if (paramType.prm_link_filter && selectedObj && selectParam) {
            const filterParts = paramType.prm_link_filter.split(':');
            const internal = paramTypes.find((item) => item.id.toString() === filterParts[0]);

            getParamType(Number(filterParts[1]));

            setParamState({
              ...paramState,
              ...editableParamsFromServer,
              constraint: true,
              objLink: selectedObj,
              paramLink: selectParam,
              internalPrmLinkFilter: internal,
              externalPrmLinkFilter: external,
            });
          } else {
            setParamState({
              ...paramState,
              ...editableParamsFromServer,
              constraint: true,
              objLink: selectedObj,
              paramLink: selectParam,
            });
          }
        }

        if (paramType.constraint && paramType.val_type === 'formula') {
          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            constraint: true,
            formula: paramType.constraint,
          });
        }

        if (paramType.constraint && paramType.val_type === 'sequence') {
          const seqConstraint = paramTypes.find((pt) => pt.id.toString() === paramType.constraint);

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            sequenceConstraint: seqConstraint ?? null,
          });
        }
        if (paramType.constraint && paramType.val_type === 'two-way link') {
          const tmoWayMoLinkConstraint = listOfObjectTypes.find(
            (item: InventoryObjectTypesModel) => item.id.toString() === paramType.constraint,
          );

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            tmoWayMoLink: tmoWayMoLinkConstraint ?? null,
          });
        }
        if (paramType.constraint && paramType.val_type === 'enum') {
          const currentParam = paramTypes.find((pt) => pt.name === paramType.name);

          const constraintArray = paramType.constraint
            .replace(/^(\[|\])$/g, '')
            .replace(/'/g, '')
            .split(',')
            .map((item) => item.trim());

          setParamState({
            ...paramState,
            ...editableParamsFromServer,
            constraint: true,
            enumConstraint: constraintArray,
            fieldValue: currentParam?.field_value,
          });
        }
      }
    }
  }, [
    paramType,
    paramTypes,
    isEditParamModalOpen,
    listOfObjectTypes,
    paramTypeDataAtTheStartEditing,
    external,
    constraintParamTypes,
  ]);

  const onModalClose = () => {
    setLocalName('');
    setLocalDescription('');
    setLocalRegex('');
    setLocalIntMin('0');
    setLocalIntMax('0');
    setLocalFloatMin('0');
    setLocalIntMax('0');
    setParamType(null);
    setIsEditParamModalOpen(false);
    setIsChangedTypeInValueWithColorPalete(false);

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
      isErrorTwoWayMoLink: false,
      errorTwoWayMoLinkMessage: ' ',
      isErrorEnumConstraint: false,
    });
  };

  const onValTypeChange = (
    event: SelectChangeEvent<
      | 'str'
      | 'int'
      | 'float'
      | 'bool'
      | 'date'
      | 'datetime'
      | 'mo_link'
      | 'prm_link'
      | 'formula'
      | 'user_link'
      | 'sequence'
      | 'two-way link'
      | 'enum'
    >,
  ) => {
    if (paramType?.val_type !== event.target.value && colorRangesData?.length) {
      setIsForceModalOpen(true);
      setIsChangedTypeInValueWithColorPalete(true);
    }

    setParamState({
      ...paramState,
      type: event.target.value as
        | 'str'
        | 'int'
        | 'float'
        | 'bool'
        | 'date'
        | 'datetime'
        | 'formula'
        | 'sequence'
        | 'two-way link'
        | 'enum',
      constraint: false,
      regex: null,
      intMin: '0',
      intMax: '0',
      floatMin: '0',
      floatMax: '0',
      objLink: null,
      paramLink: null,
      formula: '',
      isErrorObjLink: false,
      isErrorParamLink: false,
      isErrorFormula: false,
      errorFloatMaxMessage: ' ',
      errorFloatMinMessage: ' ',
      errorIntMaxMessage: ' ',
      errorIntMinMessage: ' ',
      errorObjLinkMessage: ' ',
      errorParamLinkMessage: ' ',
      errorRegexMessage: ' ',
      errorFomulaMessage: ' ',
      multiple: event.target.value === 'two-way link' ? false : paramState.multiple,
      required: event.target.value === 'two-way link' ? false : paramState.required,
      ...(fieldValue && { field_value: paramState.fieldValue }),
    });
  };

  const setConstraint = () => {
    if (type === 'str' && constraint) return localRegex;
    if (type === 'int' && constraint) return `${localIntMin}:${localIntMax}`;
    if (type === 'float' && constraint) return `${localFloatMin}:${localFloatMax}`;
    if (type === 'mo_link') return objLink?.id || null;
    if (type === 'prm_link' && paramLink) return paramLink.id;
    if (type === 'formula' && constraint) return formula;
    if (type === 'sequence') return sequenceConstraint?.id || null;
    if (type === 'two-way link') return tmoWayMoLink?.id || null;
    if (type === 'enum') return `[${enumConstraint.map((item) => `'${item}'`).join(',')}]`;

    return null;
  };

  const editParameterType = async () => {
    const normalizedName = normalizeSpaces(localName);
    const errorName = !normalizedName.trim().length;

    const errorNameAlreadyExist = paramTypes.some(
      (item) =>
        normalizeSpaces(item.name) === normalizedName &&
        normalizeSpaces(paramType?.name!) !== normalizeSpaces(item.name),
    );

    const errorRegex =
      constraint && type === 'str' && (!localRegex.trim() || !isValidRegex(localRegex));

    const errorIntMin =
      constraint &&
      type === 'int' &&
      (!validIntValue(localIntMin) || Number(localIntMin) >= Number(localIntMax));

    const errorIntMax =
      constraint &&
      type === 'int' &&
      (!validIntValue(localIntMax) || Number(localIntMin) >= Number(localIntMax));

    const errorFloatMin =
      constraint &&
      type === 'float' &&
      (!validFloatValue(localFloatMin) || Number(localFloatMin) >= Number(localFloatMax));

    const errorFloatMax =
      constraint &&
      type === 'float' &&
      (!validFloatValue(localFloatMax) || Number(localFloatMin) >= Number(localFloatMax));

    const errorLinkToObject = type === 'prm_link' && objLink === null;

    const errorLinkToParam = type === 'prm_link' && !paramLink;

    const errorFormula = type === 'formula' && !formula.trim().length;

    const errorInternal =
      type === 'prm_link' && !paramState.internalPrmLinkFilter && paramState.externalPrmLinkFilter;

    const errorExternal =
      type === 'prm_link' && !paramState.externalPrmLinkFilter && paramState.internalPrmLinkFilter;

    const errorTmoWayMoLink = type === 'two-way link' && !paramState.tmoWayMoLink;

    const errorEnum = type === 'enum' && !paramState.enumConstraint.length;

    setParamState({
      ...paramState,
      isErrorName: errorName || errorNameAlreadyExist,
      errorNameMessage: isValidParameterName(errorName, errorNameAlreadyExist),
      isErrorRegex: errorRegex,
      errorRegexMessage: errorRegex ? 'Incorrect regular expression' : ' ',
      isErrorIntMin: errorIntMin,
      errorIntMinMessage: errorIntMin ? 'Incorrect value' : ' ',
      isErrorIntMax: errorIntMax,
      errorIntMaxMessage: errorIntMax ? 'Incorrect value' : ' ',
      isErrorFloatMin: errorFloatMin,
      errorFloatMinMessage: errorFloatMin ? 'Incorrect value' : ' ',
      isErrorFloatMax: errorFloatMax,
      errorFloatMaxMessage: errorFloatMax ? 'Incorrect value' : ' ',
      isErrorObjLink: errorLinkToObject,
      errorObjLinkMessage: errorLinkToObject ? 'Invalid object' : ' ',
      isErrorParamLink: errorLinkToParam,
      errorParamLinkMessage: errorLinkToParam ? 'Invalid parameter' : ' ',
      isErrorFormula: errorFormula,
      errorFormulaMessage: errorFormula ? 'Invalid formula' : ' ',
      errorInternalMessage: errorInternal ? 'Invalid internal' : ' ',
      isErrorInternal: errorInternal,
      errorExternalMessage: errorExternal ? 'invalid external' : ' ',
      isErrorExternal: errorExternal,
      errorTwoWayMoLinkMessage: errorTmoWayMoLink ? 'Invalid two-way mo_link' : ' ',
      isErrorTwoWayMoLink: errorTmoWayMoLink,
      isErrorEnumConstraint: errorEnum,
    });

    if (
      !errorName &&
      !errorNameAlreadyExist &&
      !errorRegex &&
      !errorIntMin &&
      !errorIntMin &&
      !errorFloatMin &&
      !errorFloatMax &&
      !errorLinkToObject &&
      !errorFormula &&
      !errorLinkToParam &&
      !errorInternal &&
      !errorExternal &&
      !errorTmoWayMoLink &&
      !isErrorEnumConstraint
    ) {
      const editedFields: Record<string, any> = {};

      if (
        required &&
        paramState.fieldValue === null &&
        !paramType?.required &&
        paramState.type !== 'formula'
      ) {
        if (multiple) {
          await new Promise<void>((resolve) => {
            setIsRequiredAndMultipleModalOpen(true);
            if (isRequiredAndMultipleModalOpen) {
              resolve();
            }
          });
        } else {
          await new Promise<void>((resolve) => {
            setIsRequiredModalOpen(true);
            if (isRequiredModalOpen) {
              resolve();
            }
          });
        }
      }

      // name check
      if (normalizedName !== paramType?.name) {
        editedFields.name = normalizedName;
      }
      // description check
      if (localDescription !== paramType?.description) {
        editedFields.description = localDescription;
      }
      // required check
      if (required !== paramType?.required) {
        editedFields.required = required;
      }
      // searchable check
      if (searchable !== paramType?.searchable) {
        editedFields.searchable = searchable;
      }
      // returnable check
      if (returnable !== paramType?.returnable) {
        editedFields.returnable = returnable;
      }
      // automation check
      if (automation !== paramType?.automation) {
        editedFields.automation = automation;
      }
      // group check
      if (group !== paramType?.group) {
        editedFields.group = group;
      }
      // fieldValue check
      if (fieldValue) {
        editedFields.field_value = fieldValue;
      }
      // constraint check
      if (
        setConstraint()?.toString() !== paramType?.constraint ||
        (type === 'enum' && setConstraint())
      ) {
        editedFields.constraint = setConstraint()?.toString();
      }

      // val_type check
      if (paramState.type !== paramType?.val_type) {
        editedFields.val_type = paramState.type;
      }

      const changeValTypeRequestBody = {
        val_type: type,
        force: isChangedTypeInValueWithColorPalete,
        field_value: paramState.fieldValue,
      };

      const isEmptyEditedFields = Object.keys(editedFields).length === 0;

      if (isEmptyEditedFields) {
        onModalClose();
        return;
      }

      if (setConstraint() === null || paramType?.constraint === setConstraint()?.toString()) {
        if (
          type === 'formula' &&
          paramState.required === paramTypeDataAtTheStartEditing?.required
        ) {
          setIsForceModalOpen(true);
          return;
        }
        if (type === 'formula' && paramState.required) {
          editedFields.field_value = '';
        }
        editedFields.force = false;

        if (type === paramType?.val_type) {
          const editParamTypeRequestBodyWithVersion = {
            ...editedFields,
            version: paramType?.version,
          };
          const editParamTypeRequest = {
            id: paramType?.id!,
            ...editParamTypeRequestBodyWithVersion,
          };

          try {
            await editProduct(editParamTypeRequest).unwrap();
            enqueueSnackbar(translate('Parameter type changed successfully'), {
              variant: 'success',
            });
          } catch (error) {
            enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
          }
          onModalClose();
        } else {
          const changeValTypeRequestBodyWithVersion = {
            ...changeValTypeRequestBody,
            version: paramType?.version!,
          };
          const changeValTypeRequest = {
            id: paramType?.id!,
            ...changeValTypeRequestBodyWithVersion,
          };

          try {
            await changeValType(changeValTypeRequest);

            const editParamTypeRequestBodyWithVersion = {
              ...editedFields,
              version: (paramType?.version ?? -1) + 1,
            };
            const editParamTypeRequest = {
              id: paramType?.id!,
              ...editParamTypeRequestBodyWithVersion,
            };

            await editProduct(editParamTypeRequest).unwrap();

            enqueueSnackbar(translate('Parameter type changed successfully'), {
              variant: 'success',
            });
            onModalClose();
          } catch (error) {
            setIsForceModalOpen(true);
            enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
          }
        }
      } else {
        setIsForceModalOpen(true);
      }
    }
  };

  const handleChangeSelectedInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    typeOfInput: 'name' | 'description' | 'regex' | 'intMin' | 'intMax' | 'floatMin' | 'floatMax',
    setLocalFunction: (value: React.SetStateAction<string>) => void,
    debounceTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  ) => {
    const newValue = event.target.value;

    setLocalFunction(newValue);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      const update = { [typeOfInput]: newValue };
      const updatedParamState = { ...paramState, ...update };
      setParamState(updatedParamState);
    }, 300);
  };

  const openColorSelecting = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    setCurrentTmoId({ module: selectedTab, tmoId: Number(objType?.id) });
    toggleIsOpenColorSelecting({ module: selectedTab });
  };

  const configureColorsTooltipCheck = () => {
    if (!returnable || !['int', 'float', 'mo_link', 'str', 'bool'].includes(type)) {
      return translate(
        'Color customization is disabled because the conditions are not met (the Parameter type must be returnable and its type can be string or integer or float or boolean or link to object)',
      );
    }
    if (type !== paramType?.val_type) {
      return translate(
        'You have changed the type of the parameter type, before changing the color palette please save the changes',
      );
    }

    return '';
  };

  return (
    <ObjectAndParamTypeModalStyled open={isEditParamModalOpen} onClose={onModalClose}>
      <Header>
        <ModalTitle>{translate('Edit parameter type')}</ModalTitle>
        <ModalClose onClick={onModalClose} />
      </Header>

      <Content minHeight="500px">
        <InputContainer>
          <TextField
            label={translate('Name')}
            value={localName}
            onChange={(event) =>
              handleChangeSelectedInput(event, 'name', setLocalName, nameDebounceTimeoutRef)
            }
            size="small"
            autoFocus
            autoComplete="off"
            required
            error={isErrorName}
            helperText={errorNameMessage}
          />
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Description')}</InputTitle>
          <TextField
            value={localDescription || ''}
            onChange={(event) =>
              handleChangeSelectedInput(
                event,
                'description',
                setLocalDescription,
                descriptionDebounceTimeoutRef,
              )
            }
            autoComplete="off"
            multiline
            rows={4}
          />
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Group')}</InputTitle>
          <Autocomplete
            options={arrayOfGroupsObjects.map((item: IGroup) =>
              typeof item.group === 'string' ? item.group : '_Blank',
            )}
            value={group}
            onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) =>
              setParamState({ ...paramState, group: newValue })
            }
            renderInput={(params) => <TextField {...params} />}
            size="small"
            freeSolo
            autoSelect
          />
        </InputContainer>

        <InputContainer marginBottom="20px">
          <InputTitle>{translate('Type')}</InputTitle>
          <Select
            disabled={
              paramType?.required ||
              paramType?.id === objType?.latitude ||
              paramType?.id === objType?.longitude ||
              paramType?.val_type === 'formula'
            }
            value={type}
            onChange={(event) => onValTypeChange(event)}
            sx={{ padding: '8px 39px 8px 0px' }}
          >
            <MenuItem value="str">{translate('string')}</MenuItem>
            <MenuItem value="int">{translate('integer')}</MenuItem>
            <MenuItem value="float">{translate('float')}</MenuItem>
            <MenuItem value="bool">{translate('boolean')}</MenuItem>
            <MenuItem value="date">{translate('date')}</MenuItem>
            <MenuItem value="datetime">{translate('datetime')}</MenuItem>
            {type === 'mo_link' && (
              <MenuItem value="mo_link">{translate('link to object')}</MenuItem>
            )}
            {type === 'prm_link' && (
              <MenuItem value="prm_link">{translate('link to parameter')}</MenuItem>
            )}
            {type === 'user_link' && (
              <MenuItem value="user_link">{translate('link to user')}</MenuItem>
            )}
            <MenuItem value="formula">{translate('formula')}</MenuItem>
            <MenuItem value="sequence">{translate('sequence')}</MenuItem>
            <MenuItem value="two-way link">{translate('two-way link')}</MenuItem>
            <MenuItem value="enum">{translate('enum')}</MenuItem>
          </Select>
        </InputContainer>

        {/* paramState, paramType */}

        <Box
          component="div"
          display="flex"
          marginBottom="14px"
          width="96%"
          alignItems="center"
          gap="6px"
        >
          <InputTitle>{translate('Configure colors')}</InputTitle>
          <Tooltip
            title={configureColorsTooltipCheck()}
            placement="top"
            disableHoverListener={
              returnable &&
              ['int', 'float', 'mo_link', 'str', 'bool'].includes(type) &&
              type === paramType?.val_type
            }
          >
            <Box component="div">
              <IconButton
                disabled={
                  type !== paramType?.val_type ||
                  !returnable ||
                  (returnable && !['int', 'float', 'mo_link', 'str', 'bool'].includes(type))
                }
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  openColorSelecting(e)
                }
              >
                <SettingsIcon sx={{ cursor: 'pointer' }} />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>

        {type === 'str' && (
          <ParamTypeStr
            localRegex={localRegex}
            setLocalRegex={setLocalRegex}
            regexDebounceTimeoutRef={regexDebounceTimeoutRef}
            handleChangeSelectedInput={handleChangeSelectedInput}
          />
        )}
        {type === 'int' && (
          <ParamTypeInt
            localIntMin={localIntMin}
            setLocalIntMin={setLocalIntMin}
            intMinDebounceTimeoutRef={intMinDebounceTimeoutRef}
            localIntMax={localIntMax}
            setLocalIntMax={setLocalIntMax}
            intMaxDebounceTimeoutRef={intMaxDebounceTimeoutRef}
            handleChangeSelectedInput={handleChangeSelectedInput}
          />
        )}
        {type === 'float' && (
          <ParamTypeFloat
            localFloatMin={localFloatMin}
            setLocalFloatMin={setLocalFloatMin}
            floatMinDebounceTimeoutRef={floatMinDebounceTimeoutRef}
            localFloatMax={localFloatMax}
            setLocalFloatMax={setLocalFloatMax}
            floatMaxDebounceTimeoutRef={floatMaxDebounceTimeoutRef}
            handleChangeSelectedInput={handleChangeSelectedInput}
          />
        )}
        {type === 'bool' && <ParamTypeBoolDateDateTime />}
        {type === 'date' && <ParamTypeBoolDateDateTime />}
        {type === 'datetime' && <ParamTypeBoolDateDateTime />}
        {type === 'mo_link' && <ParamTypeLinkToObj />}
        {type === 'prm_link' && <ParamTypeLinkToParam />}
        {type === 'formula' && <ParamTypeFormula />}
        {type === 'sequence' && <ParamTypeSequence />}
        {type === 'two-way link' && <ParamTypeTwoWayMoLink />}
        {type === 'enum' && <ParamTypeEnum />}

        <SectionCheckboxes />
      </Content>

      <Bottom>
        <CreateButton
          variant="contained"
          loadingIndicator={<CircularProgress color="primary" size={23} />}
          loading={isLoading}
          onClick={() => editParameterType()}
        >
          {translate('Accept')}
        </CreateButton>
      </Bottom>
      {paramType && isOpenColorSelecting.objects && (
        <ColorSelecting
          settingsOnly
          tprms={{
            name: paramType.name,
            id: paramType.id,
            val_type: convertTypeForParamType(paramType.val_type),
          }}
          palettes={colorRangesData}
        />
      )}
      <ColorSettings isParamType />
    </ObjectAndParamTypeModalStyled>
  );
};

export default EditParamTypeModal;
