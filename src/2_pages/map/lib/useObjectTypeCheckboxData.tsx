import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  IInventorySearchObjectModel,
  InventoryObjectTypesModel,
  objectTypesApi,
  useInventoryMapWidget,
  useLeftPanelWidget,
} from '6_shared';
import { Box, Checkbox, CircularProgress } from '@mui/material';
import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import { IObjectTypeCustomizationParams } from '6_shared/models/inventoryMapWidget/types';

const { useLazyGetChildrenTmoDataByTmoIdQuery, useLazyGetObjectTypesQuery } = objectTypesApi;

const addItem = (prevItems: number[], newItem: number) => {
  document.dispatchEvent(new CustomEvent('tmoIdAdd', { detail: { newItem } }));
  return Array.from(new Set([...prevItems, newItem]));
};
const removeItem = (prevItems: number[], filterFn: (p: number) => boolean) => {
  return prevItems.filter(filterFn);
};

const cacheTmoParams: Record<number, InventoryObjectTypesModel[]> = {};

interface ICheckFunctionProps {
  itemId: number;
  childAllTmoIds: number[];
  tmoData?: InventoryObjectTypesModel[];
}

interface IProps {
  setObjectsByObjectTypeData?: Dispatch<SetStateAction<IInventorySearchObjectModel[]>>;
  objectTypeCustomizationParams: Record<number, IObjectTypeCustomizationParams>;
  setObjectTypeCustomizationParams: (
    payload: Record<number, IObjectTypeCustomizationParams>,
  ) => void;
  selectedObjectTypesIds: number[];
  selectNestedTMO?: boolean;
}

