import { HierarchyLevel } from '6_shared/api/hierarchy/types';
import { useEffect, useState } from 'react';
import { IColorRangeModel, IHierarchyLevelLegendData, IRangeModel } from '6_shared';

const getConvertedRanges = ({
  values,
  colors,
}: IRangeModel): IHierarchyLevelLegendData['children'] => {
  return colors.map((color, index) => {
    let description;

    if (index === 0) {
      description = `less than ${values[0]}`;
    } else if (index === values.length) {
      description = `more than ${values[values.length - 1]}`;
    } else {
      description = `more than ${values[index - 1]} less than ${values[index]}`;
    }

    return { color: color.hex, description };
  });
};

interface IProps {
  hierarchyLevels?: HierarchyLevel[];
  currentLevelId?: number | null;
  colorRangesData?: IColorRangeModel[];
}
export const useHierarchyLevelsLegendData = ({
  currentLevelId,
  hierarchyLevels,
  colorRangesData,
}: IProps) => {
  const [hierarchyLevelLegendData, setHierarchyLevelLegendData] = useState<
    IHierarchyLevelLegendData[]
  >([]);

  const [currenLevelData, setCurrenLevelData] = useState<HierarchyLevel | null>(null);

  useEffect(() => {
    if (currentLevelId == null) {
      setCurrenLevelData(null);
      return;
    }
    const currentLevel = hierarchyLevels?.find(({ id }) => +id === +currentLevelId);
    setCurrenLevelData(currentLevel ?? null);
  }, [hierarchyLevels, currentLevelId]);

  useEffect(() => {
    if (!currenLevelData) {
      setHierarchyLevelLegendData([]);
      return;
    }
    let legendObject: IHierarchyLevelLegendData = {
      name: currenLevelData.name,
      children: [],
      id: currenLevelData.id,
      hierarchyId: +currenLevelData.hierarchy_id,
    };

    const colorDataKey = `${legendObject.hierarchyId}-${legendObject.id}`;
    const neededColorData = colorRangesData?.find(({ tmoId }) => tmoId === colorDataKey);

    if (neededColorData) {
      const palletChildren = getConvertedRanges(neededColorData.ranges as IRangeModel);
      legendObject = { ...legendObject, children: palletChildren };
    }

    setHierarchyLevelLegendData([legendObject]);
  }, [colorRangesData, currenLevelData]);

  return { hierarchyLevelLegendData };
};
