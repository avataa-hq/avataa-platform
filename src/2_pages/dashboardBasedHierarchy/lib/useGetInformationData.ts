import { useGetReturnableParamTypes } from '5_entites';
import { useEffect, useMemo, useState } from 'react';
import { IInventoryObjectModel, InventoryAndHierarchyObjectTogether } from '6_shared';

interface IProps {
  selectHierarchyNodeObject?: InventoryAndHierarchyObjectTogether | null;
  hierarchyInventoryObjects?: IInventoryObjectModel[];
}

export const useGetInformationData = ({
  selectHierarchyNodeObject,
  hierarchyInventoryObjects,
}: IProps) => {
  const [objectForInformation, setObjectForInformation] = useState<IInventoryObjectModel | null>(
    null,
  );

  const { returnableParamTypes } = useGetReturnableParamTypes({
    pmTmoId: objectForInformation?.tmo_id,
  });

  useEffect(() => {
    if (!selectHierarchyNodeObject) {
      setObjectForInformation(null);
    }
    const inventoryObject = hierarchyInventoryObjects?.find(
      ({ id }) => String(id) === String(selectHierarchyNodeObject?.object_id),
    );
    if (inventoryObject) setObjectForInformation(inventoryObject);
  }, [selectHierarchyNodeObject, hierarchyInventoryObjects]);

  const informationResultData = useMemo(() => {
    const newData: Record<string, any> = {};

    if (!objectForInformation && selectHierarchyNodeObject) {
      const { key, child_count, label } = selectHierarchyNodeObject;
      newData.Name = key;
      if (label) newData.Label = label;
      if (child_count != null) {
        newData['Child count'] = String(child_count);
      }
    }
    if (objectForInformation && returnableParamTypes) {
      Object.keys(objectForInformation?.parameters ?? {}).forEach((objParam) => {
        const matchedParam = returnableParamTypes.find((param) => param.id.toString() === objParam);

        if (matchedParam) {
          newData[matchedParam.name] = objectForInformation.parameters?.[objParam];
        }
      });
    }

    return newData;
  }, [objectForInformation, returnableParamTypes, selectHierarchyNodeObject]);

  return { informationResultData };
};
