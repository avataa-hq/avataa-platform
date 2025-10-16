import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  Autocomplete,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import {
  useTranslate,
  getErrorMessage,
  // IColorRangeModel,
  parameterTypesApi,
  useSettingsObject,
} from '6_shared';
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
import { IGroup } from '../../utilities/interface';
import {
  ParamTypeBoolDateDateTime,
  ParamTypeFloat,
  ParamTypeFormula,
  ParamTypeInt,
  ParamTypeLinkToObj,
  ParamTypeLinkToParam,
  ParamTypeSequence,
  ParamTypeStr,
  ParamTypeTwoWayMoLink,
  ParamTypeEnum,
} from './sectionParamType';
import SectionCheckboxes from './sectionCheckboxes/SectionCheckboxes';
import { isValidRegex, validFloatValue, validIntValue } from '../lib/regExp';
import { isValidParameterName } from '../lib/isValidName';
import { normalizeSpaces } from '../lib/normalizeSpaces';

const { useGetObjectTypeParamTypesQuery, useCreateParamTypeMutation } = parameterTypesApi;

const CreateParamTypeModal = () => {
  const translate = useTranslate();

  const [addInventoryParamType, { isLoading }] = useCreateParamTypeMutation();

  const {
    isCreateParamModalOpen,
    arrayOfGroupsObjects,
    paramState,
    objType,
    isRequiredModalOpen,
    isRequiredAndMultipleModalOpen,
    setIsCreateParamModalOpen,
    setIsRequiredAndMultipleModalOpen,
    setIsRequiredModalOpen,
    setParamState,
    setParamType,
  } = useSettingsObject();

  const {
    description,
    type,
    constraint,
    objLink,
    paramLink,
    multiple,
    required,
    returnable,
    searchable,
    group,
    automation,
    isErrorName,
    errorNameMessage,
    fieldValue,
    internalPrmLinkFilter,
    externalPrmLinkFilter,
    formula,
    sequenceConstraint,
    tmoWayMoLink,
    enumConstraint,
    isErrorEnumConstraint,
  } = paramState;

  const [localName, setLocalName] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [localRegex, setLocalRegex] = useState('');
  const [localIntMin, setLocalIntMin] = useState('');
  const [localIntMax, setLocalIntMax] = useState('');
  const [localFloatMin, setLocalFloatMin] = useState('');
  const [localFloatMax, setLocalFloatMax] = useState('');

  // Рефы для хранения таймаутов
  const nameDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const regexDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intMinDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intMaxDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const floatMinDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const floatMaxDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setParamState({ ...paramState, group: 'Main' });
  }, [isCreateParamModalOpen]);

  useEffect(() => {
    if ((type === 'mo_link' || type === 'prm_link') && isCreateParamModalOpen)
      setParamState({ ...paramState, required: false });
  }, [type, isCreateParamModalOpen]);

  const { data: objectTypes = [] } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    {
      skip: !objType?.id,
    },
  );

  const onModalClose = () => {
    setLocalName('');
    setLocalDescription('');
    setLocalRegex('');
    setLocalIntMin('0');
    setLocalIntMax('0');
    setLocalFloatMin('0');
    setLocalIntMax('0');
    setParamType(null);
    setIsCreateParamModalOpen(false);

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

  const setConstraint = () => {
    if (type === 'str' && constraint) return localRegex;
    if (type === 'int' && constraint) return `${localIntMin}:${localIntMax}`;
    if (type === 'float' && constraint) return `${localFloatMin}:${localFloatMax}`;
    if (type === 'mo_link') return objLink?.id?.toString() || null;
    if (type === 'prm_link' && paramLink) return paramLink.id?.toString();
    if (type === 'formula') return formula;
    if (type === 'sequence') return sequenceConstraint?.id?.toString() || null;
    if (type === 'two-way link') return tmoWayMoLink?.id?.toString() || null;
    if (type === 'enum') return `[${enumConstraint.map((item) => `'${item}'`).join(',')}]`;

    return null;
  };

  const onValTypeChange = (
    event: SelectChangeEvent<
      | 'date'
      | 'datetime'
      | 'float'
      | 'str'
      | 'int'
      | 'bool'
      | 'mo_link'
      | 'prm_link'
      | 'formula'
      | 'sequence'
      | 'user_link'
      | 'two-way link'
      | 'enum'
    >,
  ) =>
    setParamState({
      ...paramState,
      type: event.target.value as
        | 'str'
        | 'int'
        | 'float'
        | 'bool'
        | 'date'
        | 'datetime'
        | 'link_to_object'
        | 'link_to_parameter'
        | 'sequence'
        | 'formula'
        | 'two-way link'
        | 'enum',
      constraint: false,
      objLink: null,
      paramLink: null,
      isErrorObjLink: false,
      isErrorParamLink: false,
      errorFloatMaxMessage: ' ',
      errorFloatMinMessage: ' ',
      errorIntMaxMessage: ' ',
      errorIntMinMessage: ' ',
      errorObjLinkMessage: ' ',
      errorParamLinkMessage: ' ',
      errorRegexMessage: ' ',
      fieldValue: null,
      internalPrmLinkFilter: null,
      externalPrmLinkFilter: null,
      multiple: event.target.value === 'two-way link' ? false : paramState.multiple,
      required:
        event.target.value === 'formula' || event.target.value === 'two-way link'
          ? false
          : paramState.required,
      sequenceConstraint: null,
      isErrorSequenceConstraint: false,
      errorSequenceConstraintMessage: ' ',
      tmoWayMoLink: null,
    });

  const createParameter = async () => {
    const normalizedName = normalizeSpaces(localName);
    const errorName = !normalizedName.trim().length;

    const errorNameAlreadyExist = objectTypes.some(
      (item: any) => normalizeSpaces(item.name) === normalizedName,
    );

    const errorRegex =
      constraint &&
      type === 'str' &&
      (!localRegex.trim().length || isValidRegex(localRegex) === false);

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
      errorExternalMessage: errorExternal ? 'Invalid external' : ' ',
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
      !errorLinkToParam &&
      !errorFormula &&
      !errorLinkToParam &&
      !errorInternal &&
      !errorExternal &&
      !errorTmoWayMoLink &&
      !isErrorEnumConstraint
    ) {
      if (required && fieldValue === null && paramState.type !== 'formula') {
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

      const params = {
        name: normalizedName,
        description: description.trim() === '' ? undefined : description,
        val_type: type,
        multiple,
        required,
        returnable,
        searchable,
        constraint: setConstraint(),
        group: group === '_Blank' ? null : group,
        tmo_id: objType?.id,
        automation,
        ...(fieldValue && { field_value: fieldValue }),
        prm_link_filter:
          internalPrmLinkFilter && externalPrmLinkFilter
            ? `${internalPrmLinkFilter.id}:${externalPrmLinkFilter.id}`
            : undefined,
      };

      try {
        await addInventoryParamType(params);
        onModalClose();
        enqueueSnackbar(translate('Parameter type created successfully'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar({ variant: 'error', message: getErrorMessage(error) });
        if (error.status === 422 && error.data.detail === 'Could not parse formula') {
          setParamState({
            ...paramState,
            isErrorFormula: true,
            errorFormulaMessage: error.data.detail,
          });
        }
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

  return (
    <ObjectAndParamTypeModalStyled open={isCreateParamModalOpen} onClose={onModalClose}>
      <Header>
        <ModalTitle>{translate('Create a new parameter type')}</ModalTitle>
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
            value={localDescription}
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
            minRows={2}
            maxRows={4}
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
            value={type}
            onChange={(event) => onValTypeChange(event)}
            sx={{ padding: '8px 39px 8px 0px' }}
            data-testid="create-param-type-modal__type-select"
          >
            <MenuItem value="str">{translate('string')}</MenuItem>
            <MenuItem value="int">{translate('integer')}</MenuItem>
            <MenuItem value="float">{translate('float')}</MenuItem>
            <MenuItem value="bool">{translate('boolean')}</MenuItem>
            <MenuItem value="date">{translate('date')}</MenuItem>
            <MenuItem value="datetime">{translate('datetime')}</MenuItem>
            <MenuItem value="mo_link">{translate('link to object')}</MenuItem>
            <MenuItem value="prm_link">{translate('link to parameter')}</MenuItem>
            <MenuItem value="formula">{translate('formula')}</MenuItem>
            <MenuItem value="user_link">{translate('link to user')}</MenuItem>
            <MenuItem value="sequence">{translate('sequence')}</MenuItem>
            <MenuItem value="two-way link">{translate('two-way link')}</MenuItem>
            <MenuItem value="enum">{translate('enum')}</MenuItem>
          </Select>
        </InputContainer>

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
          onClick={() => createParameter()}
        >
          {translate('Create')}
        </CreateButton>
      </Bottom>
    </ObjectAndParamTypeModalStyled>
  );
};

export default CreateParamTypeModal;
