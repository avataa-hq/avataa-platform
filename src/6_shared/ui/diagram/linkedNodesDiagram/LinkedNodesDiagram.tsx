import { LegacyRef, useLayoutEffect, useMemo, useRef } from 'react';

import { Box, useTheme } from '@mui/material';

import { Link, mergeRefs } from '6_shared';
import dataSourceNodeSVG from 'assets/img/data-source_bubble.svg?raw';
import dataSourceNodeSVGDark from 'assets/img/data-source_bubble_dark.svg?raw';

import './style.css';
import { InputNode, LinkedNodesDiagramEvents, LinkedNodesDiagramOptions } from './model';
import { generateLinkedNodesDiagram } from './generateLinkedNodesDiagram';

interface LinkedNodesDiagramProps<N extends InputNode>
  extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  nodes: N[];
  links: Link[];
  options?: LinkedNodesDiagramOptions<N> & { initialZoom?: number };
  events?: LinkedNodesDiagramEvents<N>;
  svgRefs?: LegacyRef<SVGSVGElement>[];
}

/**
 * Be careful when passing props to this component. Each property from `options` and `events` MUST be memoized.
 * Otherwise, you will cause excessive re-draws of the SVG diagram. Also, this could lead to some unexpected bugs with the diagram's DOM elements, as they will be updated too.
 */
export const LinkedNodesDiagram = <N extends InputNode>({
  links,
  nodes,
  events = {},
  options = {},
  svgRefs = [],
  ...props
}: LinkedNodesDiagramProps<N>) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const initialViewbox = useMemo(
    () => [0, 0, (1 / (options.initialZoom ?? 1)) * 640, (1 / (options.initialZoom ?? 1)) * 400],
    [options.initialZoom],
  );

  const viewBox = useRef(initialViewbox);

  const onPanAndZoom = (vb: number[]) => {
    viewBox.current = vb;
  };

  useLayoutEffect(() => {
    if (!svgRef.current) return () => {};

    const { remove } = generateLinkedNodesDiagram<N>(
      {
        svgRef: svgRef.current,
        nodes,
        links,
      },
      {
        onPanAndZoom,
        ...events,
      },
      {
        viewBox: viewBox.current,
        initialViewBox: initialViewbox,
        nodeSvgString: theme.palette.mode === 'light' ? dataSourceNodeSVG : dataSourceNodeSVGDark,

        linkColor: theme.palette.primary.light,
        newLinkColor: theme.palette.primary.light,

        connectionPointStrokeColor: theme.palette.primary.main,
        ...(theme.palette.mode === 'dark' && {
          connectionPointFillColor: theme.palette.neutral.surfaceContainer,
        }),

        ...options,
      },
    );

    return () => remove();

    // Destructured `options` and `events` to trigger re-render on atomic changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    links,
    nodes,
    theme.palette.mode,
    viewBox,
    initialViewbox,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...Object.values(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...Object.values(events),
  ]);

  return (
    <Box component="div" width="100%" height="100%">
      <svg ref={mergeRefs(svgRef, ...svgRefs)} {...props} />
    </Box>
  );
};
