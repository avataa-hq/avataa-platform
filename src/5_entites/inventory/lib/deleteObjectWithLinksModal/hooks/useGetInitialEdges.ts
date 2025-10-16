import {
  CustomEdgeProps,
  InitialSourceObjectValues,
  MoLinkInfoModel,
  OutMoLinkData,
} from '6_shared';
import { MarkerType } from '@xyflow/react';
import { useMemo } from 'react';
import { useGetConnectorToTprmEdges } from './useGetConnectorToTprmEdges';

interface IProps {
  incMoLinkInfo?: MoLinkInfoModel[];
  outMoLinkInfo?: OutMoLinkData[];
  moId: number;
  customEdgeProps: CustomEdgeProps;
  outgoingLinkObjectToDeleteInitialValues: InitialSourceObjectValues;
}

export const useGetInitialEdges = ({
  incMoLinkInfo,
  outMoLinkInfo,
  moId,
  customEdgeProps,
  outgoingLinkObjectToDeleteInitialValues,
}: IProps) => {
  const getConnectorToTprmEdges = useGetConnectorToTprmEdges();

  // Edges connecting incoming object with it's tprm. For visual representation only
  const incomingObjToTprmEdges = useMemo(() => {
    if (!incMoLinkInfo) return [];

    return incMoLinkInfo.map((item) => ({
      source: `incObj_${item.mo_id}_tprm_view`,
      target: `incObj_${item.mo_id}_tprm_${item.tprm_id}`,
      id: `vis-edge_${item.mo_id}_tprm_view`,
      reconnectable: false,
      markerEnd: { type: MarkerType.ArrowClosed },
    }));
  }, [incMoLinkInfo]);

  // Edges connecting incoming object tprm with initial connector object
  const incomingTprmToConnectorEdges = useMemo(() => {
    if (!incMoLinkInfo) return [];
    const { data, ...rest } = customEdgeProps;

    return incMoLinkInfo.map((item) => ({
      source: `incObj_${item.mo_id}_tprm_${item.tprm_id}`,
      target: `object-connector_${moId}`,
      id: `xy-edge__incObj_${item.mo_id}_tprm_${item.tprm_id}-object-connector_${moId}`,
      data: {
        ...data,
        logical: {
          initialValues: item.value,
          objectId: item.mo_id,
          new_values: [
            {
              tprm_id: item.tprm_id,
              new_value: moId,
            },
          ],
          multiple: item.multiple,
        },
      },
      ...rest,
    }));
  }, [incMoLinkInfo, customEdgeProps, moId]);

  // Edges connecting initial connector object with it's tprms. For visual representation only
  const connectorToTprmEdges = useMemo(
    () => getConnectorToTprmEdges({ outMoLinkInfo, moId }),
    [getConnectorToTprmEdges, moId, outMoLinkInfo],
  );

  // Edges connecting connector object with outgoing object
  const tprmsToOutgoingObjectEdges = useMemo(() => {
    if (!outMoLinkInfo || !outgoingLinkObjectToDeleteInitialValues) return [];

    const { data, ...rest } = customEdgeProps;
    return outMoLinkInfo.map((item) => {
      const { tprm_id, mo_out_info } = item;
      return {
        source: `object-connector_${moId}_tprm_${tprm_id}`,
        target: `out-obj_${mo_out_info.id}`,
        sourceHandle: String(tprm_id),
        targetHandle: String(tprm_id),
        id: `xy-edge__object-connector_${moId}_tprm_${tprm_id}-out-obj_${mo_out_info.id}`,
        data: {
          ...data,
          logical: {
            initialValues: outgoingLinkObjectToDeleteInitialValues?.[moId]?.[tprm_id] || [],
            objectId: moId,
            new_values: [{ tprm_id, new_value: mo_out_info.id }],
            multiple: item.multiple,
          },
        },
        ...rest,
      };
    });
  }, [outMoLinkInfo, customEdgeProps, moId, outgoingLinkObjectToDeleteInitialValues]);

  return useMemo(
    () => [
      ...incomingObjToTprmEdges,
      ...incomingTprmToConnectorEdges,
      ...connectorToTprmEdges,
      ...tprmsToOutgoingObjectEdges,
    ],
    [
      incomingObjToTprmEdges,
      incomingTprmToConnectorEdges,
      connectorToTprmEdges,
      tprmsToOutgoingObjectEdges,
    ],
  );
};
