// DEFAULT NODES
export const DEFAULT_NODE_SIZE = 20;
export const DEFAULT_NODE_TYPE = 'default-node';
export const DEADEND_NODE_TYPE = 'deadEnd-node';
export const CABEL_NODE_TYPE = 'cabel-node';

// TABLE NODES
export const TABLE_NODE_TYPE = 'table-node';
export const TABLE_NODE_WIDTH: number = 300;
export const TABLE_NODE_COLUMN_WIDTH: number = TABLE_NODE_WIDTH / 2;
export const TABLE_NODE_COLUMN_HORIZONTAL_PADDING: number = 10;
export const TABLE_NODE_HEADER_HEIGHT: number = 30;
export const TABLE_NODE_ITEMS_PER_PAGE: number = 6;
export const TABLE_NODE_ITEM_HEIGHT: number = 27;
export const TABLE_NODE_BODY_MAX_HEIGHT: number =
  TABLE_NODE_ITEMS_PER_PAGE * TABLE_NODE_ITEM_HEIGHT;
export const TABLE_NODE_HEIGHT: number = TABLE_NODE_HEADER_HEIGHT + TABLE_NODE_BODY_MAX_HEIGHT;
// export const TABLE_NODE_MAX_HEIGHT: number = TABLE_NODE_HEADER_HEIGHT + TABLE_NODE_BODY_MAX_HEIGHT;

// EDGES
export const DEFAULT_LINE_WIDTH = 2;
export const DEFAULT_EDGE_TYPE = 'default-edge';
export const LINE_NODE_EDGE_TYPE = 'line-node-edge';
export const COMBO_EDGE_TYPE = 'line';
export const TABLE_NODE_EDGE_TYPE = 'table-node-edge';
// export const TABLE_NODE_GEOMETRY_TYPE = 'geometry_line';
export const EDGE_HITBOX_SIZE = 20;
export const EDGE_EXPAND_ICON_RADIUS = 10;
export const EDGE_EXPAND_ICON_PADDING = 4;
export const EDGE_EXPAND_ICON_LABEL_OFFSET = {
  x: EDGE_EXPAND_ICON_RADIUS,
  y: -EDGE_EXPAND_ICON_RADIUS,
};

// COMBO
export const CUSTOM_COMBO_TYPE = 'custom-combo';

// GENERAL
export const ANIMATION_DURATION = 300;
export const ANIMATION_EASING = 'easeLinear';
export const MAX_NODES_TO_SHOW = 200;
