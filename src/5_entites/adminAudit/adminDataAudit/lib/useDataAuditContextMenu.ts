import { useState } from 'react';
import { IDataAuditRow, IMenuPosition, useObjectDetails, useTabs } from '6_shared';

interface IProps {
  selectedRow: IDataAuditRow | null;
}

export const useDataAuditContextMenu = ({ selectedRow }: IProps) => {
  const { addAdminTab } = useTabs();

  const [contextMenuPosition, setContextMenuPosition] = useState<IMenuPosition | null>(null);

  const { pushObjectIdToStack } = useObjectDetails();

  const onContextMenuItemClick = (clickType: string) => {
    switch (clickType) {
      case 'details': {
        if (!selectedRow) return;
        if (selectedRow.instance === 'MO') {
          addAdminTab({ value: 'objectDetails' });
          pushObjectIdToStack(selectedRow.instance_id);
        }
        break;
      }

      default:
        break;
    }
  };

  return { onContextMenuItemClick, contextMenuPosition, setContextMenuPosition };
};
