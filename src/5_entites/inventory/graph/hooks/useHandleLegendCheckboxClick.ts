import { GraphTmosWithColorRanges, useDiagrams } from '6_shared';
import { defaultGraphLinksConfig } from '../configGraph';

interface IProps {
  graphTmosWithColors: GraphTmosWithColorRanges;
}

export const useHandleLegendCheckboxClick = ({ graphTmosWithColors }: IProps) => {
  const { defaultGraphLinks, setGraphTmosWithColorRanges, setDefaultGraphLinks } = useDiagrams();

  const handleCheckboxClick = (newTmoId: number | string) => {
    const newGraphTmosWithColorRanges = { ...graphTmosWithColors };
    if (typeof newTmoId === 'number') {
      newGraphTmosWithColorRanges[newTmoId] = {
        ...newGraphTmosWithColorRanges[newTmoId],
        visible: !newGraphTmosWithColorRanges[newTmoId].visible,
      };
    }

    if (typeof newTmoId === 'string' && !(newTmoId in defaultGraphLinksConfig)) {
      const [id, idx] = newTmoId.toString().split('_');
      if (!id || !idx || !newGraphTmosWithColorRanges[id]) return;
      const currentColors = newGraphTmosWithColorRanges[id].colorRanges?.ranges?.colors || [];

      const updatedColors = currentColors.map((color, index) =>
        index === +idx ? { ...color, visible: !color.visible } : color,
      );

      // @ts-ignore
      newGraphTmosWithColorRanges[id] = {
        ...newGraphTmosWithColorRanges[id],
        ...(newGraphTmosWithColorRanges[id].colorRanges && {
          colorRanges: {
            ...newGraphTmosWithColorRanges[id].colorRanges,
            ranges: {
              ...(newGraphTmosWithColorRanges[id].colorRanges?.ranges && {
                ...newGraphTmosWithColorRanges[id].colorRanges?.ranges,
                colors: updatedColors,
              }),
            },
          },
        }),
      };
    }

    setGraphTmosWithColorRanges(newGraphTmosWithColorRanges);

    if (newTmoId in defaultGraphLinksConfig) {
      const newDefaultGraphLinks = { ...defaultGraphLinks };
      newDefaultGraphLinks[newTmoId] = {
        ...newDefaultGraphLinks[newTmoId],
        visible: !newDefaultGraphLinks[newTmoId].visible,
      };
      setDefaultGraphLinks(newDefaultGraphLinks);
    }
  };
  return { handleCheckboxClick, defaultGraphLinks };
};
