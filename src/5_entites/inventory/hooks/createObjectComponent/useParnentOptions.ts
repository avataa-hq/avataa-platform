import { useEffect, useMemo, useState } from 'react';
import {
  createOptionsIDList,
  ParentIDOption,
  useSearchObjectsByNameWithMisspelledWords,
} from '5_entites';
import {
  IInventoryObjectModel,
  IParentIDOption,
  ObjectByFilters,
  searchApiV2,
  useDebounceValue,
  useHierarchy,
  useObjectCRUD,
  useParamsResolver,
} from '6_shared';
import { useFormContext } from 'react-hook-form';
import { useSearchPointIdByName } from './useSearchPointIdByName';

interface IProps {
  objectId: number | null;
  inventoryObjectData: IInventoryObjectModel | undefined;
  objectByFilters: ObjectByFilters | undefined;
  selectedObjectParentID?: number | null;
  tmoParentId: number | null;
  pointsConstraintByTmo: number[];
  debounceSearchValue: string;
}

export const useParnentOptions = ({
  objectId,
  inventoryObjectData,
  objectByFilters,
  selectedObjectParentID,
  tmoParentId,
  pointsConstraintByTmo,
  debounceSearchValue,
}: IProps) => {
  const { useGetObjectsByIdsQuery } = searchApiV2;

  const { setValue, getValues } = useFormContext();

  const [pointIDInputValue, setPointIDInputValue] = useState('');
  const [objectParentID, setObjectParentID] = useState<IParentIDOption | null>(null);
  const [objectPointAID, setObjectPointAID] = useState<IParentIDOption | null>(null);
  const [objectPointBID, setObjectPointBID] = useState<IParentIDOption | null>(null);
  const debouncedValue = useDebounceValue(pointIDInputValue);
  const [parentIDOptions, setParentIDOptions] = useState<IParentIDOption[]>([]);

  const { objectCRUDComponentUi, geometryPointsDetails, createChildObjectId, duplicateObject } =
    useObjectCRUD();
  const { objectCRUDComponentMode } = objectCRUDComponentUi;
  const { setParentIdOptions } = useParamsResolver();
  const { parentItems } = useHierarchy();

  const {
    objectsByNameWithMisspelledWordsData,
    isObjectsByNameWithMisspelledWordsFetching,
    isObjectsByNameWithMisspelledWordsError,
  } = useSearchObjectsByNameWithMisspelledWords({
    searchValue: debounceSearchValue,
    tmo_id: tmoParentId ?? 0,
    skip: !tmoParentId,
  });

  const { parentABIDOptions, isFetchingObjectsDataByName } = useSearchPointIdByName({
    searchValue: debouncedValue,
    objectTypeIds: pointsConstraintByTmo,
  });

  const objectParentIds = useMemo(() => {
    const parentIds: number[] = [];
    if (!inventoryObjectData) return parentIds;

    if (inventoryObjectData.p_id) {
      parentIds.push(inventoryObjectData.p_id);
    }

    if (inventoryObjectData.point_a_id) {
      parentIds.push(inventoryObjectData.point_a_id);
    }

    if (inventoryObjectData.point_b_id) {
      parentIds.push(inventoryObjectData.point_b_id);
    }

    if (createChildObjectId) {
      parentIds.push(createChildObjectId);
    }

    if (selectedObjectParentID) {
      parentIds.push(selectedObjectParentID);
    }

    return parentIds;
  }, [inventoryObjectData, createChildObjectId, selectedObjectParentID]);

  const { data: cachedObjectsDataByIds } = searchApiV2.endpoints.getObjectsByIds.useQueryState(
    objectParentIds,
    {
      skip: !objectParentIds.length,
    },
  );

  const { data: objectsDataByIds } = useGetObjectsByIdsQuery(objectParentIds, {
    skip: !objectParentIds.length || !!cachedObjectsDataByIds,
  });

  const objectsDataByIdsData = useMemo(
    () => cachedObjectsDataByIds ?? objectsDataByIds,
    [cachedObjectsDataByIds, objectsDataByIds],
  );

  useEffect(() => {
    if (!objectsDataByIdsData) return;
    const currentParentIdOptions = createOptionsIDList(objectsDataByIdsData);

    if (selectedObjectParentID) {
      const selectedObjectOpt = currentParentIdOptions.find(
        (opt) => opt.id === selectedObjectParentID,
      );
      if (selectedObjectOpt && selectedObjectOpt.tmoId === tmoParentId) {
        setObjectParentID(selectedObjectOpt);
        setValue('p_id', selectedObjectOpt);
      }
    }

    if (objectCRUDComponentMode === 'creating' && createChildObjectId) {
      const pointPIDData = currentParentIdOptions.find((opt) => opt.id === createChildObjectId);
      setObjectParentID(pointPIDData ?? null);
      setValue('p_id', pointPIDData ?? null);
    }

    if (
      objectCRUDComponentMode === 'editing' ||
      (objectCRUDComponentMode === 'creating' && duplicateObject)
    ) {
      currentParentIdOptions.forEach((option) => {
        if (option.id === inventoryObjectData?.p_id && getValues('p_id') === undefined) {
          setObjectParentID(option);
          setValue('p_id', option);
        }
        if (
          option.id === inventoryObjectData?.point_a_id &&
          getValues('point_a_id') === undefined
        ) {
          setObjectPointAID(option);
          setValue('point_a_id', option);
        }
        if (
          option.id === inventoryObjectData?.point_b_id &&
          getValues('point_b_id') === undefined
        ) {
          setObjectPointBID(option);
          setValue('point_b_id', option);
        }
      });
    }
  }, [
    objectsDataByIdsData,
    inventoryObjectData,
    objectCRUDComponentMode,
    createChildObjectId,
    duplicateObject,
    selectedObjectParentID,
    tmoParentId,
    setValue,
    getValues,
  ]);

  useEffect(() => {
    if (!objectsByNameWithMisspelledWordsData) return;

    const newSearchOptions: IParentIDOption[] = objectsByNameWithMisspelledWordsData?.objects.map(
      (item) => ({
        id: item.id,
        name: item.name,
        objectName: item.name,
        tmoId: item.tmo_id,
      }),
    );

    setParentIDOptions(newSearchOptions);
  }, [objectsByNameWithMisspelledWordsData]);

  useEffect(() => {
    const updatedOptions: Record<string, ParentIDOption> = {};

    if (!objectByFilters) return;
    const { p_id, point_a_id, point_b_id } = objectByFilters;

    if (p_id && objectParentID && p_id !== objectParentID.id) {
      updatedOptions.p_id = {
        ...objectParentID,
        optionName: 'Parent Name',
      };
    }

    if (point_a_id && objectPointAID && point_a_id !== objectPointAID.id) {
      updatedOptions.point_a_id = {
        ...objectPointAID,
        optionName: 'Point A',
      };
    }

    if (point_b_id && objectPointBID && point_b_id !== objectPointBID.id) {
      updatedOptions.point_b_id = {
        ...objectPointBID,
        optionName: 'Point B',
      };
    }

    if (Object.keys(updatedOptions).length !== 0) {
      setParentIdOptions(updatedOptions);
    }
  }, [objectByFilters, getValues, objectParentID, objectPointAID, objectPointBID]);

  useEffect(() => {
    const parentCopy = [...parentItems];

    while (parentCopy.length) {
      const currentParent = parentCopy.pop();
      if (currentParent && currentParent.object_id) {
        if (currentParent.object_type_id === tmoParentId) {
          const neededObject = parentIDOptions.find((opt) => opt.id === currentParent.object_id);
          if (neededObject) {
            setObjectParentID(neededObject);
            setValue('p_id', neededObject);
          }
          break;
        }
      }
    }
  }, [parentItems, tmoParentId, parentIDOptions, setValue]);

  useEffect(() => {
    if (!geometryPointsDetails) return;
    if (geometryPointsDetails.point_a_details && !objectId) {
      setValue('point_a_id', {
        id: geometryPointsDetails.point_a_details.objectId,
        name: geometryPointsDetails.point_a_details.objectName,
        objectName: geometryPointsDetails.point_a_details.objectName,
      });
      setObjectPointAID({
        id: geometryPointsDetails.point_a_details.objectId,
        name: geometryPointsDetails.point_a_details.objectName,
        objectName: geometryPointsDetails.point_a_details.objectName,
      });
    }

    if (geometryPointsDetails.point_b_details && !objectId) {
      setValue('point_b_id', {
        id: geometryPointsDetails.point_b_details.objectId,
        name: geometryPointsDetails.point_b_details.objectName,
        objectName: geometryPointsDetails.point_b_details.objectName,
      });
      setObjectPointBID({
        id: geometryPointsDetails.point_b_details.objectId,
        name: geometryPointsDetails.point_b_details.objectName,
        objectName: geometryPointsDetails.point_b_details.objectName,
      });
    }
  }, [geometryPointsDetails, objectId, setValue]);

  return {
    setPointIDInputValue,
    parentIDOptions,
    parentABIDOptions,
    objectParentID,
    objectPointAID,
    objectPointBID,
    setObjectParentID,
    setObjectPointAID,
    setObjectPointBID,
    isFetchingObjectsDataByName,
    isObjectsByNameWithMisspelledWordsFetching,
    isObjectsByNameWithMisspelledWordsError,
  };
};
