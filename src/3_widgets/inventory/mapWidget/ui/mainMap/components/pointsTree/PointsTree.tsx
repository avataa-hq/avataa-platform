import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { LineType } from '6_shared';
import { IRenderTree } from '6_shared/models/inventoryMapWidget/types';
import { PointsTreeStyled } from './PointsTree.styled';
import { TreeItemLabel } from './treeItemLabel/TreeItemLabel';

interface IProps {
  childrenTree?: IRenderTree[] | null;
  selectedObjectId?: string | number | null;
  onClick?: (clickedObject: IRenderTree) => void;
  parentLabelComponent?: (item: IRenderTree) => React.ReactNode;
  childLabelComponent?: (item: IRenderTree) => React.ReactNode;
}

const isParentItem = (item: IRenderTree) => item.children && item.children.length !== 0;

export const PointsTree = ({
  childrenTree,
  selectedObjectId,
  onClick,
  parentLabelComponent,
  childLabelComponent,
}: IProps) => {
  const getGeometryType = (item: IRenderTree) => {
    const type = item.geometry?.path?.type;
    switch (type) {
      case 'LineString':
      case 'MultiPoint':
      case 'multipoint':
        return 'line';
      default:
        return 'point';
    }
  };
  const getLabelComponent = (item: IRenderTree) => {
    const objectName = item.label && item.label !== '' ? item.label : item.name;

    const defaultLabelComponent = (
      <TreeItemLabel
        name={objectName ?? ''}
        icon={item?.icon || null}
        lineType={item.line_type as LineType}
        iconColor={item?.color}
        geometryType={getGeometryType(item)}
        selected={String(selectedObjectId) === String(item?.id)}
        onClick={() => onClick?.(item)}
      />
    );

    if (isParentItem(item) && parentLabelComponent) return parentLabelComponent(item);
    if (!isParentItem(item) && childLabelComponent) return childLabelComponent(item);

    return defaultLabelComponent;
  };
  const renderTree = (data?: IRenderTree[] | null) => {
    if (!data || data.length === 0) return null;

    return data.map((item) => (
      <TreeItem key={String(item.id)} itemId={String(item.id)} label={getLabelComponent(item)}>
        {item.children && item.children.length !== 0 && renderTree(item.children)}
      </TreeItem>
    ));
  };

  return (
    <PointsTreeStyled>
      <SimpleTreeView
        sx={{ maxHeight: '70vh', overflowY: 'auto' }}
        // defaultCollapseIcon={<ExpandMoreIcon />}
        // defaultExpandIcon={<ChevronRightIcon />}
        slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
      >
        {renderTree(childrenTree)}
      </SimpleTreeView>
    </PointsTreeStyled>
  );
};
