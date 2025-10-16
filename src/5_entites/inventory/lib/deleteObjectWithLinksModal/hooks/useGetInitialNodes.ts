import {
  IInventoryObjectModel,
  InitialSourceObjectValues,
  MoLinkInfoModel,
  OutMoLinkData,
} from '6_shared';
import { useMemo } from 'react';
import { useGetConnectorTprmNodes } from './useGetConnectorTprmNodes';

interface IProps {
  incMoLinkInfo?: MoLinkInfoModel[];
  outMoLinkInfo?: OutMoLinkData[];
  moId: number;
  inventoryObjectData?: IInventoryObjectModel;
  outgoingLinkObjectToDeleteInitialValues: InitialSourceObjectValues;
}

export const useGetInitialNodes = ({
  incMoLinkInfo,
  outMoLinkInfo,
  moId,
  inventoryObjectData,
  outgoingLinkObjectToDeleteInitialValues,
}: IProps) => {
  const getObjectConnectorTprmNodes = useGetConnectorTprmNodes();

  // Nodes displaying the incoming link object
  const incomingObjNodes = useMemo(() => {
    if (!incMoLinkInfo) return [];

    return incMoLinkInfo.map((item, i) => {
      return {
        id: `incObj_${item.mo_id}_tprm_view`,
        position: { x: 0, y: i * 110 },
        data: { objectName: item.mo_name },
        type: 'incomingLinkObjectNode',
      };
    });
  }, [incMoLinkInfo]);

  // Nodes displaying the incoming link object tprms
  const incomingTprmNodes = useMemo(() => {
    if (!incMoLinkInfo) return [];

    return incMoLinkInfo.map((item, i) => {
      return {
        id: `incObj_${item.mo_id}_tprm_${item.tprm_id}`,
        position: { x: 0, y: 55 + i * 110 },
        data: {
          paramTypeName: item.tprm_name,
          logical: {
            objectId: item.mo_id,
            tprmId: item.tprm_id,
            multiple: item.multiple,
            initialValues: item.value,
          },
        },
        type: 'incomingLinkParamTypeNode',
      };
    });
  }, [incMoLinkInfo]);

  // Node displaying the initial object for incoming and outgoing links
  const objectConnector = useMemo(() => {
    if (!inventoryObjectData) {
      return {
        id: 'noData',
        position: { x: 450, y: 0 },
        type: 'objectNode',
        data: {
          objectName: 'No data',
        },
      };
    }
    return {
      id: `object-connector_${moId}`,
      position: { x: 450, y: 0 },
      type: 'objectNode',
      dragHandle: '.custom-drag-handle',
      data: {
        objectName: inventoryObjectData.name,
        moId: inventoryObjectData.id,
        tmoId: inventoryObjectData.tmo_id,
      },
    };
  }, [inventoryObjectData, moId]);

  const objectConnectorTprmNodes = useMemo(
    () =>
      getObjectConnectorTprmNodes({
        outMoLinkInfo,
        moId,
        startYAxisPosition: 100,
        connectorObjectInitialValues: outgoingLinkObjectToDeleteInitialValues,
      }),
    [getObjectConnectorTprmNodes, moId, outMoLinkInfo, outgoingLinkObjectToDeleteInitialValues],
  );

  const outgoingObjNodes = useMemo(() => {
    return outMoLinkInfo
      ? outMoLinkInfo.map((item, i) => {
          return {
            id: `out-obj_${item.mo_out_info.id}`,
            position: { x: 900, y: i * 70 },
            data: {
              objectName: item.mo_out_info.name,
              moId: item.mo_out_info.id,
              connectionValidationId: String(item.tprm_id),
            },
            type: 'objectOutLinkNode',
          };
        })
      : [];
  }, [outMoLinkInfo]);

  return useMemo(
    () => [
      ...incomingObjNodes,
      ...incomingTprmNodes,
      objectConnector,
      ...objectConnectorTprmNodes,
      ...outgoingObjNodes,
    ],
    [
      incomingObjNodes,
      incomingTprmNodes,
      objectConnector,
      objectConnectorTprmNodes,
      outgoingObjNodes,
    ],
  );
};
