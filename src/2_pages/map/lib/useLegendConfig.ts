import { useEffect, useState } from 'react';
import { IColorRangeModel } from '6_shared';
import {
  IColors,
  ILegendData,
  IObjectTypeCustomizationParams,
} from '6_shared/models/inventoryMapWidget/types';

interface IProps {
  objectTypeCustomizationParams: Record<string, IObjectTypeCustomizationParams>;
  legendCustomizationParams: Record<string, IObjectTypeCustomizationParams>;
  selectedObjectTypeIds: number[];
  colorRangesData?: IColorRangeModel[];
  colorData?: Record<string, IColorRangeModel>;
  setLegendCustomizationParams: (payload: Record<number, IObjectTypeCustomizationParams>) => void;
}

export const useLegendConfig = ({
  objectTypeCustomizationParams,
  legendCustomizationParams,
  selectedObjectTypeIds,
  setLegendCustomizationParams,
  colorRangesData,
  colorData,
}: IProps) => {
  const [legendData, setLegendData] = useState<ILegendData[]>([]);

  useEffect(() => {
    const customizationArray = Object.entries(objectTypeCustomizationParams);
    const newData = customizationArray.reduce((acc, [key, value]) => {
      const tmoColorRangesData = Object.values(colorData ?? {}).find((val) => {
        return val.tmoId === key;
      });
      const coloredTMOId = tmoColorRangesData?.tmoId;

      const newColoredTprms = tmoColorRangesData
        ? tmoColorRangesData.ranges.colors.map((item: IColors) => ({
            ...item,
            visible: true,
            coloredTMOId,
          }))
        : [];

      const defaultColor = tmoColorRangesData?.ranges?.defaultColor
        ? {
            key: 999,
            coloredTMOId,
            hex: tmoColorRangesData?.ranges?.defaultColor,
            name: 'Default Color',
            visible: true,
          }
        : undefined;

      if (defaultColor) newColoredTprms.push(defaultColor);

      const newColoredRangesData = {
        ...tmoColorRangesData,
        ranges: {
          ...tmoColorRangesData?.ranges,
          colors: newColoredTprms,
        },
      };
      acc[+key] = { ...value, coloredTprms: newColoredRangesData as IColorRangeModel };

      return acc;
    }, {} as Record<number, IObjectTypeCustomizationParams>);

    setLegendCustomizationParams(newData);
    setLegendData(
      Object.entries(newData).map(([id, value]) => ({
        id,
        name: value.tmoName,
        icon: value.icon,
        line_type: value.line_type,
        geometry_type: value.geometry_type,
        coloredTprms: value.coloredTprms,
        visible: true,
      })),
    );
  }, [colorData, objectTypeCustomizationParams]);

  useEffect(() => {
    setLegendData(
      Object.entries(legendCustomizationParams)
        .filter(([key]) => selectedObjectTypeIds.includes(+key))
        .map(([id, value]) => ({
          id,
          name: value.tmoName,
          icon: value.icon,
          line_type: value.line_type,
          geometry_type: value.geometry_type,
          coloredTprms: value.coloredTprms,
          visible: true,
        })),
    );
  }, [selectedObjectTypeIds.length]);

  const updateObjectState = (tmoId: string, newData: IObjectTypeCustomizationParams) => {
    setLegendCustomizationParams({
      ...legendCustomizationParams,
      [tmoId]: {
        ...newData,
        visible: !newData.visible,
      },
    });
  };

  const updateLegendData = (
    tmoId: string,
    newData: { visible: boolean; coloredTprms: IColorRangeModel },
  ) => {
    setLegendData((prevData) =>
      prevData.map((item) => (item.id === tmoId ? { ...item, ...newData } : item)),
    );
  };

  const onObjectTypeCheckBoxClick = (newTmoId: string) => {
    const updatedItem = legendCustomizationParams[+newTmoId];

    const newColoredTprms = updatedItem.coloredTprms?.ranges.colors.map((item: IColors) => ({
      ...item,
      visible: !updatedItem.visible,
    }));

    if (updatedItem.coloredTprms) {
      const newUpdatedItem = {
        ...updatedItem,
        coloredTprms: {
          ...updatedItem.coloredTprms,
          ranges: {
            ...updatedItem.coloredTprms.ranges,
            colors: newColoredTprms,
          },
        },
      };

      updateObjectState(newTmoId, newUpdatedItem);

      const updatedObject = legendData.find((item) => item.id === newTmoId);
      if (updatedObject) {
        updateLegendData(newTmoId, {
          visible: !updatedObject.visible,
          coloredTprms: {
            ...updatedItem.coloredTprms,
            ranges: {
              ...updatedItem.coloredTprms.ranges,
              colors:
                updatedItem.coloredTprms.ranges.colors.map((coloredTprm: IColors) => ({
                  ...coloredTprm,
                  visible: !updatedObject.visible,
                })) ?? [],
            },
          },
        });
      }
    }
  };

  const onParamTypeCheckBoxClick = (newTmoId: string, newTprmId: string) => {
    let updatedItem = legendCustomizationParams[+newTmoId];

    const newColoredTprm = updatedItem.coloredTprms?.ranges.colors.map((coloredTprm: IColors) => {
      if (updatedItem.visible) {
        updatedItem = { ...updatedItem, visible: !updatedItem.visible };
      }
      if (coloredTprm.id === newTprmId) {
        return {
          ...coloredTprm,
          visible: !coloredTprm.visible,
        };
      }
      return coloredTprm;
    });

    const updatedObject = legendData.find((item) => item.id === newTmoId);
    if (updatedObject && updatedItem.coloredTprms) {
      updateLegendData(newTmoId, {
        visible: updatedObject.visible ? updatedObject.visible : !updatedObject.visible,
        coloredTprms: {
          ...updatedItem.coloredTprms,
          ranges: {
            ...updatedItem.coloredTprms.ranges,
            colors:
              updatedObject.coloredTprms?.ranges.colors.map((coloredTprm: IColors) => {
                if (coloredTprm.id === newTprmId) {
                  return {
                    ...coloredTprm,
                    visible: !coloredTprm.visible,
                  };
                }
                return coloredTprm;
              }) ?? [],
          },
        },
      });
    }

    if (updatedItem.coloredTprms) {
      const newUpdatedItem = {
        ...updatedItem,
        coloredTprms: {
          ...updatedItem.coloredTprms,
          ranges: {
            ...updatedItem.coloredTprms.ranges,
            colors: newColoredTprm,
          },
        },
      };

      updateObjectState(newTmoId, newUpdatedItem);
    }
  };

  return {
    legendData,
    onObjectTypeCheckBoxClick,
    onParamTypeCheckBoxClick,
  };
};
