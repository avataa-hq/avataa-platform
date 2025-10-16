import { CustomEdgeConfig, Graph3000DataEdge } from '6_shared';

const edgeIsCustomConfigType = (
  edge: Graph3000DataEdge | CustomEdgeConfig,
): edge is CustomEdgeConfig => {
  return (edge as CustomEdgeConfig).type !== undefined;
};

const edgesListIsCustomConfigType = (
  edges: Graph3000DataEdge[] | CustomEdgeConfig[],
): edges is CustomEdgeConfig[] => {
  return (edges[0] as CustomEdgeConfig).type !== undefined;
};

export class EdgeController {
  addEdges(edge: Graph3000DataEdge | Graph3000DataEdge[] | CustomEdgeConfig | CustomEdgeConfig[]) {
    const isArray = Array.isArray(edge);

    if (!isArray) {
      if (edgeIsCustomConfigType(edge)) {
        this.addCustomConfigEdge(edge);
      } else {
        this.addSourceEdge(edge);
      }
    }

    if (isArray && edge.length) {
      if (edgesListIsCustomConfigType(edge)) {
        this.addCustomConfigEdge(edge);
      } else {
        this.addSourceEdge(edge);
      }
    }
  }

  private addSourceEdge(edge: Graph3000DataEdge | Graph3000DataEdge[]) {
    // todo
  }

  private addCustomConfigEdge(edge: CustomEdgeConfig | CustomEdgeConfig[]) {
    // todo
  }
}
