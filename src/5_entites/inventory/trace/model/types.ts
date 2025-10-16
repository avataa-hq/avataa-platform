export interface INodeByMoIdKeys {
  database_key: string;
  database_name: string;
  node_key: string;
  name: string;
  tmo?: number;
}

export interface IRoute {
  trace_node_key: string;
  route: string;
}
