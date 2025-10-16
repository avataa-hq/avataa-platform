import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  createMultipleEditBody,
  excludeValTypes,
  type ICustomInputs,
  useGetObjectTypeParamTypes,
  useGetDataForTooltipName,
  useCreateMultipleParameters,
  useUpdateMultipleParameters,
  getFilteredObjects,
  getFilteredData,
} from '5_entites';
import { type IMultipleEditOptions, LoadingAvataa, ObjectByFilters, useTranslate } from '6_shared';
import { EditMultipleComponent } from './editMultipleComponent';
import { createMultipleEditOptionsList } from '../lib';
import * as SC from './EditMultipleParams.styled';

interface IProps {
  tmoId: number | undefined;
  selectedObjectIds: number[];
  onClose: () => void;
  objectsByFilters: ObjectByFilters[] | undefined;
}

export const EditMultipleParams = ({
  tmoId,
  selectedObjectIds,
  onClose,
  objectsByFilters,
}: IProps) => {
  const translate = useTranslate();
  const [options, setOptions] = useState<IMultipleEditOptions[]>([]);
  const [allOptions, setAllOptions] = useState<IMultipleEditOptions[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IMultipleEditOptions[]>([]);
  const [loading, setLoading] = useState(false);
  const { objectTypeParamTypes, isObjectTypesParamTypesFetching } = useGetObjectTypeParamTypes({
    objectTmoId: tmoId,
  });

  const { createMultipleParameters, isMultipleCreateParamsLoading } = useCreateMultipleParameters();
  const { updateMultipleParameters, isMultipleUpdateParamsLoading } = useUpdateMultipleParameters();

  const { createTooltipText } = useGetDataForTooltipName({
    objectTypeParamTypesData: objectTypeParamTypes,
  });

  const form = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, formState, reset, setError, clearErrors, unregister } = form;

  useEffect(() => {
    if (!objectTypeParamTypes) return;
    if (objectTypeParamTypes.length !== 0) {
      const newOptions = createMultipleEditOptionsList(objectTypeParamTypes);
      setOptions(newOptions);
      setAllOptions(newOptions);
    }
  }, [objectTypeParamTypes]);

  useEffect(() => {
    setLoading(
      isMultipleCreateParamsLoading ||
        isMultipleUpdateParamsLoading ||
        isObjectTypesParamTypesFetching,
    );
  }, [
    isMultipleCreateParamsLoading,
    isMultipleUpdateParamsLoading,
    isObjectTypesParamTypesFetching,
  ]);

  const paramTypeIds = useMemo(
    () => objectTypeParamTypes?.map((param) => param.id) || [],
    [objectTypeParamTypes],
  );

  const onSubmit: SubmitHandler<ICustomInputs> = async (data) => {
    const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

    const { createParamsBody, updateParamsBody } = createMultipleEditBody({
      objectsByFilters: filteredObjects,
      newData: getFilteredData({ data, paramTypeIds }),
    });

    if (createParamsBody.length) {
      await createMultipleParameters(createParamsBody);
    }

    if (updateParamsBody.length) {
      await updateMultipleParameters(updateParamsBody);
    }
  };

  const onApplyClick = async () => {
    await handleSubmit(onSubmit)();
    reset();
    onClose();
  };

  const onCancelClick = () => {
    reset();
    onClose();
  };

  const onAddOptionClick = () => {
    if (options.length !== 0) {
      const newOption = options[0];
      if (newOption) {
        if (!excludeValTypes.includes(newOption.val_type) && !newOption.multiple) {
          setError(newOption.id.toString(), {
            type: 'required',
            message: translate('This field is required'),
          });
        }
        const newOptions = options.slice().filter((option) => option.id !== newOption.id);
        setOptions(newOptions);
        setSelectedOptions([...selectedOptions, newOption]);
      }
    }
  };

  const onDeleteOptionClick = (id: number) => {
    const newOption = allOptions.find((param) => param.id === id);
    if (newOption) {
      clearErrors(newOption.id.toString());
      setSelectedOptions(selectedOptions.filter((option) => option.id !== id));
      setOptions([...options, newOption]);
    }
    unregister(id.toString());
  };

  const onChangeOption = (prevOpt: IMultipleEditOptions, newOption: IMultipleEditOptions) => {
    unregister(prevOpt.id.toString());
    const newSelectedOptions = [...selectedOptions];
    const prevOptIndex = selectedOptions.findIndex((option) => option.id === prevOpt.id);

    if (prevOptIndex !== -1) {
      newSelectedOptions.splice(prevOptIndex, 1, newOption);
    } else {
      newSelectedOptions.push(newOption);
    }

    setSelectedOptions(newSelectedOptions);

    const newOptions = [...options, prevOpt].filter((option) => option.id !== newOption.id);
    setOptions(newOptions);

    if (!excludeValTypes.includes(newOption.val_type) && !newOption.multiple) {
      setError(newOption.id.toString(), {
        type: 'required',
        message: translate('This field is required'),
      });
    }

    clearErrors(prevOpt.id.toString());
  };

  return (
    <FormProvider {...form}>
      <SC.EditMultipleParamsStyled>
        {!loading && allOptions.length !== 0 && (
          <SC.Header>
            <Typography>{translate('Attributes')}</Typography>
            <Typography>{translate('New values')}</Typography>
          </SC.Header>
        )}

        <SC.Body>
          {loading && (
            <SC.LoadingContainer>
              <LoadingAvataa />
            </SC.LoadingContainer>
          )}
          {!loading &&
            allOptions.length !== 0 &&
            selectedOptions.map((param) => {
              const selectedOption = selectedOptions.find((option) => option.id === param.id);
              return (
                <EditMultipleComponent
                  key={param.id}
                  selectedOption={selectedOption}
                  options={options}
                  onChangeOption={onChangeOption}
                  onDeleteOptionClick={onDeleteOptionClick}
                  createTooltipText={createTooltipText}
                />
              );
            })}

          {!loading && allOptions.length === 0 && (
            <Box
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              <Typography>
                {translate('There are no parameter types created for this object type')}
              </Typography>
            </Box>
          )}
        </SC.Body>

        <SC.Footer>
          {!loading && allOptions.length !== 0 && (
            <IconButton onClick={onAddOptionClick}>
              <AddCircleIcon />
            </IconButton>
          )}
          <SC.ButtonsWrapper>
            <Button variant="outlined" onClick={onCancelClick}>
              {translate('Cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={onApplyClick}
              disabled={
                Object.keys(formState.errors).length > 0 ||
                loading ||
                allOptions.length === 0 ||
                selectedOptions.length === 0
              }
            >
              {translate('Apply')}
            </Button>
          </SC.ButtonsWrapper>
        </SC.Footer>
      </SC.EditMultipleParamsStyled>
    </FormProvider>
  );
};
