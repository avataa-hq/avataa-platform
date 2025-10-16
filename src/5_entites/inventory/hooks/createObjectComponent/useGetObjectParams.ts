import { useMemo } from 'react';
import {
  IInventoryObjectModel,
  IInventoryObjectParamsModel,
  IObjectComponentParams,
  parameterTypesApi,
  useProcessManager,
  useTabs,
  useUser,
} from '6_shared';
import { FieldValues, UseFormSetError, UseFormSetValue } from 'react-hook-form';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

interface IProps {
  objectTypeId: number | null;
  inventoryObjectData: IInventoryObjectModel | undefined;
  isEditing: boolean;
  setValue: UseFormSetValue<FieldValues>;
  templateFormData: Record<string, any> | null;
  setError: UseFormSetError<FieldValues>;
}

export const useGetObjectParams = ({
  objectTypeId,
  inventoryObjectData,
  isEditing,
  setValue,
  templateFormData,
  setError,
}: IProps) => {
  const { viewType } = useProcessManager();
  const { selectedTab } = useTabs();
  const { user } = useUser();

  const {
    data: objectTypeParamTypesData,
    isFetching: isObjectTypeParamTypesFetching,
    isError: isObjectTypeParamTypesError,
  } = useGetObjectTypeParamTypesQuery({ id: objectTypeId ?? 0 }, { skip: !objectTypeId });

  const { requiredParams, primaryParams, otherParams } = useMemo(() => {
    if (!objectTypeParamTypesData)
      return { requiredParams: [], primaryParams: [], otherParams: [] };

    return objectTypeParamTypesData.reduce(
      (acc, item) => {
        if (item.val_type === 'formula') return acc;

        const createdParam = inventoryObjectData?.params?.find(
          (param) => param.tprm_id === item.id,
        );

        const createParamValue = (
          paramId: number,
          exsistingParam: IInventoryObjectParamsModel | undefined,
        ) => {
          if (templateFormData?.[paramId]) {
            setValue(paramId.toString(), templateFormData[paramId]);
            return templateFormData[paramId];
          }
          if (isEditing) {
            setValue(paramId.toString(), createdParam?.value || null);
            return exsistingParam?.value || null;
          }

          if (
            !isEditing &&
            viewType === 'grid' &&
            selectedTab === 'processManager' &&
            item.name.toLocaleLowerCase().trim() === 'reporter'
          ) {
            setValue(paramId.toString(), user?.name || user?.upn || null);
            return user?.name || user?.upn || null;
          }

          return null;
        };

        const param = {
          ...item,
          prm_id: createdParam?.id || null,
          value: createParamValue(item.id, createdParam),
        };

        if (item.primary) {
          acc.primaryParams.push(param);
          if (!param.value) {
            setError(param.id.toString(), {
              type: 'required',
              message: 'This field is required',
            });
          }
        }

        if (item.required || item.primary) {
          acc.requiredParams.push(param);
          if (!param.value) {
            setError(param.id.toString(), {
              type: 'required',
              message: 'This field is required',
            });
          }
        } else {
          acc.otherParams.push(param);
        }
        return acc;
      },
      {
        requiredParams: [] as IObjectComponentParams[],
        primaryParams: [] as IObjectComponentParams[],
        otherParams: [] as IObjectComponentParams[],
      },
    );
  }, [
    objectTypeParamTypesData,
    inventoryObjectData?.params,
    templateFormData,
    isEditing,
    viewType,
    selectedTab,
    setValue,
    user?.name,
    user?.upn,
    setError,
  ]);

  return {
    objectTypeParamTypesData,
    requiredParams,
    primaryParams,
    otherParams,
    isObjectTypeParamTypesFetching,
    isObjectTypeParamTypesError,
  };
};
