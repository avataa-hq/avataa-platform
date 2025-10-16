import { useCallback } from 'react';
import {
  IColorRangeModel,
  Ranges,
  TprmData,
  ValidValueTypes,
  colorRangesApi,
  useColorsConfigure,
} from '6_shared';

interface IProps {
  palettes?: IColorRangeModel[];
  selectedTab: string;
  handleApplyColors?: ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => void;
  setIsOpenCreateConfirmationModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenDeleteConfirmationModal?: React.Dispatch<React.SetStateAction<boolean>>;
  row?: IColorRangeModel;
  tprms?: TprmData[] | TprmData;
}

const MOCK_SET = {
  colors: [
    { name: 'Tier 1', id: '1', hex: '#FF0000' },
    { name: 'Tier 2', id: '2', hex: '#FFCC00' },
    { name: 'Tier 3', id: '3', hex: '#66CC33' },
  ],
  values: [20, 80],
};

export const useActions = ({
  palettes,
  selectedTab,
  handleApplyColors,
  setIsOpenCreateConfirmationModal,
  setIsOpenDeleteConfirmationModal,
  row,
  tprms,
}: IProps) => {
  const { useDeleteColorRangesMutation } = colorRangesApi;

  const {
    selectedColor,
    currentTprm,
    setIsEditPalette,
    setSelectedPalette,
    setSelectedColor,
    toggleIsOpenColorSelecting,
    toggleIsOpenColorSettings,
    setCurrentTprm,
  } = useColorsConfigure();

  const onApplyClick = useCallback(() => {
    if (selectedColor) {
      handleApplyColors?.({ tmoId: selectedColor?.tmoId, paletteId: selectedColor?.id });
    }
    toggleIsOpenColorSelecting({ module: selectedTab });
  }, [handleApplyColors, selectedTab, selectedColor]);

  const onDefaultClick = useCallback(() => {
    if (!palettes || !Array.isArray(palettes)) return;

    let defaultPalette: IColorRangeModel | null = null;

    palettes.some((palette) => {
      if (!palette.public && palette.default) {
        defaultPalette = palette;
        return true;
      }
      if (palette.public && palette.default) {
        defaultPalette = palette;
      } else if (palette.public && !palette.default && !defaultPalette) {
        defaultPalette = palette;
      }
      return false;
    });
    if (defaultPalette) {
      handleApplyColors?.({
        tmoId: (defaultPalette as IColorRangeModel).tmoId,
        paletteId: (defaultPalette as IColorRangeModel).id,
      });
      setSelectedColor(defaultPalette);
    }
    toggleIsOpenColorSelecting({ module: selectedTab });
  }, [handleApplyColors, palettes, selectedTab]);

  const onEditClick = useCallback(() => {
    toggleIsOpenColorSettings({ module: selectedTab });
    setIsEditPalette({ module: selectedTab, value: true });
    if (selectedColor)
      setSelectedPalette({
        module: selectedTab,
        palette: {
          ...selectedColor,
          ranges: selectedColor.ranges as Ranges,
          valType: selectedColor.valType as ValidValueTypes,
        },
      });
  }, [selectedColor, selectedTab]);

  const onCreateClick = useCallback(() => {
    if (!currentTprm[selectedTab]) {
      setIsOpenCreateConfirmationModal?.(true);
    } else {
      toggleIsOpenColorSettings({ module: selectedTab });
      setIsEditPalette({ module: selectedTab, value: false });

      setSelectedPalette({
        module: selectedTab,
        palette: {
          name: '',
          ranges: MOCK_SET,
          valType: currentTprm[selectedTab]?.val_type,
          default: false,
          public: false,
        },
      });
    }
  }, [selectedTab, currentTprm, setIsOpenCreateConfirmationModal]);

  const onOpenAsNew = useCallback(() => {
    if (!row?.tprmId) {
      setIsOpenCreateConfirmationModal?.(true);
    } else {
      const tprm = Array.isArray(tprms) ? tprms.find((t) => t.id === row.tprmId) : tprms;
      const { name, ...rest } = row;
      setCurrentTprm({ module: selectedTab, tprm });
      toggleIsOpenColorSettings({ module: selectedTab });
      setIsEditPalette({ module: selectedTab, value: false });

      setSelectedPalette({
        module: selectedTab,
        palette: {
          ...rest,
          ranges: row.ranges as Ranges,
          valType: row.valType as ValidValueTypes,
        },
      });
    }
  }, [selectedTab, setIsOpenCreateConfirmationModal, row, tprms]);

  const [deleteRange] = useDeleteColorRangesMutation();
  const onDeleteClick = async () => {
    if (selectedColor?.id) deleteRange(selectedColor.id);
    setIsOpenDeleteConfirmationModal?.(false);
  };

  return { onApplyClick, onDeleteClick, onCreateClick, onEditClick, onDefaultClick, onOpenAsNew };
};
