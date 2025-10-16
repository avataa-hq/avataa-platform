import {
  IColorRangeModel,
  IColorRangeUpdateBody,
  colorRangesApi,
  getErrorMessage,
  useColorsConfigure,
} from '6_shared';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';

const useCreatePalette = ({ palette }: { palette: Partial<IColorRangeModel> }) => {
  const { useCreateColorRangesMutation } = colorRangesApi;

  const [createPalette] = useCreateColorRangesMutation();

  const createColorSet = async (tmoId: string, tprmId: string) => {
    if (!palette) return;

    await createPalette({
      name: palette.name!,
      tmoId,
      tprmId,
      public: palette.public,
      default: palette.default,
      value_type: palette.value_type ?? 'General',
      direction: palette.direction,
      withCleared: palette.withCleared,
      withIndeterminate: palette.withIndeterminate,
      ranges: {
        colors: palette.ranges?.colors,
        values: palette.ranges?.values,
        comparisonZeroPoint: palette.ranges?.comparisonZeroPoint,
        defaultColor: palette.ranges?.defaultColor,
        defaultLineWidth: palette.ranges?.defaultLineWidth,
      },
      forced_default: true,
      valType: palette.valType ?? 'int',
    }).unwrap();
  };

  return createColorSet;
};

const useEditPalette = ({
  editPalette,
  palette,
}: {
  editPalette: (params: IColorRangeUpdateBody) => void;
  palette: Partial<IColorRangeModel>;
}) => {
  const { selectedColor } = useColorsConfigure();

  const editColorSet = async () => {
    if (!palette || !selectedColor) return;
    editPalette({
      id: selectedColor.id,
      name: palette.name!,
      public: palette.public,
      default: palette.default,
      value_type: palette.value_type ?? 'General',
      ranges: {
        colors: palette.ranges?.colors,
        values: palette.ranges?.values,
        comparisonZeroPoint: palette.ranges?.comparisonZeroPoint,
        defaultColor: palette.ranges?.defaultColor,
        defaultLineWidth: palette.ranges?.defaultLineWidth,
      },
      withCleared: palette.withCleared,
      withIndeterminate: palette.withIndeterminate,
      direction: palette.direction,
      forced_default: true,
      valType: palette.valType ?? 'int',
    });
  };

  return editColorSet;
};

export const usePaletteActions = (palette: Partial<IColorRangeModel>, theTab: string) => {
  const { useUpdateColorRangesMutation } = colorRangesApi;

  const { currentTprm, currentTmoId, toggleIsOpenColorSettings } = useColorsConfigure();

  const createColorSet = useCreatePalette({ palette });
  const [editPalette] = useUpdateColorRangesMutation();
  const editColorSet = useEditPalette({ editPalette, palette });

  const onCreatePalette = useCallback(async () => {
    const tmoId = currentTmoId[theTab];
    const tprmId = currentTprm[theTab]?.id;
    if (!tmoId || !tprmId) return;
    toggleIsOpenColorSettings({ module: theTab });

    try {
      await createColorSet(String(tmoId), String(tprmId));
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [createColorSet, currentTmoId, currentTprm, theTab]);

  const onEditPalette = useCallback(() => {
    if (!palette) return;
    toggleIsOpenColorSettings({ module: theTab });
    editColorSet();
  }, [editColorSet, palette, theTab]);

  return {
    onCreatePalette,
    onEditPalette,
  };
};
