import {
  CustomEdgeType,
  InitialSourceObjectValues,
  OutMoLinkData,
  objectsApi,
  useDeleteObjectWithLinks,
} from '6_shared';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { useGetConnectorToTprmEdges } from './useGetConnectorToTprmEdges';
import { useGetConnectorTprmNodes } from './useGetConnectorTprmNodes';

interface IProps {
  outMoLinkInfo?: OutMoLinkData[];
  outgoingLinkObjectInitialValues: InitialSourceObjectValues;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<CustomEdgeType[]>>;
}

const { useLazyGetObjectWithParametersQuery } = objectsApi;

export const useAddNewConnectorNode = ({
  outMoLinkInfo,
  outgoingLinkObjectInitialValues,
  setNodes,
  setEdges,
}: IProps) => {
  const getObjectConnectorTprmNodes = useGetConnectorTprmNodes();
  const getConnectorToTprmEdges = useGetConnectorToTprmEdges();

  const { addedConnectorNodesList, addedObjectId, setAddedConnectorNodesList } =
    useDeleteObjectWithLinks();

  const [getData] = useLazyGetObjectWithParametersQuery();

  return useCallback(async () => {
    if (!addedObjectId) return;

    const inventoryObjectData = await getData({
      id: addedObjectId,
    }).unwrap();

    if (inventoryObjectData) {
      setAddedConnectorNodesList([...addedConnectorNodesList, inventoryObjectData.id]);

      const newConnectorNode = {
        id: `object-connector_${inventoryObjectData.id}`,
        position: { x: 450, y: 300 * (addedConnectorNodesList.length + 1) },
        type: 'objectNode',
        dragHandle: '.custom-drag-handle',
        data: {
          objectName: inventoryObjectData.name,
          moId: inventoryObjectData.id,
          tmoId: inventoryObjectData.tmo_id,
        },
      };

      const objectConnectorTprmNodes = getObjectConnectorTprmNodes({
        outMoLinkInfo,
        moId: inventoryObjectData.id,
        startYAxisPosition: 100 + 300 * (addedConnectorNodesList.length + 1),
        connectorObjectInitialValues: outgoingLinkObjectInitialValues,
        idObjectAdded: true,
      });

      setNodes((nds) => [...nds, newConnectorNode, ...objectConnectorTprmNodes]);

      const connectorToTprmEdges = getConnectorToTprmEdges({
        outMoLinkInfo,
        moId: inventoryObjectData.id,
      });

      setEdges((egs) => [...egs, ...(connectorToTprmEdges as CustomEdgeType[])]);
    }
  }, [
    addedObjectId,
    getData,
    addedConnectorNodesList,
    getObjectConnectorTprmNodes,
    outMoLinkInfo,
    outgoingLinkObjectInitialValues,
    setNodes,
    getConnectorToTprmEdges,
    setEdges,
  ]);
};
