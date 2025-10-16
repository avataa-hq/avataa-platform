import { Box } from '6_shared';
import { SyntheticEvent } from 'react';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

interface IProps {
  data: any;
  selectedItem: string;
  setSelectedItem: (event: SyntheticEvent, id: string | null) => void;
  defaultExpandedItems: string[];
}
export const ChildrenTreeView = ({
  data,
  selectedItem,
  setSelectedItem,
  defaultExpandedItems,
}: IProps) => {
  return (
    <Box sx={{ height: '100%', width: '95%' }}>
      <RichTreeViewPro
        items={data}
        selectedItems={selectedItem}
        onSelectedItemsChange={setSelectedItem}
        expansionTrigger="iconContainer"
        defaultExpandedItems={defaultExpandedItems}
      />
    </Box>
  );
};
