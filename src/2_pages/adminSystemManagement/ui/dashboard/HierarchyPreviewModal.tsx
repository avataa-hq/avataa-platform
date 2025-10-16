import { ActionTypes, Modal, hierarchyLevels } from '6_shared';
import { Hierarchy } from '6_shared/api/hierarchy/types';
import { HierarchyTreeBuilder } from 'components/contentOfSettings/hierarchies/hirarchyTreeBuilder/HierarchyTreeBuilder';

interface IProps {
  openItemModal: { id: string; type: string } | null;
  setOpenItemModal: (item: { id: string; type: string } | null) => void;
  activeHierarchy: Hierarchy | null;
  permissions?: Record<ActionTypes, boolean>;
  settings: any;
}

const addExternalLevels = (hierarchyObjects: any[], externalLevels: any[]) => {
  if (!hierarchyObjects?.length) return [];
  const maxLevelObject = hierarchyObjects.reduce(
    (prev, curr) => (curr.level > prev.level ? curr : prev),
    hierarchyObjects[0],
  );

  const updatedHierarchyObjects = [...hierarchyObjects];
  let previousExternalId = maxLevelObject.id;

  externalLevels.forEach((externalLevel) => {
    const newObject = {
      parent_id: previousExternalId,
      id: externalLevel.tmo_id,
      level: maxLevelObject.level + externalLevel.external_level,
      name: externalLevel.name,
      object_type_id: 47477,
      hierarchy_id: maxLevelObject.hierarchy_id,
    };

    updatedHierarchyObjects.push(newObject);
    previousExternalId = externalLevel.tmo_id;
  });

  return updatedHierarchyObjects;
};

export const HierarchyPreviewModal = ({
  openItemModal,
  setOpenItemModal,
  activeHierarchy,
  permissions,
  settings,
}: IProps) => {
  const { useGetLevelsQuery } = hierarchyLevels;

  const { data: hierarchyLevelsData } = useGetLevelsQuery(activeHierarchy?.id!, {
    skip: !activeHierarchy?.id,
  });

  const updatedHierarchyObjects = addExternalLevels(hierarchyLevelsData ?? [], settings ?? []);

  return (
    <Modal
      open={!!openItemModal}
      onClose={() => setOpenItemModal(null)}
      width="80%"
      height="80%"
      ModalContentSx={{
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <HierarchyTreeBuilder
        permissions={permissions}
        activeHierarchy={activeHierarchy}
        levels={updatedHierarchyObjects}
      />
    </Modal>
  );
};
