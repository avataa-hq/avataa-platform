import { InventoryObjectTypesModel } from '6_shared';
import { IObjectTypeCustomizationParams } from '6_shared/models/inventoryMapWidget/types';
import { IMuiIconsType } from '../../../components/MUIIconLibrary/MUIIconLibrary';

interface IProps {
  currentCustomizationParams?: Record<string, IObjectTypeCustomizationParams>;
  tmoListData: InventoryObjectTypesModel[];
}
export const getCustomizationParamsFromTMOs = ({
  currentCustomizationParams,
  tmoListData,
}: IProps) => {
  const result: Record<string, IObjectTypeCustomizationParams> = {};

  tmoListData.forEach((item) => {
    if (!currentCustomizationParams?.[item.id]) {
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
      } = item;
      const newParam = {
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
      result[item.id] = newParam;
    }
  });
  return { ...currentCustomizationParams, ...result };
};
