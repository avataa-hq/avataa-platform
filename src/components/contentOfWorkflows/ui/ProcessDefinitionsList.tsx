import { useEffect, useMemo, useState } from 'react';
import { Folder, InsertDriveFileRounded } from '@mui/icons-material';
import { IGetProcessDefinitionModel, IProcessDefinition, useTabs, useWorkflows } from '6_shared';
import { ItemTreeList } from '6_shared/ui/itemTreeList';
import { useSaveWarningModal } from '../lib';

interface ProcessDefinitionsListProps {
  data?: IGetProcessDefinitionModel;
}

const ProcessDefinitionsList = ({ data }: ProcessDefinitionsListProps) => {
  const {
    activeItem,
    isDiagramChanged,
    newItem,
    setActiveItem,
    setIsDiagramChanged,
    setNewItem,
    setSaveWarningModalState,
    setUniqueWorkflowsNames,
  } = useWorkflows();
  const { selectedTab } = useTabs();

  const [groupedProcessDefinitions, setGroupedProcessDefinitions] = useState(
    {} as Record<string, any>,
  );

  const saveWarningModal = useSaveWarningModal();

  useEffect(() => {
    setNewItem({ isCollapsed: false, item: null });
    setActiveItem({ isCollapsed: false, item: null });
  }, [selectedTab]);

  useEffect(() => {
    if (!data) return;

    const groupedData = data.items.reduce((groups, item) => {
      const { bpmnProcessId } = item;

      if (!groups[bpmnProcessId]) {
        groups[bpmnProcessId] = [];
      }

      groups[bpmnProcessId].push(item);

      return groups;
    }, {} as Record<string, IProcessDefinition[]>);

    setGroupedProcessDefinitions(groupedData);
  }, [data]);

  const itemsArray = useMemo(() => {
    return activeItem.isCollapsed && activeItem.item
      ? groupedProcessDefinitions[activeItem.item?.bpmnProcessId]?.toSorted(
          (a: any, b: any) => b.version - a.version,
        )
      : Object.values(groupedProcessDefinitions).map((arr) =>
          arr.reduce((latest: IProcessDefinition, current: IProcessDefinition) =>
            current.version > latest.version ? current : latest,
          ),
        );
  }, [activeItem.isCollapsed, activeItem.item, groupedProcessDefinitions]);

  const getItemIcon = (item: any) => {
    if (activeItem.isCollapsed) return <InsertDriveFileRounded />;

    const versions = groupedProcessDefinitions[item.bpmnProcessId];
    if (versions && versions.length > 1) {
      return <Folder />;
    }

    return <InsertDriveFileRounded />;
  };

  useEffect(() => {
    const uniqueNames = [
      ...new Set(itemsArray.map((item: any) => item.name || item.key.toString())),
    ] as string[];

    if (!uniqueNames.length) return;
    setUniqueWorkflowsNames(uniqueNames);
  }, [itemsArray]);

  return (
    <ItemTreeList
      items={newItem.item ? [...itemsArray, newItem.item] : itemsArray}
      activeItem={activeItem.item}
      itemKeyAsId="key"
      getItemId={(item) => item.key}
      getItemName={(item) =>
        activeItem.isCollapsed
          ? `(v${item.version}) ${item.name ?? item.key}`
          : item.name ?? item.key
      }
      getItemIcon={(item) => getItemIcon(item)}
      onItemClick={async (e, item) => {
        if (activeItem.item && isDiagramChanged && item.key !== activeItem.item?.key) {
          try {
            await saveWarningModal();
            setIsDiagramChanged(false);
            setNewItem({ isCollapsed: false, item: null });
            setActiveItem({ isCollapsed: activeItem.isCollapsed, item });
            setSaveWarningModalState({ isOpen: false });
          } catch (error) {
            setSaveWarningModalState({ isOpen: false });
          }
        } else {
          setActiveItem({ isCollapsed: activeItem.isCollapsed, item });
        }
      }}
      onItemDoubleClick={async (e, item) => {
        // Checking if item has more than 1 versions
        if (
          groupedProcessDefinitions[item.bpmnProcessId] &&
          groupedProcessDefinitions[item.bpmnProcessId].length > 1 &&
          !activeItem.isCollapsed
        ) {
          setActiveItem({ item, isCollapsed: true });
        } else {
          setActiveItem({ item, isCollapsed: activeItem.isCollapsed });
        }
      }}
      parents={activeItem.item !== null && activeItem.isCollapsed ? [activeItem.item] : []}
      onRootClick={() =>
        activeItem.item &&
        setActiveItem({
          item: groupedProcessDefinitions[activeItem.item?.bpmnProcessId][
            groupedProcessDefinitions[activeItem.item?.bpmnProcessId].length - 1
          ],
          isCollapsed: false,
        })
      }
      displayRoot
    />
  );
};

export default ProcessDefinitionsList;
