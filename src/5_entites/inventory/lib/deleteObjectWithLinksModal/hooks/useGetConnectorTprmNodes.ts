import { ConnectorObjParamTypeNode, InitialSourceObjectValues, OutMoLinkData } from '6_shared';
import { useCallback } from 'react';

interface IArgs {
  outMoLinkInfo?: OutMoLinkData[];
  moId: number;
  startYAxisPosition: number;
  connectorObjectInitialValues?: InitialSourceObjectValues;
  idObjectAdded?: boolean;
}

export const useGetConnectorTprmNodes = () => {
  return useCallback(
    ({
      outMoLinkInfo,
      moId,
      startYAxisPosition,
      connectorObjectInitialValues,
      idObjectAdded,
    }: IArgs) => {
      if (!outMoLinkInfo) return [];

      return outMoLinkInfo.reduce<ConnectorObjParamTypeNode[]>((acc, curr) => {
        let positionCounter = acc.length;

        if (
          !acc.find((item) => String(item.id) === `object-connector_${moId}_tprm_${curr.tprm_id}`)
        ) {
          const node: ConnectorObjParamTypeNode = {
            id: `object-connector_${moId}_tprm_${curr.tprm_id}`,
            position: { x: 500, y: startYAxisPosition + 50 * positionCounter },
            data: {
              paramTypeName: curr.tprm_name,
              connectionValidationId: String(curr.tprm_id),
              logical: {
                objectId: moId,
                tprmId: curr.tprm_id,
                multiple: curr.multiple,
                initialValues: connectorObjectInitialValues?.[moId]?.[curr.tprm_id] || [],
              },
            },
            type: 'connectorObjectParamTypeNode',
          };

          // Only for added objects - block connection if tprm is not multiple and already has value
          if (connectorObjectInitialValues && idObjectAdded) {
            node.data.isConnectionBlocked =
              !curr.multiple && !!connectorObjectInitialValues[moId]?.[curr.tprm_id];
          }

          acc.push(node);
          positionCounter++;
        }
        return acc;
      }, []);
    },
    [],
  );
};
