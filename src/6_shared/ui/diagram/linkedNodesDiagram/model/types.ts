export interface InputNode {
  id: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface Node {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
}

export interface Link {
  id: number;
  source: number;
  target: number;
  icon?: string;
  label?: string;
  root?: boolean;
}

export interface PopulatedLink<N extends InputNode = InputNode>
  extends Omit<Link, 'source' | 'target'> {
  source: N & Node;
  target: N & Node;
}

export type D3NodeSelection<N extends InputNode = InputNode> = d3.Selection<
  SVGSVGElement,
  N & Node,
  any,
  unknown
>;

export type D3LinkSelection<N extends InputNode = InputNode> = d3.Selection<
  SVGGElement,
  PopulatedLink<N>,
  any,
  unknown
>;

export interface LinkedNodesDiagramData<N extends InputNode = InputNode> {
  svgRef: SVGSVGElement;
  nodes: N[];
  links: Link[];
}

export interface LinkLabelConfig {
  value: string;
  position?: number;
  offset?: number;
}

export interface LinkedNodesDiagramEvents<N extends InputNode = InputNode> {
  onLinkAdd?: (event: any, link: PopulatedLink<N>) => Promise<void> | void;
  onPanAndZoom?: (viewBox: number[]) => void;
  onLinkIconClick?: (event: any, linkData: PopulatedLink<N>) => void;
  onNodeClick?: (event: any, nodeData: N & Node) => void;
  onNodeDragEnd?: (event: any, nodeData: N & Node) => void;
}

export interface LinkedNodesDiagramOptions<N extends InputNode = InputNode> {
  nodeSvgString?: string | null;
  customNodeHtml?: ((d: N) => string) | string;

  linkIcons?: Record<string, string>;

  viewBox?: number[];
  initialViewBox?: number[];
  minZoom?: number;
  maxZoom?: number;

  linkOpacity?: ((d: PopulatedLink<N>) => number) | number;
  linkWidth?: ((d: PopulatedLink<N>) => number) | number;
  linkColor?: ((d: PopulatedLink<N>) => string) | string;
  linkOutlineColor?: ((d: PopulatedLink<N>) => string) | string;
  linkDashArray?: ((d: PopulatedLink<N>) => number[]) | number[];
  linkAnimatedDash?: boolean;
  linkAnimatedCircle?: boolean;
  isConnectionValid?: (d1: N, d2: N) => boolean;

  getLinkIcon?: ((d: PopulatedLink<N>) => string | undefined) | string;
  getLinkLabel?:
    | ((d: PopulatedLink<N>) => string | LinkLabelConfig | undefined)
    | string
    | LinkLabelConfig;
  linkIconWidth?: number;
  stopLinkIconRotation?: boolean;

  nodeFillColor?: ((d: N) => string) | string;
  nodeWidth?: ((d: N) => number) | number;
  nodeHeight?: ((d: N) => number) | number;

  connectionPointFillColor?: ((d: N) => string) | string;
  connectionPointStrokeColor?: ((d: N) => string) | string;
  connectionPointStrokeWidth?: ((d: N) => number) | number;

  newLinkOpacity?: number;
  newLinkWidth?: number;
  newLinkColor?: ((d: N & Node) => string) | string;
  newLinkDashArray?: number[];
}
