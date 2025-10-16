import { Graph3000Config } from '6_shared';

export const graphDefaultConfig: Graph3000Config = {
  link: {
    style: {
      p_id: {
        stroke: '#111729',
        strokeWidth: 2,
      },
      mo_link: {
        stroke: '#111729',
        strokeWidth: 1,
      },
      point_a: {
        stroke: '#111729',
        strokeWidth: 2,
        strokeDasharray: [3, 5],
      },
      point_b: {
        stroke: '#111729',
        strokeWidth: 2,
        strokeDasharray: [3, 5],
      },
      collapsed: {
        stroke: '#111729',
        strokeWidth: 1,
      },
      'line-node': {
        stroke: '#111729',
        strokeWidth: 2,
      },
      geometry_line: {
        stroke: '#111729',
        strokeWidth: 2,
        strokeDasharray: [3, 5],
      },
      default: {
        stroke: '#111729',
        strokeWidth: 1,
      },
    },
  },
};
