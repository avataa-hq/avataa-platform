import { useEffect, useMemo, useState } from 'react';
import {
  ColorType,
  convertTypeForParamType,
  IColorRangeModel,
  InventoryObjectTypesParamTypes,
} from '6_shared';
import { IObjectTypeCustomizationParams } from '6_shared/models/inventoryMapWidget/types';
import { useCellsVisualisationData } from '../../../5_entites/processManager/lib/table/hooks/useCellsVisualisationData';

const getNeededColorSetByTprm = (
  colorData: IColorRangeModel[],
  tprmList: { id: number; tmo_id: number; val_type: string; [key: string]: any }[],
) => {
  const result: Record<string, IColorRangeModel> = {};
  tprmList.forEach((t) => {
    const tTmoId = String(t.tmo_id ?? t.object_type);
    const tId = String(t.id);
    colorData.forEach((c) => {
      const cTmoId = String(c.tmoId);
      const cTprmId = String(c.tprmId);
      const cValType = String(c.valType);

      if (tTmoId === cTmoId && tId === cTprmId) {
        const { val_type } = t;
        const correctListTprmColorValType = convertTypeForParamType(val_type as ColorType);
        const correctColorDataTprmColorValType = convertTypeForParamType(cValType as ColorType);
        if (correctListTprmColorValType === correctColorDataTprmColorValType) {
          result[cTprmId] = { ...c, correctValType: correctListTprmColorValType };
        }
      }
    });
  });
  return result;
};

interface IProps {
  objectTypeCustomizationParams: Record<string, IObjectTypeCustomizationParams>;
}
export const useColorRanges = ({ objectTypeCustomizationParams }: IProps) => {
  const [currentTprms, setCurrentTprms] = useState<InventoryObjectTypesParamTypes[]>([]);
  const [currentTmoIds, setCurrentTmoIds] = useState<string[]>([]);
  const [tprmColorData, setTprmColorData] = useState<Record<string, IColorRangeModel>>({});
  const [colorRanges, setColorRanges] = useState<IColorRangeModel[]>();

  useEffect(() => {
    const newTprms = Object.values(objectTypeCustomizationParams).flatMap(
      (value) => value?.tprms ?? [],
    );
    setCurrentTprms(newTprms);
    setCurrentTmoIds(Object.keys(objectTypeCustomizationParams));
  }, [objectTypeCustomizationParams]);

  const tprmsIds = useMemo(() => currentTprms.map((t) => String(t.id)), [currentTprms]);

  const { colorRangesData, colorRangesDataSuccess } = useCellsVisualisationData({
    tmo_ids: currentTmoIds,
    tprm_ids: tprmsIds,
    only_description: false,
    limit: 1000,
  });

  useEffect(() => {
    if (!colorRangesData) return;
    const filteredPalettes = Object.values(colorRangesData).reduce((accumulator, currentValue) => {
      const { tmoId, public: isPublic, default: isDefault } = currentValue;

      if (
        !accumulator.has(tmoId) ||
        (!isPublic && isDefault) ||
        (isPublic &&
          isDefault &&
          !accumulator.get(tmoId).public &&
          !accumulator.get(tmoId).default) ||
        (isPublic && !isDefault && accumulator.get(tmoId).default)
      ) {
        accumulator.set(tmoId, currentValue);
      }

      return accumulator;
    }, new Map());

    const filteredArray = Array.from(filteredPalettes.values());
    setColorRanges(filteredArray);
  }, [colorRangesData]);

  useEffect(() => {
    if (!colorRanges) return;
    const colorData = getNeededColorSetByTprm(colorRanges, currentTprms);
    setTprmColorData(colorData);
  }, [colorRanges, currentTprms]);

  const selectColorRange = ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => {
    if (!tmoId || !paletteId || !colorRangesData) return;

    const newPalette = Object.values(colorRangesData).find((palette) => palette.id === paletteId);
    if (!newPalette) return;

    setColorRanges((prevColorRanges) =>
      prevColorRanges?.map((palette) => (palette.tmoId === tmoId ? newPalette : palette)),
    );
  };

  return { colorRangesData, colorRanges, tprmColorData, selectColorRange, colorRangesDataSuccess };
};
