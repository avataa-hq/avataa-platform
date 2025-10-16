import { DBHLeftAreaType, InventoryAndHierarchyObjectTogether } from '6_shared';
import { HierarchyLevel } from '6_shared/api/hierarchy/types';

export const dispatchNewHierarchyAndChangeLeftAreaType = (
  setHierarchyBreadcrumbs: (
    payload: InventoryAndHierarchyObjectTogether | InventoryAndHierarchyObjectTogether[],
  ) => void,
  setLeftAreaType: (payload: DBHLeftAreaType) => void,
  setCurrentHierarchyLevelId: (payload: number | null) => void,
  object: InventoryAndHierarchyObjectTogether,
  hierarchyLevels: HierarchyLevel[],
) => {
  const { hierarchy_id, child_count, object_id, level, level_id } = object;

  const numericChildCount = Number(child_count ?? 0);
  const numericHierarchyId = Number(hierarchy_id);
  const numericObjectId = object_id ? Number(object_id) : undefined;

  const numericLevel = Number(level);

  let levelId = Number(level_id);
  let isLast = false;
  let child_level_id;
  const levelIndex = hierarchyLevels.findIndex((lvl) => +lvl.level === numericLevel);
  if (levelIndex !== -1) {
    const nextLevel = hierarchyLevels[levelIndex + 1];
    if (nextLevel) {
      levelId = +nextLevel.id;
      isLast = hierarchyLevels?.length === levelIndex + 1;
    }
  }
  if (levelIndex !== (hierarchyLevels?.length ?? 0) - 2) {
    child_level_id = String(hierarchyLevels?.[levelIndex + 2]?.id);
  }
  setCurrentHierarchyLevelId(levelId);

  const newHierarchy: InventoryAndHierarchyObjectTogether = {
    ...object,
    child_count: numericChildCount,
    hierarchy_id: numericHierarchyId,
    object_id: numericObjectId,
    level_id: String(levelId),
    parent_level_id: level_id,
    child_level_id,
  };
  setHierarchyBreadcrumbs(newHierarchy);

  const nextLeftAreaType = isLast ? 'real' : 'virtual';
  setLeftAreaType(nextLeftAreaType);
};
