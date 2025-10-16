import { D3NodeSelection, InputNode, LinkedNodesDiagramOptions } from '../model';

export const setNodesWidthAndHeight = <N extends InputNode = InputNode>(
  nodes: D3NodeSelection<N>,
  width: LinkedNodesDiagramOptions<N>['nodeWidth'],
  height: LinkedNodesDiagramOptions<N>['nodeHeight'],
) => {
  const getWidth = (d: N) => {
    return typeof width === 'function' ? width(d as N) : width;
  };

  const getHeight = (d: N) => {
    return typeof height === 'function' ? height(d as N) : height;
  };

  nodes.each(function setSize(d) {
    const foreignObject = this.querySelector('foreignObject');
    const nodeDivContainer = this.querySelector<HTMLDivElement>('.lnd__node__div-container');

    // The content of `foreignObject` must not contain wrapping text!
    if (nodeDivContainer) {
      const { offsetHeight, offsetWidth } = nodeDivContainer;

      if (foreignObject)
        foreignObject.style.transform = `translate(-${offsetWidth / 2}px, -${offsetHeight / 2}px)`;

      foreignObject?.setAttribute('height', offsetHeight.toString());
      foreignObject?.setAttribute('width', offsetWidth.toString());

      d.height = offsetHeight;
      d.width = offsetWidth;
    } else {
      d.height = getHeight(d) ?? 15;
      d.width = getWidth(d) ?? 15;
    }
  });

  return nodes as unknown as D3NodeSelection<N>;
};
