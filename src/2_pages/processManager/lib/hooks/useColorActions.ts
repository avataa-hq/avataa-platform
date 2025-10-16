import { useCallback, useEffect } from 'react';
import {
  IColorRangeModel,
  SeverityRange,
  useColorsConfigure,
  useLeftPanelWidget,
  useProcessManager,
  useSettingsObject,
  useSeverity,
} from '6_shared';
import { useGetColorRangesData } from '6_shared/api/frontendSettings/colorRanges/hooks';
import { filterColorRanges } from '../getFilteredColorRanges';

const getFilteredColorRanges = (colorRangesData: IColorRangeModel[]) => {
  const groupedByTprm = colorRangesData.reduce((result, obj) => {
    const key = obj.tprmId;
    if (!result[key]) result[key] = [];
    result[key].push(obj);
    return result;
  }, {} as Record<string, any>);

  const groupedColorRangeArray: IColorRangeModel[][] = Object.values(groupedByTprm);

  return {
    currentColors: groupedColorRangeArray.map(filterColorRanges).flat(),
    groupedColors: groupedByTprm,
  };
};

function replaceColorRange({
  colorRanges,
  tprmId,
  tmoId,
  selectedColorRange,
}: {
  colorRanges: IColorRangeModel[];
  tprmId: string;
  tmoId: string;
  selectedColorRange: IColorRangeModel;
}) {
  const updatedColorRanges = [...colorRanges];
  const index = colorRanges.findIndex((range) => range.tprmId === tprmId && range.tmoId === tmoId);
  if (index !== -1) updatedColorRanges[index] = selectedColorRange;
  return updatedColorRanges;
}

interface IProps {
  severityId?: number | null;
}

const useColorRangeActions = ({ severityId }: IProps) => {
  const {
    pmTmoId,
    selectedColumnForColoring,
    colorRangesData: colorRangesDataFromState,
    tprmColIds,
    setColorRangesData,
    setGroupedColorRangesData,
  } = useProcessManager();

  const { setSeverityDirection, setSelectedColorPalette, setSeverityRanges, setSelectedSeverity } =
    useSeverity();

  const { multiFilterTmoIds } = useLeftPanelWidget();
  const { selectedColor, setSelectedColor, setSelectedColorId, setWithCleared } =
    useColorsConfigure();
  const { limitForColorPaleteRequst, setLimitForColorPaleteRequst } = useSettingsObject();

  const { colorRangesData } = useGetColorRangesData({
    params: {
      tmo_ids: multiFilterTmoIds,
      tprm_ids: [],
      only_description: false,
      limit: limitForColorPaleteRequst,
      offset: 0,
    },
    skip: !multiFilterTmoIds || !tprmColIds,
  });

  useEffect(() => {
    if (!colorRangesData) return;

    if (colorRangesData.length === limitForColorPaleteRequst) {
      setLimitForColorPaleteRequst(limitForColorPaleteRequst + limitForColorPaleteRequst);
    }
  }, [colorRangesData, limitForColorPaleteRequst]);

  useEffect(() => {
    if (!colorRangesData) return;
    const { currentColors, groupedColors } = getFilteredColorRanges(colorRangesData);
    setColorRangesData(currentColors);
    setGroupedColorRangesData(groupedColors);
  }, [colorRangesData]);

  useEffect(() => {
    if (!colorRangesDataFromState) return;
    const selectedColorRange = colorRangesDataFromState.find(
      (el) => +el.tmoId === pmTmoId && +el.tprmId === severityId,
    );
    setSelectedColorPalette(selectedColorRange);

    if (selectedColorRange) {
      const output: SeverityRange[] = [];

      if (selectedColorRange.withIndeterminate) {
        output.push({ Indeterminate: { isEmpty: true, color: '#4D33EB' } });
      }
      setWithCleared(selectedColorRange?.withCleared ?? false);
      selectedColorRange.ranges.colors.forEach(
        (color: { name: string; hex: string }, index: number) => {
          const range: SeverityRange = {};
          range[color.name] = {
            from: selectedColorRange.ranges.values[index - 1],
            to: selectedColorRange.ranges.values[index],
            color: color.hex,
          };
          output.push(range);
        },
      );
      setSeverityRanges(output);
      setSelectedSeverity(output);
      setSelectedColorId(selectedColorRange.id);

      setSeverityDirection(selectedColorRange?.direction ?? 'asc');
    }
  }, [colorRangesDataFromState, pmTmoId, severityId]);

  const onApplySelectedColor = useCallback(() => {
    if (!colorRangesData || !selectedColor || !selectedColumnForColoring) return;

    const selectedColorRange = colorRangesData.find(
      (range: { id: number }) => range.id === selectedColor.id,
    );

    if (!selectedColorRange || !pmTmoId) return;

    const updatedColorRangesData = replaceColorRange({
      colorRanges: colorRangesDataFromState,
      tprmId: selectedColumnForColoring.field,
      tmoId: String(pmTmoId),
      selectedColorRange,
    });

    if (+selectedColorRange.tprmId === severityId) {
      const output: SeverityRange[] = [];

      if (selectedColorRange.withIndeterminate) {
        output.push({ Indeterminate: { isEmpty: true, color: '#4D33EB' } });
      }
      setWithCleared(selectedColorRange?.withCleared ?? false);
      selectedColorRange.ranges.colors.forEach(
        (color: { name: string; hex: string }, index: number) => {
          const range: SeverityRange = {};
          range[color.name] = {
            from: selectedColorRange.ranges.values[index - 1],
            to: selectedColorRange.ranges.values[index],
            color: color.hex,
          };
          output.push(range);
        },
      );
      setSeverityRanges(output);
      setSelectedSeverity(output);
      setSelectedColorId(selectedColorRange.id);

      setSeverityDirection(selectedColorRange?.direction ?? 'asc');
    }
    setColorRangesData(updatedColorRangesData);
    setSelectedColor(null);
  }, [
    colorRangesData,
    selectedColumnForColoring,
    selectedColor,
    pmTmoId,
    colorRangesDataFromState,
    severityId,
  ]);

  return {
    onApplySelectedColor,
    colorRangesData,
  };
};

export default useColorRangeActions;
