import {
  createMultipleEditBody,
  getFilteredData,
  useCreateMultipleParameters,
  useGetObjectTypeParamTypes,
  useUpdateMultipleParameters,
} from '5_entites';
import { CreateParamTypeBody, parameterTypesApi, PmSelectedRow, useTranslate } from '6_shared';

const createAssigneeParamType = (tmo_id: number): CreateParamTypeBody => {
  return {
    name: 'assignee',
    val_type: 'user_link',
    tmo_id,
    returnable: true,
  };
};

interface IProps {
  afterSuccess?: () => void;
  tmoId?: number;
  pmSelectedRows?: PmSelectedRow[];

  createParamIfNotExist?: boolean;
}
export const useOwnerAssign = ({
  afterSuccess,
  tmoId,
  pmSelectedRows,
  createParamIfNotExist,
}: IProps) => {
  const { useCreateParamTypeMutation } = parameterTypesApi;

  const translate = useTranslate();

  const { objectTypeParamTypes } = useGetObjectTypeParamTypes({
    objectTmoId: tmoId,
  });

  const [createParamType] = useCreateParamTypeMutation();
  const { createMultipleParameters } = useCreateMultipleParameters();
  const { updateMultipleParameters } = useUpdateMultipleParameters();

  const ownerAssign = async (owner: string) => {
    const newObjectsByFilters = Object.entries(pmSelectedRows?.[0] || {}).reduce<
      Record<string, any>
    >((acc, [key, value]) => {
      if (Number.isNaN(Number(key))) {
        acc[key] = value;
      } else {
        if (!acc.parameters) {
          acc.parameters = {};
        }
        acc.parameters[key] = value;
      }
      return acc;
    }, {});

    const ownerTprmId = objectTypeParamTypes?.find(
      (param) => param.name.toLowerCase() === 'owner' || param.name.toLowerCase() === 'assignee',
    )?.id;

    if (ownerTprmId) {
      const { createParamsBody, updateParamsBody } = createMultipleEditBody({
        objectsByFilters: [newObjectsByFilters as any],
        newData: getFilteredData({ data: { [ownerTprmId]: owner }, paramTypeIds: [ownerTprmId] }),
      });

      if (createParamsBody.length) {
        await createMultipleParameters(createParamsBody, translate('Owner changed successfully'));
        afterSuccess?.();
      }

      if (updateParamsBody.length) {
        await updateMultipleParameters(updateParamsBody, translate('Owner changed successfully'));
        afterSuccess?.();
      }
    } else if (createParamIfNotExist) {
      if (!tmoId) return;
      const res = await createParamType(createAssigneeParamType(tmoId)).unwrap();
      if (res) {
        const { createParamsBody } = createMultipleEditBody({
          objectsByFilters: [newObjectsByFilters as any],
          newData: getFilteredData({ data: { [res.id]: owner }, paramTypeIds: [res.id] }),
        });

        if (createParamsBody.length) {
          await createMultipleParameters(createParamsBody, translate('Owner changed successfully'));
          afterSuccess?.();
        }
      }
    }
  };

  return { ownerAssign };
};
