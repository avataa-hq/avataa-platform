import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import '@xyflow/react/dist/style.css';
import {
  AllChildrenResponse,
  Box,
  IInventoryObjectModel,
  Modal,
  MoLinkInfoModel,
  OutMoLinkData,
  Search,
  TreeViewNode,
  useDeleteObjectWithLinks,
  useTranslate,
} from '6_shared';
import { Button } from '@mui/material';
import { findTreeItemById } from '5_entites/inventory/lib/deleteObjectWithLinksModal';
import { useGetAllChildren } from '../../../api';
import { ChildrenTreeView } from './ChildrenTreeView';
import { RelatedObjectsFlowChart } from './RelatedObjectsFlowChart';

interface IProps {
  initialObjectId: number;
  currentObjectId: number;
  tmoId: number;
  incMoLinkInfo?: MoLinkInfoModel[];
  outMoLinkInfo?: OutMoLinkData[];
  isOpen: boolean;
  onClose: () => void;
  inventoryObjectData?: IInventoryObjectModel;
  refetchLinkValues: () => void;
}

export const DeleteObjectWithLinksModal = ({
  initialObjectId,
  currentObjectId,
  tmoId,
  incMoLinkInfo,
  outMoLinkInfo,
  isOpen,
  onClose,
  inventoryObjectData,
  refetchLinkValues,
}: IProps) => {
  const translate = useTranslate();

  const { setCurrentTmoId, setCurrentObjectId } = useDeleteObjectWithLinks();

  const { childObjects, isChildObjectsError } = useGetAllChildren({ moId: initialObjectId });

  const transformToTreeView = useCallback((data?: AllChildrenResponse): TreeViewNode | null => {
    if (!data) return null;

    return {
      id: String(data.object_id),
      label: data.object_name,
      tmoId: data.object_type_id,
      children: data.children.flatMap((child) => {
        const transformedChild = transformToTreeView(child);
        return transformedChild ? [transformedChild] : [];
      }),
    };
  }, []);

  const allChildrenData = useMemo(
    () => transformToTreeView(childObjects),
    [childObjects, transformToTreeView],
  );

  const handleSelectedItemsChange = useCallback(
    (_: SyntheticEvent, id: string | null) => {
      if (id) {
        setCurrentObjectId(+id);
        const item = findTreeItemById(allChildrenData, id);

        if (item) {
          setCurrentTmoId(item.tmoId);
        }
      }
    },
    [allChildrenData],
  );

  const collectIds = useCallback((node?: TreeViewNode | null): string[] => {
    if (!node) return [];

    return [String(node.id), ...node.children.flatMap(collectIds)];
  }, []);

  const allIds = collectIds(allChildrenData);

  const [treeData, setTreeData] = useState<TreeViewNode[]>([]);

  useEffect(() => {
    if (allChildrenData) setTreeData([allChildrenData]);
  }, [allChildrenData]);

  // Search
  const [searchValue, setSearchValue] = useState<string>('');

  const onSearchClick = (value: string) => {
    setSearchValue(value);
  };

  const onCancelClick = () => {
    setSearchValue('');
    if (allChildrenData) setTreeData([allChildrenData]);
  };

  const findNodesByPartialLabel = useCallback(
    (node: TreeViewNode | null, value: string): TreeViewNode[] => {
      if (!node) return [];

      const result: TreeViewNode[] = [];

      const lowerCaseValue = value.toLowerCase();

      if (node.label.toLowerCase().includes(lowerCaseValue)) {
        result.push({ ...node, children: [] });
      }

      for (const child of node.children) {
        result.push(...findNodesByPartialLabel(child, value));
      }

      return result;
    },
    [],
  );

  useEffect(() => {
    if (searchValue) {
      const res = findNodesByPartialLabel(allChildrenData, searchValue);
      setTreeData(res);
    }
  }, [findNodesByPartialLabel, searchValue, allChildrenData]);

  // Close modal
  const handleClose = () => {
    onClose();
  };

  if (!currentObjectId) return null;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={`Please check ${inventoryObjectData!.name} object links before delete`}
    >
      <Box sx={{ width: '1600px', height: '800px', display: 'flex' }}>
        <Box sx={{ width: '20%', height: '100%' }}>
          <Search
            searchValue={searchValue}
            onSearchClick={onSearchClick}
            onCancelClick={onCancelClick}
            sx={{ width: '300px', marginBottom: '10px' }}
          />
          {isChildObjectsError ? (
            <Box>Too many children</Box>
          ) : (
            <Box sx={{ height: '100%', overflow: 'auto' }}>
              <ChildrenTreeView
                data={treeData}
                selectedItem={String(currentObjectId)}
                setSelectedItem={handleSelectedItemsChange}
                defaultExpandedItems={allIds}
              />
            </Box>
          )}
        </Box>
        <RelatedObjectsFlowChart
          objId={currentObjectId}
          tmoId={tmoId}
          incMoLinkInfo={incMoLinkInfo}
          outMoLinkInfo={outMoLinkInfo}
          inventoryObjectData={inventoryObjectData}
          refetchLinkValues={refetchLinkValues}
          handleClose={handleClose}
        />
        <Button
          variant="contained"
          sx={{ position: 'absolute', bottom: '50px', right: '50px' }}
          onClick={handleClose}
        >
          {translate('Close')}
        </Button>
      </Box>
    </Modal>
  );
};
