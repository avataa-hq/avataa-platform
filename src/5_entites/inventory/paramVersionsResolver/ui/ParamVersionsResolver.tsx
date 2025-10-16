import { useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Divider, Typography } from '@mui/material';
import {
  type IInventoryObjectParamsModel,
  InventoryParameterTypesModel,
  LoadingAvataa,
  type MultipleParameterUpdateBody,
  UpdateMultipleObjectsBody,
  UpdateParameterValuesBody,
  useParamsResolver,
  useTranslate,
} from '6_shared';
import { ICustomInputs, IParams, ParentIDOption } from '5_entites';
import {
  useGetInventoryObjectData,
  useGetObjectByFiltersById,
  useGetObjectTypeParamTypes,
  useGetParamTypeNamesByParamTypeIds,
  useUpdateMultipleObjects,
  useUpdateMultipleParameters,
} from '5_entites/inventory/api';
import { CurrentData } from './currentData/CurrentData';
import { ApplyData } from './applyData/ApplyData';
import { UserData } from './userData/UserData';
import * as SC from './ParamVersionsResolver.styled';

export const ParamVersionsResolver = () => {
  const translate = useTranslate();

  const {
    updateParamsBody,
    updateObjectBody,
    parentIdOptions,

    setIsParamsResolverOpen,
    setUpdateParamsBody,
    setParentIdOptions,
    setUpdateObjectBody,
  } = useParamsResolver();

  const form = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, formState, reset, unregister } = form;

  const [objectId, setObjectId] = useState<number | null>(null);
  const [updateParams, setUpdateParams] = useState<UpdateParameterValuesBody[]>([]);
  const [inventoryObjectParams, setInventoryObjectParams] = useState<Record<
    number,
    IInventoryObjectParamsModel
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingParams, setEditingParams] = useState<IParams[]>([]);
  const [paramTypesConfig, setParamTypesConfig] = useState<Record<
    number,
    InventoryParameterTypesModel
  > | null>(null);
  const [objectAttributes, setObjectAttributes] = useState<ParentIDOption[]>([]);
  const [editingAttributes, setEditingAttributes] = useState<ParentIDOption[]>([]);

  const { updateMultipleParameters } = useUpdateMultipleParameters();
  const { updateMultipleObjectFn } = useUpdateMultipleObjects();

  const { inventoryObjectData, isInventoryObjectDataFetching } = useGetInventoryObjectData({
    objectId,
  });

  const { objectByFilters, isObjectByFiltersLoading } = useGetObjectByFiltersById({
    objectId,
    tmoId: inventoryObjectData?.tmo_id ?? 0,
    skip: !updateObjectBody,
  });

  const { paramTypeNamesData, isParamTypeNamesFetching } = useGetParamTypeNamesByParamTypeIds({
    tprmIds: Object.keys(inventoryObjectParams ?? {}).map(Number),
    skip: !updateParamsBody || updateParamsBody?.length === 0,
  });

  const { objectTypeParamTypes, isObjectTypesParamTypesFetching } = useGetObjectTypeParamTypes({
    objectTmoId: inventoryObjectData?.tmo_id,
    skip: !updateParamsBody || updateParamsBody?.length === 0,
  });

  useEffect(() => {
    if (updateObjectBody && parentIdOptions && Object.keys(parentIdOptions).length > 0) {
      setObjectId(updateObjectBody.object_id);
      const objAttributes = Object.values(parentIdOptions);
      setObjectAttributes(objAttributes);
    }
  }, [parentIdOptions, updateObjectBody]);

  useEffect(() => {
    setLoading(
      isInventoryObjectDataFetching ||
        isParamTypeNamesFetching ||
        isObjectTypesParamTypesFetching ||
        isObjectByFiltersLoading,
    );
  }, [
    isInventoryObjectDataFetching,
    isParamTypeNamesFetching,
    isObjectTypesParamTypesFetching,
    isObjectByFiltersLoading,
  ]);

  useEffect(() => {
    if (!objectTypeParamTypes) return;

    const newParamTypesConfig = objectTypeParamTypes.reduce((acc, paramType) => {
      acc[paramType.id] = paramType;
      return acc;
    }, {} as Record<number, InventoryParameterTypesModel>);

    setParamTypesConfig(newParamTypesConfig);
  }, [objectTypeParamTypes]);

  useEffect(() => {
    if (updateParamsBody && updateParamsBody[0]) {
      setObjectId(updateParamsBody[0].object_id);
      if (!inventoryObjectData?.params) return;

      const { newObjectParams, newUpdateParams } = inventoryObjectData.params.reduce(
        (acc, param) => {
          const updateParam = updateParamsBody[0].new_values.find(
            (item) => item.tprm_id === param.tprm_id,
          );

          const updateParamVersion = updateParam?.version;

          if (updateParam && updateParamVersion && param.version !== updateParamVersion) {
            acc.newObjectParams[param.tprm_id] = param;
            acc.newUpdateParams.push(updateParam);

            return acc;
          }

          return acc;
        },
        {
          newObjectParams: {} as Record<number, IInventoryObjectParamsModel>,
          newUpdateParams: [] as UpdateParameterValuesBody[],
        },
      );

      setInventoryObjectParams(newObjectParams);
      setUpdateParams(newUpdateParams);
    }
  }, [inventoryObjectData, updateParamsBody]);

  const onSubmit: SubmitHandler<ICustomInputs> = async (data) => {
    if (inventoryObjectParams && objectId) {
      const paramsBody = Object.entries(data).reduce((acc, [key, value]) => {
        if (inventoryObjectParams[+key]) {
          const newParam = {
            tprm_id: +key,
            new_value: value,
            version: inventoryObjectParams[+key].version,
          };

          acc.push(newParam);
        }
        return acc;
      }, [] as UpdateParameterValuesBody[]);

      const newUpdateParamsBody: MultipleParameterUpdateBody[] = [
        { object_id: objectId, new_values: paramsBody },
      ];

      await updateMultipleParameters(newUpdateParamsBody);
    }

    if (editingAttributes.length && inventoryObjectData && objectId) {
      const attrObject = editingAttributes.reduce((acc, item) => {
        if (item.optionName === 'Parent Name') {
          acc.p_id = item.id;
        }

        if (item.optionName === 'Point A') {
          acc.point_a_id = item.id;
        }

        if (item.optionName === 'Point B') {
          acc.point_b_id = item.id;
        }

        return acc;
      }, {} as Record<string, number>);

      const body: UpdateMultipleObjectsBody = {
        object_id: objectId,
        data_for_update: {
          version: inventoryObjectData.version,
        },
      };

      if (attrObject.p_id !== undefined && inventoryObjectData.p_id !== attrObject.p_id) {
        body.data_for_update.p_id = attrObject.p_id;
      }

      if (
        attrObject.point_a_id !== undefined &&
        inventoryObjectData.point_a_id !== attrObject.point_a_id
      ) {
        body.data_for_update.point_a_id = attrObject.point_a_id;
      }

      if (
        attrObject.point_b_id !== undefined &&
        inventoryObjectData.point_b_id !== attrObject.point_b_id
      ) {
        body.data_for_update.point_b_id = attrObject.point_b_id;
      }

      await updateMultipleObjectFn([body]);
    }

    reset();
    setUpdateParamsBody(null);
    setParentIdOptions(null);
    setUpdateObjectBody(null);
    setIsParamsResolverOpen(false);
  };

  const onApplyClick = async () => {
    await handleSubmit(onSubmit)();
    reset();
  };

  const onCancelClick = () => {
    reset();
    setUpdateParamsBody(null);
    setParentIdOptions(null);
    setUpdateObjectBody(null);
    setIsParamsResolverOpen(false);
  };

  const handleAddParam = useCallback(
    (tprmId: number) => {
      if (objectTypeParamTypes && updateParams && inventoryObjectParams) {
        const newEditingParams = objectTypeParamTypes.reduce((acc, paramType) => {
          const updateParam = updateParams.find((item) => item.tprm_id === paramType.id);

          if (updateParam && paramType.id === tprmId) {
            const newParam = {
              ...paramType,
              value: updateParam.new_value,
              tprm_id: paramType.id,
              prm_id: inventoryObjectParams[tprmId].id,
              constraint: paramType.constraint?.split(':')[1] || null,
            } as IParams;

            acc.push(newParam);
          }

          return acc;
        }, [] as IParams[]);

        setEditingParams((prev) => [...prev, ...newEditingParams]);

        const newUpdateParams = updateParams.filter((param) => param.tprm_id !== tprmId);
        setUpdateParams(newUpdateParams);
      }
    },
    [inventoryObjectParams, objectTypeParamTypes, updateParams],
  );

  const handleRemoveParam = useCallback(
    (tprmId: number) => {
      const newEditingParams = editingParams.filter((param) => param.tprm_id !== tprmId);
      setEditingParams(newEditingParams);

      if (updateParamsBody && updateParamsBody[0]) {
        const paramToRemove = updateParamsBody[0].new_values.find(
          (param) => param.tprm_id === tprmId,
        );

        if (paramToRemove) {
          const newUpdateParams = [...updateParams, paramToRemove];
          setUpdateParams(newUpdateParams);
        }
      }

      reset({ [tprmId.toString()]: '' });
      unregister(tprmId.toString());
    },
    [editingParams, reset, unregister, updateParams, updateParamsBody],
  );

  const handleAddAttribute = useCallback(
    (id: number) => {
      if (updateObjectBody && parentIdOptions) {
        const newEditingAttributes = Object.values(parentIdOptions).find((item) => item.id === id);

        if (newEditingAttributes) {
          setEditingAttributes([...editingAttributes, newEditingAttributes]);

          const newObjectAttributes = objectAttributes.filter((item) => item.id !== id);
          setObjectAttributes(newObjectAttributes);
        }
      }
    },
    [editingAttributes, objectAttributes, parentIdOptions, updateObjectBody],
  );

  const handleRemoveAttribute = useCallback(
    (id: number, attrName: string) => {
      const newEditingAttributes = editingAttributes.filter((item) => item.id !== id);
      setEditingAttributes(newEditingAttributes);

      if (updateObjectBody && parentIdOptions) {
        const attr = Object.values(parentIdOptions).find((item) => item.optionName === attrName);

        if (attr) {
          const newObjectAttributes = [...objectAttributes, attr];
          setObjectAttributes(newObjectAttributes);
        }
      }
    },
    [editingAttributes, objectAttributes, parentIdOptions, updateObjectBody],
  );

  const setParentIDOption = useCallback(
    (newOption: ParentIDOption | null, attrName?: string) => {
      const newEditingAttributes = editingAttributes.map((item) => {
        if (newOption && item.optionName === newOption.optionName) {
          return newOption;
        }

        if (!newOption && attrName) {
          return {
            id: null,
            name: '',
            optionName: attrName,
          };
        }

        return item;
      });

      // @ts-ignore
      setEditingAttributes(newEditingAttributes);
    },
    [editingAttributes],
  );

  return (
    <FormProvider {...form}>
      <SC.ParamVersionsResolverStyled>
        {loading && (
          <SC.LoadingContainer>
            <LoadingAvataa />
          </SC.LoadingContainer>
        )}

        {!loading && (
          <>
            <SC.Header>
              <Typography variant="body2">
                {translate('The parameters have been changed, do you want to overwrite them?')}
              </Typography>
            </SC.Header>
            <SC.Body>
              <Box component="div" display="flex" width="100%">
                <Typography variant="body1" sx={{ width: '33%' }}>
                  {translate('Current data')}
                </Typography>
                <Divider orientation="vertical" />

                <Typography variant="body1" sx={{ width: '33%', paddingLeft: '5px' }}>
                  {translate('Changes to apply')}
                </Typography>
                <Divider orientation="vertical" />

                <Typography variant="body1" sx={{ width: '33%', paddingLeft: '5px' }}>
                  {translate('Your changes')}
                </Typography>
              </Box>

              <Divider />

              <Box
                component="div"
                display="flex"
                width="100%"
                sx={{
                  overflow: 'hidden',
                }}
              >
                <CurrentData
                  paramTypeNamesData={paramTypeNamesData}
                  paramTypesConfig={paramTypesConfig}
                  inventoryObjectParams={inventoryObjectParams}
                  objectByFilters={objectByFilters}
                />

                <Divider orientation="vertical" flexItem />

                <ApplyData
                  editingParams={editingParams}
                  editingAttributes={editingAttributes}
                  handleRemoveParam={handleRemoveParam}
                  handleRemoveAttribute={handleRemoveAttribute}
                  setParentIDOption={setParentIDOption}
                />

                <Divider orientation="vertical" flexItem />

                <UserData
                  paramTypeNamesData={paramTypeNamesData}
                  paramTypesConfig={paramTypesConfig}
                  updateParams={updateParams}
                  objectAttributes={objectAttributes}
                  handleAddParam={handleAddParam}
                  handleAddAttribute={handleAddAttribute}
                />
              </Box>
            </SC.Body>
          </>
        )}

        <SC.Footer>
          <Button variant="contained" disabled={loading} onClick={onCancelClick}>
            {translate('Cancel')}
          </Button>
          <Button
            variant="contained"
            disabled={
              loading ||
              Object.keys(formState.errors).length > 0 ||
              (updateParamsBody !== null &&
                updateParamsBody.length !== 0 &&
                editingParams.length === 0) ||
              (updateObjectBody !== null &&
                Object.keys(updateObjectBody).length !== 0 &&
                editingAttributes.length === 0)
            }
            onClick={onApplyClick}
          >
            {translate('Apply')}
          </Button>
        </SC.Footer>
      </SC.ParamVersionsResolverStyled>
    </FormProvider>
  );
};
