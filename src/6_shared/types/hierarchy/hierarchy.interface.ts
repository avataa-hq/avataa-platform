export interface IHerarchyModel {
  id: number;
  name: string;
  author: string;
  created: Date | string;
  description: string;
  change_author: string | null;
  create_empty_nodes: boolean;
  modified: string | null;
  status: string | null;
}
