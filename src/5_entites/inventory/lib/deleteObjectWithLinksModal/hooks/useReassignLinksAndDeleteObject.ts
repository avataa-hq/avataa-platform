import { CustomEdgeType, MultipleParameterDeleteBody } from '6_shared';
import {
  useUpdateMultipleParameters,
  useCreateMultipleParameters,
  useDeleteMultipleParameters,
  useDeleteMultipleObjects,
} from '../../../api';
import { useTransformEdgesIntoRequestBodies } from './useTransformEdgesIntoRequestBodies';

interface IProps {
  edges: CustomEdgeType[];
  objId: number;
  incomingObjectParamPairs: MultipleParameterDeleteBody[];
  outgoingObjectParamPairs: MultipleParameterDeleteBody[];
  refetchLinkValues: () => void;
}

export const useReassignLinksAndDeleteObject = ({
  edges,
  objId,
  incomingObjectParamPairs,
  outgoingObjectParamPairs,
  refetchLinkValues,
}: IProps) => {
  const { updateMultipleParameters } = useUpdateMultipleParameters();
  const { createMultipleParameters } = useCreateMultipleParameters();
  const { deleteMultipleParameters } = useDeleteMultipleParameters();

  const { updateRequestBody, deleteRequestBody, createRequestBody } =
    useTransformEdgesIntoRequestBodies({
      edges,
      objToDeleteId: objId,
      incomingObjectParamPairs,
      outgoingObjectParamPairs,
    });

  const { deleteMultipleObjectsFn } = useDeleteMultipleObjects();

  // ToDo - can we make it using isSuccesses from rtk-query hooks?
  const reassignLinksAndDelete = async () => {
    try {
      const promises: Promise<any>[] = [];

      if (updateRequestBody.length) {
        promises.push(updateMultipleParameters(updateRequestBody));
      }

      if (createRequestBody.length) {
        promises.push(createMultipleParameters(createRequestBody));
      }

      if (deleteRequestBody.length) {
        promises.push(deleteMultipleParameters(deleteRequestBody));
      }

      await Promise.all(promises);

      await deleteMultipleObjectsFn({ mo_ids: [objId] });
      refetchLinkValues();
    } catch (error) {
      console.error('Error', error);
    }
  };

  return reassignLinksAndDelete;
};
