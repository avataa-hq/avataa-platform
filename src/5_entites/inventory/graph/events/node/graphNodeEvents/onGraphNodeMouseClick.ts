import { IG6GraphEvent } from '@antv/g6';
import { ANIMATION_DURATION, CustomNodeConfig } from '6_shared';
import { Graph3000 } from '../../../builder';

export const onGraphNodeMouseClick = (event: IG6GraphEvent, graph?: Graph3000) => {
  const clickedNode = event.item?.getModel() as CustomNodeConfig;
  if (!clickedNode) return;
  if (clickedNode.objectData?.id && clickedNode.id) {
    graph?.findAllByState('node', 'active').forEach((node) => {
      graph?.setItemState(node, 'active', false);
    });
    graph?.setItemState(clickedNode.id, 'active', !event.item?._cfg?.states?.includes('active'));
    graph?.focusItem(clickedNode.id, true, { duration: ANIMATION_DURATION });
  }
};
