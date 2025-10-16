import { useEffect, useState } from 'react';
import {
  GraphTmosWithColorRanges,
  IColorRangeModel,
  IColorRangeModelWithRanges,
  colorRangesApi,
  graphApi,
  useDiagrams,
} from '6_shared';

const { useFindRangesByFilterQuery } = colorRangesApi;
const { useGetTmoGraphQuery } = graphApi.tmo;

export const useGraphColorRanges = (
  graphKey: string,
): {
  graphTmosWithColorRanges: GraphTmosWithColorRanges | null;
  palettes: IColorRangeModel[] | undefined;
  isFetching: boolean;
  selectColorRange: ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => void;
} => {
  const { data: graphTmo, isFetching: isTmoFetching } = useGetTmoGraphQuery(graphKey);
  const { data, isFetching: isColorRangesFetching } = useFindRangesByFilterQuery(
    {
      tmo_ids: graphTmo?.nodes.map((node) => node.id.toString()),
      only_description: false,
      limit: 100,
    },
    { skip: !graphTmo },
  );

  const { graphTmosWithColorRanges } = useDiagrams();

  const [colorRanges, setColorRanges] = useState<GraphTmosWithColorRanges | null>(null);

  useEffect(() => {
    if (!data || isTmoFetching || isColorRangesFetching) {
      setColorRanges(null);
      return;
    }

    const tmoWithRanges: GraphTmosWithColorRanges = {};

    graphTmo?.nodes.forEach((node) => {
      tmoWithRanges[node.id.toString()] = {
        ...node,
        colorRanges: undefined,
        visible: graphTmosWithColorRanges?.[node.id.toString()]?.visible ?? true,
      };
    });

    data.forEach((range) => {
      if (!tmoWithRanges.hasOwnProperty(range.tmoId)) return;

      const current = tmoWithRanges[range.tmoId];
      const shouldReplace =
        !current.colorRanges ||
        (range.default && !range.public) ||
        (range.default &&
          range.public &&
          (!current.colorRanges.default || current.colorRanges.public));

      if (shouldReplace) {
        // current.colorRanges = range as IColorRangeModelWithRanges;
        current.colorRanges = {
          ...range,
          ranges: {
            ...range.ranges,
            colors: range.ranges.colors.map((color: any) => {
              const newColor = graphTmosWithColorRanges?.[
                range.tmoId
              ]?.colorRanges?.ranges.colors.find((c) => c.id === color.id);

              return newColor ? { ...color, ...newColor } : { ...color, visible: true };
            }),
          },
        } as IColorRangeModelWithRanges;
      }
    });
    setColorRanges(tmoWithRanges);
  }, [data, graphTmo, isColorRangesFetching, isTmoFetching, graphTmosWithColorRanges]);

  const selectColorRange = ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => {
    if (!tmoId || !paletteId || !colorRanges || !data) return;

    const newPalette = data.find((palette) => palette.id === paletteId && palette.tmoId === tmoId);
    if (!newPalette) return;

    setColorRanges((prevColorRanges) => {
      if (!prevColorRanges) return prevColorRanges;

      const updatedColorRanges = { ...prevColorRanges };
      updatedColorRanges[tmoId].colorRanges = newPalette as IColorRangeModelWithRanges;

      return updatedColorRanges;
    });
  };

  return {
    graphTmosWithColorRanges: colorRanges,
    palettes: data,
    isFetching: isColorRangesFetching || isTmoFetching,
    selectColorRange,
  };
};
