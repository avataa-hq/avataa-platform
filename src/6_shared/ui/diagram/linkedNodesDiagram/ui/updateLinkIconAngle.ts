import { getLinkIconAngle } from '../lib';
import { D3LinkSelection, InputNode } from '../model';

export const updateLinkIconAngle = <N extends InputNode = InputNode>(link: D3LinkSelection<N>) => {
  const iconAngle = getLinkIconAngle(link.datum());
  link
    .select('.data-source__link-icon')
    .select('.svg-transform-container')
    .attr('transform-origin', '50% 50%')
    .attr('transform', `rotate(${iconAngle})`);
};
