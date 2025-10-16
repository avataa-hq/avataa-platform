import { getLinkPath, getCoordsAtPathPoint, getLinkLabelConfig } from '../lib';
import { D3LinkSelection, InputNode, LinkedNodesDiagramOptions, Node } from '../model';

export const updateLink = <N extends InputNode = InputNode>({
  linkSelection,
  source,
  target,
  getLinkLabel,
}: {
  linkSelection: D3LinkSelection<N>;
  source: Node;
  target: Node;
  getLinkLabel?: LinkedNodesDiagramOptions<N>['getLinkLabel'];
}) => {
  const linkPathSelection = linkSelection.select<SVGPathElement>('.lnd__link-path');
  const linkHitboxPathSelection = linkSelection.select<SVGPathElement>('.lnd__link-hitbox');
  const linkAnimatedCircleMotion = linkSelection.select<SVGCircleElement>(
    '.lnd__link-animated-circle animateMotion',
  );
  const linkIconSelection = linkSelection.select('.lnd__link-icon');
  const linkLabelSelection = linkSelection.select('.lnd__link-label');
  const linkPathEl = linkPathSelection.node();

  const linkLabelConfig = getLinkLabelConfig(getLinkLabel, linkSelection.datum());

  if (linkPathEl) {
    const pathMiddlePoint = getCoordsAtPathPoint(linkPathEl);
    linkIconSelection.attr('x', pathMiddlePoint.x);
    linkIconSelection.attr('y', pathMiddlePoint.y);

    if (linkLabelConfig.value !== '') {
      const updatedLabelPosition = getCoordsAtPathPoint(
        linkPathEl,
        linkLabelConfig.position,
        linkLabelConfig.offset,
      );
      linkLabelSelection.attr('x', updatedLabelPosition.x);
      linkLabelSelection.attr('y', updatedLabelPosition.y);
    }
  }

  const linkPath = getLinkPath({
    start: { x: source.x, y: source.y, offsetX: source.width / 2, offsetY: source.height / 2 },
    end: { x: target.x, y: target.y, offsetX: target.width / 2, offsetY: target.height / 2 },
  });

  linkPathSelection.attr('d', linkPath);
  linkHitboxPathSelection.attr('d', linkPath);
  linkAnimatedCircleMotion.attr('path', linkPath);
};
