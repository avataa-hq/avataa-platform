export interface IDefaultGraphLink {
  id: string;
  name: string;
  icon: string | null;
  geometry_type: string;
  coloredTprms: { ranges?: { colors?: { hex: string; name: string }[] } };
  visible: boolean;
}

export const defaultGraphLinksData: IDefaultGraphLink[] = [
  {
    id: 'p_id',
    name: 'p_id',
    icon: null,
    geometry_type: 'graph-link',
    coloredTprms: {},
    visible: true,
  },
  {
    id: 'mo_link',
    name: 'mo_link',
    icon: null,
    geometry_type: 'graph-link',
    coloredTprms: {},
    visible: true,
  },
  {
    id: 'point_a',
    name: 'point_a',
    icon: null,
    geometry_type: 'graph-link',
    coloredTprms: {},
    visible: true,
  },
  {
    id: 'point_b',
    name: 'point_b',
    icon: null,
    geometry_type: 'graph-link',
    coloredTprms: {},
    visible: true,
  },
  {
    id: 'collapsed',
    name: 'collapsed',
    icon: null,
    geometry_type: 'graph-link',
    coloredTprms: {},
    visible: true,
  },
  {
    id: 'geometry_line',
    name: 'geometry_line',
    icon: null,
    geometry_type: 'graph-link',
    coloredTprms: {},
    visible: true,
  },
];

export const defaultGraphLinksConfig = defaultGraphLinksData.reduce((acc, link) => {
  acc[link.id] = link;
  return acc;
}, {} as Record<string, IDefaultGraphLink>);
