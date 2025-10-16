import { CustomNodeConfig, Graph3000Data, GraphTmosWithColorRanges } from '6_shared';
import { getObjectColor } from '../../lib';

export const getPopulatedNodes = <N extends Graph3000Data['nodes'][number]>(
  nodes: N[],
  colorData?: GraphTmosWithColorRanges,
): CustomNodeConfig[] => {
  const populatedNodes = nodes.map((node) => {
    const tmo = node.data?.tmo_id ? colorData?.[node.data.tmo_id] : undefined;

    const getLineType = () => {
      if (tmo?.line_type && (tmo?.line_type as unknown as string) !== 'string') {
        return tmo.line_type;
      }
      if (tmo?.icon) return tmo.icon;
      return 'solid';
    };

    const objectName = node.label && node.label !== '' ? node.label : node.name;

    const getCorrectGeometryType = () => {
      if (tmo?.geometry_type) return tmo?.geometry_type;
      if (node.data?.geometry != null && !tmo?.geometry_type) return 'line';
      return undefined;
    };

    return {
      id: node.key,
      key: node.key,
      tmo: node.tmo,
      name: objectName ?? '',
      muiIcon: tmo?.icon,
      lineType: getLineType() as any,
      geometryType: getCorrectGeometryType(),
      objectData: node.data,
      color: tmo ? getObjectColor(node.data?.params ?? [], tmo) : undefined,
      breadcrumbs: node.breadcrumbs,
      visible: tmo?.visible,
    };
  });

  return populatedNodes;
};