export const useObjectTypeCheckboxData = ({
  setObjectsByObjectTypeData,
  objectTypeCustomizationParams,
  setObjectTypeCustomizationParams,
  selectedObjectTypesIds,
  selectNestedTMO,
}: IProps) => {
  const [checkId, setCheckId] = useState<number>(0);
  const [objectTypesData, setObjectTypesData] = useState<InventoryObjectTypesModel[]>([]);

  const { setMapData } = useInventoryMapWidget();

  const { setSelectedObjectTypesIds } = useLeftPanelWidget();

  const [getChildrenObjectTypes, { isFetching: isFetchingObjectTypesData }] =
    useLazyGetChildrenTmoDataByTmoIdQuery();
  const [getOnlyTopLevelObjectTypes, { isFetching: isFetchingOnlyTopLevel }] =
    useLazyGetObjectTypesQuery();

  const getObjectTypesCacheData = useCallback(
    async (itemId: number, withNested: boolean) => {
      let tmoData: InventoryObjectTypesModel[] = [];
      if (cacheTmoParams[itemId]) {
        tmoData = cacheTmoParams[itemId];
      } else {
        tmoData = withNested
          ? await getChildrenObjectTypes({ tmoId: itemId, with_params: true }).unwrap()
          : await getOnlyTopLevelObjectTypes({
              object_types_ids: [itemId],
              with_tprms: true,
            }).unwrap();
        cacheTmoParams[itemId] = tmoData;
      }

      const childAllTmoIds: number[] = [];

      cacheTmoParams[itemId].forEach((tmo) => {
        childAllTmoIds.push(tmo.id);
        if (childAllTmoIds.length) {
          const newParams = childAllTmoIds.reduce((acc, item) => {
            const currentTmoObject = cacheTmoParams[itemId]?.find((i) => i.id === item);
            if (!currentTmoObject) return acc;
            const {
              icon,
              name,
              tprms,
              geometry_type,
              latitude,
              longitude,
              minimize,
              inherit_location,
              line_type,
            } = currentTmoObject;
            acc[item] = {
              icon: icon as IMuiIconsType | null,
              tmoName: name,
              tprms,
              visible: true,
              geometry_type,
              tmoLat: latitude,
              tmoLng: longitude,
              minimize,
              tmoInheritLocation: inherit_location,
              line_type,
            };
            return acc;
          }, {} as Record<number, IObjectTypeCustomizationParams>);

          const params = { ...objectTypeCustomizationParams, ...newParams };
          setObjectTypeCustomizationParams(params);
        }
      });

      return { childAllTmoIds, tmoData };
    },
    [
      getChildrenObjectTypes,
      getOnlyTopLevelObjectTypes,
      objectTypeCustomizationParams,

      setObjectTypeCustomizationParams,
    ],
  );

  const isCheckedFn = useCallback(
    async ({ childAllTmoIds, itemId }: ICheckFunctionProps) => {
      const newParams = [...selectedObjectTypesIds, ...childAllTmoIds];
      setSelectedObjectTypesIds(addItem(newParams, itemId));
    },
    [selectedObjectTypesIds],
  );

  const isUnCheckFn = useCallback(
    async ({ childAllTmoIds, itemId }: ICheckFunctionProps) => {
      const filterSelectedObjects = (f: number) => !childAllTmoIds.includes(f) && f !== itemId;
      const newItems = removeItem(selectedObjectTypesIds, filterSelectedObjects);
      delete cacheTmoParams[itemId];
      setSelectedObjectTypesIds(newItems);

      //= =========== =//

      setObjectsByObjectTypeData?.((prev) =>
        prev.filter((obj) => !childAllTmoIds.includes(obj.tmo_id)),
      );
    },
    [selectedObjectTypesIds, setObjectsByObjectTypeData],
  );

  const onCheckboxChange = useCallback(
    async (item: InventoryObjectTypesModel, isChecked: boolean) => {
      setMapData([]);
      const itemId = item.id;
      setCheckId(itemId);

      const { tmoData, childAllTmoIds } = await getObjectTypesCacheData(itemId, !!selectNestedTMO);

      if (isChecked) {
        await isCheckedFn({ tmoData, childAllTmoIds, itemId });
        setObjectTypesData((prev) => {
          const uniqueTmoData = new Set([...prev, ...tmoData]);
          return Array.from(uniqueTmoData);
        });
      }

      if (!isChecked) {
        await isUnCheckFn({ tmoData, childAllTmoIds, itemId });
        setObjectTypesData((prev) => {
          return prev.filter((obj) => !tmoData.some((tmoItem) => tmoItem.id === obj.id));
        });
      }
    },
    [getObjectTypesCacheData, isCheckedFn, isUnCheckFn, selectNestedTMO],
  );

  // region CHECKBOX UI FUNCTION
  const getObjectTypeCheckbox = useCallback(
    (objectType: InventoryObjectTypesModel) => {
      const getCheckboxIcon = () => {
        if ((isFetchingObjectTypesData || isFetchingOnlyTopLevel) && objectType.id === checkId) {
          return <CircularProgress size={20} sx={{ p: 0 }} />;
        }
        return undefined;
      };

      return (
        <Box
          component="div"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={30}
          height={30}
        >
          <Checkbox
            checked={selectedObjectTypesIds.includes(objectType.id)}
            sx={{ p: 0 }}
            onChange={(_, checked) => {
              _.preventDefault();
              _.stopPropagation();
              onCheckboxChange(objectType, checked);
            }}
            icon={getCheckboxIcon()}
            checkedIcon={getCheckboxIcon()}
          />
        </Box>
      );
    },
    [
      selectedObjectTypesIds,
      isFetchingObjectTypesData,
      isFetchingOnlyTopLevel,
      checkId,
      onCheckboxChange,
    ],
  );
  // endregion

  useEffect(() => {
    const filteredObjectTypeCustomizationParams = Object.fromEntries(
      Object.entries(objectTypeCustomizationParams).filter(([key]) =>
        selectedObjectTypesIds.includes(+key),
      ),
    );

    if (selectedObjectTypesIds.length !== Object.keys(objectTypeCustomizationParams).length) {
      setObjectTypeCustomizationParams(filteredObjectTypeCustomizationParams);
    }
  }, [selectedObjectTypesIds.length]);

  return {
    getObjectTypeCheckbox,
    onCheckboxChange,
    objectTypesData,
  };
};
