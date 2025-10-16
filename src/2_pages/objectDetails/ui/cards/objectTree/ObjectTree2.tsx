import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Box, Typography } from '@mui/material';
import { FolderOpenRounded, FolderRounded, InsertDriveFileRounded } from '@mui/icons-material';

import {
  IInventoryObjectModel,
  LoadingAvataa,
  useTranslate,
  LoadingIndicatorContainer,
  objectsApi,
  useSetState,
  useObjectDetails,
} from '6_shared';

interface ObjectTreeProps {
  object: IInventoryObjectModel | undefined;
}

const { useLazyGetObjectWithParametersQuery, useLazyGetObjectsChildQuery } = objectsApi;

export const ObjectTree = ({ object }: ObjectTreeProps) => {
  const translate = useTranslate();
  const [activeObjectId, setActiveObjectId] = useState<number | null>(null);
  const [loadingObjectId, setLoadingObjectId] = useState<number | null>(null);
  const [rootObject, setRootObject] = useState<IInventoryObjectModel | null>(null);
  const [objectChildrenMap, setObjectChildrenMap] = useSetState<
    Record<number, Map<number, IInventoryObjectModel> | null>
  >({});
  const [objectParentsMap, setObjectParentsMap] = useState<Record<
    number,
    Map<number, IInventoryObjectModel> | null
  > | null>(null);

  const { pushObjectIdToStack } = useObjectDetails();

  const [getObject] = useLazyGetObjectWithParametersQuery();
  const objectTreeMap = useRef<Map<number, number>>(new Map());
  const [expanded, setExpanded] = useState<string[]>([]);

  const [getObjectChildren, { isFetching: isObjectChildrenFetching }] =
    useLazyGetObjectsChildQuery();

  const getParentObjectsRecursively = useCallback(
    async function getParent(
      obj: IInventoryObjectModel,
      parentsTree: Record<number, Map<number, IInventoryObjectModel> | null> = {},
    ): Promise<Record<number, Map<number, IInventoryObjectModel> | null>> {
      if (obj.p_id === null) return { ...parentsTree, 0: new Map([[0, obj]]) };

      const parentObject = await getObject({ id: obj.p_id }).unwrap();
      const updatedParentsTree = { ...parentsTree, [parentObject.id]: new Map([[obj.id, obj]]) };

      return getParentObjectsRecursively(parentObject, updatedParentsTree);
    },
    [getObject],
  );

  useEffect(() => {
    if (!rootObject) return;

    if (rootObject.p_id === null) {
      setObjectParentsMap({});
      return;
    }

    setObjectParentsMap(null);
    const fetchParentObjects = async () => {
      const parents = await getParentObjectsRecursively(rootObject);
      setObjectParentsMap(parents);
      setExpanded((prev) => [
        ...prev,
        ...Object.entries(parents).map(([key, value]) =>
          // @ts-ignore
          key === 0 && value?.has(0) ? value?.get(0)!.id.toString() : key.toString(),
        ),
      ]);
    };

    fetchParentObjects();
  }, [getParentObjectsRecursively, rootObject, setObjectParentsMap]);

  useEffect(() => {
    if (activeObjectId !== null || !object) return;

    const fetchChildren = async () => {
      setLoadingObjectId(object.id);
      const children = await getObjectChildren(object.id).unwrap();
      setLoadingObjectId(null);

      const childrenMap = new Map(children.map((child) => [child.id, child]));
      setObjectChildrenMap({ [object.id]: childrenMap });

      setActiveObjectId(object.id);
      setRootObject(object);

      objectTreeMap.current.set(object.id, object.id);
    };

    fetchChildren();
  }, [activeObjectId, getObjectChildren, object, setObjectChildrenMap]);

  useEffect(() => {
    if (!object || activeObjectId === null || !rootObject || activeObjectId === object.id) return;

    setActiveObjectId(object.id);
    if (objectTreeMap.current.get(object.id) !== rootObject.id) {
      setRootObject(object);
      objectTreeMap.current.set(object.id, rootObject.id);
    }
  }, [activeObjectId, object, rootObject]);

  useEffect(() => {
    if (!rootObject) return;

    const cachedChildren = objectChildrenMap[rootObject.id];

    if (cachedChildren === undefined) {
      const fetchChildren = async () => {
        // setLoadingObjectId(rootObject.id);
        const children = await getObjectChildren(rootObject.id).unwrap();
        // setLoadingObjectId(null);

        const childrenMap = new Map(children.map((child) => [child.id, child]));
        setObjectChildrenMap({ [rootObject.id]: childrenMap });
        // objectTreeMap.current.set(rootObject.id, rootObject.id);
      };

      fetchChildren();
    }
  }, [getObjectChildren, objectChildrenMap, rootObject, setObjectChildrenMap]);

  useEffect(() => {
    if (!activeObjectId || objectChildrenMap[activeObjectId] === null) return;

    const fetchChildren = async () => {
      const activeObjectChildren = objectChildrenMap[activeObjectId];

      setLoadingObjectId(activeObjectId);

      // eslint-disable-next-line no-restricted-syntax
      for await (const child of activeObjectChildren?.values() || []) {
        // eslint-disable-next-line no-continue
        if (objectChildrenMap[child.id] !== undefined) continue;

        const children = await getObjectChildren(child.id).unwrap();
        const childrenMap = new Map(children.map((c) => [c.id, c]));

        setObjectChildrenMap({ [child.id]: childrenMap.size ? childrenMap : null });
        if (rootObject) objectTreeMap.current.set(child.id, rootObject.id);
      }

      setLoadingObjectId(null);
    };

    fetchChildren();
  }, [
    activeObjectId,
    getObjectChildren,
    objectChildrenMap,
    rootObject,
    rootObject?.id,
    setObjectChildrenMap,
  ]);

  const handleToggle = (nodeId: number) => {
    const stringId = nodeId.toString();
    setActiveObjectId(nodeId);
    setExpanded((prev) =>
      prev.includes(stringId) ? prev.filter((id) => id !== stringId) : [...prev, stringId],
    );
  };

  const handleSelect = useCallback(
    (nodeId: number) => {
      if (activeObjectId !== nodeId) setActiveObjectId(nodeId);
    },
    [activeObjectId],
  );

  const handleItemClick = useCallback(
    (event: MouseEvent<HTMLElement>, item: IInventoryObjectModel) => {
      event.preventDefault();
      event.stopPropagation();

      // Double click logic
      if (event.detail > 1) {
        if (object && !object.p_id) setRootObject(object);
        handleToggle(item.id);
      }
      // Single click logic
      if (event.detail === 1) {
        handleSelect(item.id);
        if (object?.id !== item.id) pushObjectIdToStack(item.id);
      }
    },
    [handleSelect, object],
  );

  const renderTree = useCallback(
    (objTree: Map<number, IInventoryObjectModel> | undefined | null) => {
      if (!object || !objTree) return null;

      return Array.from(objTree).map(([, obj]) => {
        const objectTreeToRender = objectParentsMap?.[obj.id] ?? objectChildrenMap[obj.id];
        return (
          <TreeItem
            sx={{ userSelect: 'none' }}
            key={obj.id}
            itemId={obj.id.toString()}
            label={obj.name}
            onClick={(event) => handleItemClick(event, obj)}
            disabled={loadingObjectId !== null && obj.p_id === loadingObjectId}
            slots={{ icon: !objectTreeToRender?.size ? InsertDriveFileRounded : undefined }}
          >
            {renderTree(objectTreeToRender)}
          </TreeItem>
        );
      });
    },
    [handleItemClick, loadingObjectId, object, objectChildrenMap, objectParentsMap],
  );

  if (!rootObject && isObjectChildrenFetching)
    return (
      <LoadingIndicatorContainer>
        <LoadingAvataa />
      </LoadingIndicatorContainer>
    );

  if (!object)
    return (
      <Box
        component="div"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <Typography>{translate('The object is missing')}</Typography>
      </Box>
    );

  return (
    <SimpleTreeView
      sx={{ padding: '10px 0px' }}
      expandedItems={expanded}
      selectedItems={activeObjectId?.toString() ?? null}
      slots={{ collapseIcon: FolderOpenRounded, expandIcon: FolderRounded }}
    >
      {rootObject &&
        objectParentsMap &&
        renderTree(
          objectParentsMap[0] && objectParentsMap[0].has(0)
            ? new Map([[objectParentsMap[0].get(0)!.id, objectParentsMap[0].get(0)!]])
            : new Map([[rootObject.id, rootObject]]),
        )}
    </SimpleTreeView>
  );
};
