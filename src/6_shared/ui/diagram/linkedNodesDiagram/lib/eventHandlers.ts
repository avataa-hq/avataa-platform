import * as d3 from 'd3';

import { D3NodeSelection, activeNodeObserver } from '../model';

export function onNodeMouseEnter(this: any) {
  if (!activeNodeObserver.getActiveNode()) {
    activeNodeObserver.setActiveNode(d3.select(this) as D3NodeSelection);
  }
}

export function onNodeMouseLeave() {
  activeNodeObserver.setActiveNode(undefined);
}
