import { ITmoInfo } from '6_shared';
import type { INestedMultiFilterItem } from '../../../ui';

export interface IFilterSetModel {
  id: number;
  name: string;
  filters: INestedMultiFilterItem[];
  tmo_info: ITmoInfo;
  join_operator: string | null;
  public?: boolean;
  owner?: boolean;
  priority?: number;
  hidden?: boolean;
}
export interface IFilterSetBody extends Omit<IFilterSetModel, 'id'> {}
export interface IFilterSetPatchBody extends Partial<Omit<IFilterSetModel, 'owner'>> {}
