import { useEffect, useMemo, useState } from 'react';
import {
  CustomEdgeType,
  EdgeLogicalData,
  MultipleParameterDeleteBody,
  MultipleParameterUpdateBody,
} from '6_shared';

interface IProps {
  edges: CustomEdgeType[];
  objToDeleteId: number;
  incomingObjectParamPairs: MultipleParameterDeleteBody[];
  outgoingObjectParamPairs: MultipleParameterDeleteBody[];
}

const getDeleteBodyPart = (
  objectParamPairs: MultipleParameterDeleteBody[],
  objEdgesLogicalData: EdgeLogicalData[],
) => {
  return objectParamPairs.flatMap(({ object_id, tprm_id }) =>
    objEdgesLogicalData.some(
      ({ objectId, new_values }) =>
        objectId === object_id &&
        new_values.some(({ tprm_id: edgeTprmId }) => edgeTprmId === tprm_id),
    )
      ? []
      : [{ object_id, tprm_id }],
  );
};

export const useTransformEdgesIntoRequestBodies = ({
  edges,
  objToDeleteId,
  incomingObjectParamPairs,
  outgoingObjectParamPairs,
}: IProps) => {
  const [updateRequestBody, setUpdateRequestBody] = useState<MultipleParameterUpdateBody[]>([]);
  const [deleteRequestBody, setDeleteRequestBody] = useState<MultipleParameterDeleteBody[]>([]);
  const [createRequestBody, setCreateRequestBody] = useState<MultipleParameterUpdateBody[]>([]);

  const incObjEdgesLogicalData = useMemo(() => {
    const incObjEdges = edges.filter((edge) => edge.id.startsWith('xy-edge__incObj'));

    return incObjEdges.map((edge) => edge.data!.logical);
  }, [edges]);

  const outObjEdgesLogicalData = useMemo(() => {
    const outObjEdges = edges.filter((edge) => edge.id.startsWith('xy-edge__object-connector'));

    return outObjEdges.map((edge) => edge.data!.logical);
  }, [edges]);

  const incLinksDeleteRequestBody = useMemo(() => {
    return getDeleteBodyPart(incomingObjectParamPairs, incObjEdgesLogicalData);
  }, [incomingObjectParamPairs, incObjEdgesLogicalData]);

  const outLinksDeleteRequestBody = useMemo(() => {
    return getDeleteBodyPart(outgoingObjectParamPairs, outObjEdgesLogicalData);
  }, [outgoingObjectParamPairs, outObjEdgesLogicalData]);

  useEffect(() => {
    setDeleteRequestBody([...incLinksDeleteRequestBody, ...outLinksDeleteRequestBody]);
  }, [incLinksDeleteRequestBody, outLinksDeleteRequestBody]);

  useEffect(() => {
    // For incoming edges
    const incLinksUpdateRequestBodyArray: MultipleParameterUpdateBody[] = [];

    incObjEdgesLogicalData.forEach((item) => {
      const { objectId, new_values, multiple, initialValues } = item;
      if (new_values[0].new_value !== objToDeleteId) {
        if (multiple && Array.isArray(initialValues)) {
          const modifiedValue = initialValues.map((value: number) =>
            value === objToDeleteId ? new_values[0].new_value : value,
          );
          const newValueToUpdate = {
            object_id: objectId,
            new_values: [
              {
                tprm_id: new_values[0].tprm_id,
                new_value: modifiedValue,
              },
            ],
          };
          incLinksUpdateRequestBodyArray.push(newValueToUpdate);
        } else {
          const newValueToUpdate = {
            object_id: objectId,
            new_values: [
              {
                tprm_id: new_values[0].tprm_id,
                new_value: new_values[0].new_value,
              },
            ],
          };
          incLinksUpdateRequestBodyArray.push(newValueToUpdate);
        }
      }
    });

    // For outgoing edges
    const outLinksCreateRequestBodyArray: MultipleParameterUpdateBody[] = [];
    const outLinksUpdateRequestBodyArray: MultipleParameterUpdateBody[] = [];

    const groupedArray: EdgeLogicalData[] = Object.values(
      outObjEdgesLogicalData.reduce<Record<string, EdgeLogicalData>>((acc, item) => {
        const key = `${item.objectId}-${item.new_values[0].tprm_id}-${item.multiple}`;

        if (!acc[key]) {
          acc[key] = { ...item };
          if (item.multiple) {
            acc[key].new_values = [
              {
                ...item.new_values[0],
                new_value: [item.new_values[0].new_value as number],
              },
            ];
          }
        } else if (item.multiple) {
          acc[key].new_values[0].new_value = [
            ...(acc[key].new_values[0].new_value as number[]),
            item.new_values[0].new_value as number,
          ];
        }

        return acc;
      }, {}),
    );

    const transformedArray = Object.values(
      groupedArray.reduce<
        Record<number, Omit<EdgeLogicalData, 'objectId'> & { object_id: number }>
      >((acc, item) => {
        const { objectId, initialValues, new_values, multiple } = item;

        // Create or update a record for objectId
        if (!acc[objectId]) {
          acc[objectId] = {
            object_id: objectId,
            new_values: [...new_values],
            initialValues,
            multiple,
          };
        } else {
          acc[objectId].new_values.push(...new_values);
        }

        if (objectId !== objToDeleteId && multiple && Array.isArray(initialValues)) {
          acc[objectId].new_values.forEach((nv) => {
            if (Array.isArray(nv.new_value)) {
              nv.new_value.push(...initialValues);
            }
          });
        }

        return acc;
      }, {}),
    );

    // Divide into two arrays, depending on the conditions
    transformedArray.forEach(({ object_id, new_values, initialValues, multiple }) => {
      if (object_id === objToDeleteId && !multiple) {
        return;
      }

      const targetArray =
        (!multiple &&
          ((typeof initialValues === 'number' && initialValues) ||
            (Array.isArray(initialValues) && initialValues.length))) ||
        (multiple && Array.isArray(initialValues) && initialValues?.length)
          ? outLinksUpdateRequestBodyArray
          : outLinksCreateRequestBodyArray;

      targetArray.push({
        object_id,
        new_values,
      });
    });

    setUpdateRequestBody([...incLinksUpdateRequestBodyArray, ...outLinksUpdateRequestBodyArray]);
    setCreateRequestBody(outLinksCreateRequestBodyArray);
  }, [incObjEdgesLogicalData, objToDeleteId, outObjEdgesLogicalData]);

  return {
    updateRequestBody,
    deleteRequestBody,
    createRequestBody,
  };
};
