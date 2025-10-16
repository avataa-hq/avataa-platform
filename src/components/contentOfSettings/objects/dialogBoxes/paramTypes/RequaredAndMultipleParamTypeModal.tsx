import { useEffect, useState } from 'react';
import { Modal, useGetObjectsQuery, useSettingsObject, useTranslate } from '6_shared';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { validFloatValue, validIntValue } from '../lib/regExp';
import { Icon, TitleText, TitleTextWithColor } from '../ObjectAndParamTypeModal.styled';
import { ListOfValues } from '../model/types';
import {
  ReqAndMulStrIntFloat,
  ReqAndMulBoolean,
  ReqAndMulDate,
  ReqAndMulDatetime,
  ReqAndMulMoLink,
} from './reqAndMulTPRMModal';

const RequaredAndMultipleParamTypeModal = () => {
  const translate = useTranslate();

  const {
    isRequiredAndMultipleModalOpen,
    paramState,
    setIsRequiredAndMultipleModalOpen,
    setParamState,
  } = useSettingsObject();

  const [listOfInputValues, setListOfInputValues] = useState<ListOfValues[]>([
    { id: 1, value: '', isError: false, errorMessage: ' ' },
  ]);
  const [listOfMOLinkSelectedObjects, setListOfMOLinkSelectedObjects] = useState<string[]>([]);

  const { data: objects } = useGetObjectsQuery(
    { object_type_id: paramState.objLink?.id },
    {
      skip:
        !paramState.objLink?.id || paramState.type !== 'mo_link' || !isRequiredAndMultipleModalOpen,
    },
  );

  useEffect(() => {
    if (paramState.type === 'bool' && isRequiredAndMultipleModalOpen) {
      setListOfInputValues([{ id: 1, value: 'true', isError: false, errorMessage: ' ' }]);
    }
  }, [paramState.type, isRequiredAndMultipleModalOpen]);

  const onClose = () => {
    setListOfInputValues([{ id: 1, value: '', isError: false, errorMessage: ' ' }]);
    setListOfMOLinkSelectedObjects([]);
    setIsRequiredAndMultipleModalOpen(false);
    setParamState({ ...paramState, fieldValue: null });
  };

  const onAddFieldValue = () => {
    let isValid = true;
    let fieldValueList: Array<number | string | boolean> = [];

    const validateAndTransformValues = (
      validationFn: (value: string) => string | boolean,
      errorMessageFn: () => string,
      transformFn: (item: ListOfValues) => number | string | boolean,
    ) => {
      const updatedList = listOfInputValues.map((item) => {
        if (!item.value.trim() || !validationFn(item.value)) {
          isValid = false;
          return {
            ...item,
            isError: true,
            errorMessage: errorMessageFn(),
          };
        }
        return item;
      });

      setListOfInputValues(updatedList);

      if (isValid && !updatedList.some((item) => item.isError)) {
        fieldValueList = updatedList.map(transformFn);
      }
    };

    if (paramState.type === 'str') {
      validateAndTransformValues(
        (value: string) => value.trim().length > 0,
        () => 'The field must be filled',
        (item: ListOfValues) => item.value,
      );
    }
    if (paramState.type === 'int') {
      validateAndTransformValues(
        (value: string) => value.trim() && validIntValue(value),
        () => 'Invalid integer value',
        (item: ListOfValues) => parseInt(item.value, 10),
      );
    }
    if (paramState.type === 'float') {
      validateAndTransformValues(
        (value: string) => value.trim() && validFloatValue(value),
        () => 'Invalid float value',
        (item: ListOfValues) => parseFloat(item.value),
      );
    }
    if (paramState.type === 'bool') {
      fieldValueList = listOfInputValues.map((item) => item.value === 'true');
    }
    if (paramState.type === 'date') {
      validateAndTransformValues(
        (value: string) => value.trim().length > 0,
        () => 'The field must be filled',
        (item: ListOfValues) => {
          const inputDate = new Date(item.value);
          return inputDate.toISOString().split('T')[0];
        },
      );
    }
    if (paramState.type === 'datetime') {
      validateAndTransformValues(
        (value: string) => value.trim().length > 0,
        () => 'The field must be filled',
        (item: ListOfValues) => {
          const inputDate = new Date(item.value);
          return inputDate.toISOString();
        },
      );
    }
    if (paramState.type === 'mo_link') {
      if (listOfMOLinkSelectedObjects.length > 0) {
        isValid = true;
        setListOfInputValues([{ id: 1, value: '', isError: false, errorMessage: ' ' }]);
      } else {
        isValid = false;
        setListOfInputValues([
          { id: 1, value: '', isError: true, errorMessage: 'The field must be filled' },
        ]);
      }

      const fieldValues =
        objects?.apiResponse
          .map((obj) => (listOfMOLinkSelectedObjects.includes(obj.name) ? obj.id : null))
          .filter((item): item is number => item !== null && item !== undefined) || [];

      if (fieldValues) {
        fieldValueList = fieldValues;
      }
    }

    if (isValid) {
      setParamState({ ...paramState, fieldValue: fieldValueList });
      setIsRequiredAndMultipleModalOpen(false);
      setListOfInputValues([{ id: 1, value: '', isError: false, errorMessage: ' ' }]);
      setListOfMOLinkSelectedObjects([]);
    }
  };

  const onChangeValueOfList = (newValue: string, item: ListOfValues) => {
    setListOfInputValues((prevState) =>
      prevState.map((prevStateItem) =>
        prevStateItem.id === item.id
          ? { id: item.id, value: newValue, isError: false, errorMessage: ' ' }
          : prevStateItem,
      ),
    );
  };

  const onDeleteValueInList = (id: number) => {
    setListOfInputValues((prevState) =>
      prevState.filter((item) => item.id !== id).map((item, index) => ({ ...item, id: index + 1 })),
    );
  };

  const addNewInput = () => {
    if (listOfInputValues[listOfInputValues.length - 1].value.length) {
      setListOfInputValues([
        ...listOfInputValues,
        {
          id: listOfInputValues.length + 1,
          value: paramState.type === 'bool' ? 'true' : '',
          isError: false,
          errorMessage: ' ',
        },
      ]);
    }
  };

  return (
    <Modal
      open={isRequiredAndMultipleModalOpen}
      onClose={onClose}
      title={
        <>
          <TitleText>{translate('Set value for existing objects for the')}</TitleText>
          <TitleText> &quot;</TitleText>
          <TitleTextWithColor>{paramState.name}</TitleTextWithColor>
          <TitleText>&quot; </TitleText>
          <TitleText>{translate('field')}</TitleText>
        </>
      }
      width={420}
      actions={
        <>
          <Button variant="outlined" onClick={onClose}>
            {translate('Cancel')}
          </Button>
          <Button variant="contained" onClick={onAddFieldValue}>
            {translate('Create')}
          </Button>
        </>
      }
    >
      {paramState.type !== 'bool' &&
        paramState.type !== 'date' &&
        paramState.type !== 'datetime' &&
        paramState.type !== 'mo_link' && (
          <ReqAndMulStrIntFloat
            listOfInputValues={listOfInputValues}
            onChangeValueOfList={onChangeValueOfList}
            onDeleteValueInList={onDeleteValueInList}
          />
        )}

      {paramState.type === 'bool' && (
        <ReqAndMulBoolean
          listOfInputValues={listOfInputValues}
          onChangeValueOfList={onChangeValueOfList}
          onDeleteValueInList={onDeleteValueInList}
        />
      )}

      {paramState.type === 'date' && (
        <ReqAndMulDate
          listOfInputValues={listOfInputValues}
          onChangeValueOfList={onChangeValueOfList}
          onDeleteValueInList={onDeleteValueInList}
        />
      )}

      {paramState.type === 'datetime' && (
        <ReqAndMulDatetime
          listOfInputValues={listOfInputValues}
          onChangeValueOfList={onChangeValueOfList}
          onDeleteValueInList={onDeleteValueInList}
        />
      )}

      {paramState.type === 'mo_link' && (
        <ReqAndMulMoLink
          listOfInputValues={listOfInputValues}
          listOfMOLinkSelectedObjects={listOfMOLinkSelectedObjects}
          setListOfInputValues={setListOfInputValues}
          setListOfMOLinkSelectedObjects={setListOfMOLinkSelectedObjects}
          objects={objects}
        />
      )}

      {paramState.type !== 'mo_link' && (
        <Box component="div" display="flex" justifyContent="center">
          <Icon onClick={addNewInput}>
            <AddIcon />
          </Icon>
        </Box>
      )}
    </Modal>
  );
};

export default RequaredAndMultipleParamTypeModal;
