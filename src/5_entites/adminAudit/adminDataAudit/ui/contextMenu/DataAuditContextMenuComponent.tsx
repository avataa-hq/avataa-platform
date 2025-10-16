import { ActionTypes, IDataAuditRow, useTranslate } from '6_shared';
import { NestedMenu, TopLevelMenuItem } from './DataAuditContextMenuComponent.styled';

interface IProps {
  onContextMenuItemClick?: (clickType: string, value?: string) => void;
  selectedRow: IDataAuditRow | null;
  permissions?: Record<ActionTypes, boolean>;
}

export const DataAuditContextMenuComponent = ({
  onContextMenuItemClick,
  selectedRow,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  const onClick = (clickType: string) => {
    onContextMenuItemClick?.(clickType);
  };

  return (
    <NestedMenu>
      <TopLevelMenuItem
        disabled={!(permissions?.update ?? true) || selectedRow?.instance !== 'MO'}
        onClick={() => onClick('details')}
      >
        {translate('Details')}
      </TopLevelMenuItem>
    </NestedMenu>
  );
};
