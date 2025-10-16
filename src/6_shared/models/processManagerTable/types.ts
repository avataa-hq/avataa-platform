import { SeverityProcessModelData } from '6_shared';

export interface PmSelectedRow extends Omit<Partial<SeverityProcessModelData>, 'id'> {
  id: string | number;
  name: string;
  groupName?: string;
  isActive?: boolean;
}
