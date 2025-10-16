import type { Color, GeneralMapDataModel, IColorRangeModel } from '6_shared';

interface IProps {
  mapData: GeneralMapDataModel[];
  additionalParams: Record<string, any>;
  colorData: Record<string, IColorRangeModel>;
}

export const addAdditionalParamsToData = () => {
  const getStringAdditionalData = (colorsData: IColorRangeModel, value: string) => {
    let additionalColor: string | null = null;
    let additionalLineWidth: string | null = null;
    const { colors } = colorsData.ranges;
    const colorSet = colors.find((c: any) => value.toLowerCase().includes(c.name.toLowerCase()));
    additionalColor = colorSet?.hex ?? colorsData?.ranges?.defaultColor ?? null;
    additionalLineWidth = colorSet?.lineWidth ?? colorsData?.ranges?.defaultLineWidth ?? null;

    return { additionalColor, additionalLineWidth };
  };
  const getNumberAdditionalData = (colorRanges: IColorRangeModel | null, paramValue: number) => {
    let severityData: Color | null = null;
    let additionalColor = '#223da7';
    let additionalLineWidth: string | null = null;

    if (!colorRanges) {
      return { additionalColor, additionalLineWidth };
    }

    const {
      ranges: { values, colors, defaultColor, defaultLineWidth },
    } = colorRanges;

    if (paramValue < values[0]) {
      [severityData] = colors;
    } else if (paramValue >= values[values.length - 1]) {
      severityData = colors[values.length];
    } else {
      values.forEach((value: number, i: number) => {
        if (paramValue >= value && value < values[i + 1]) {
          severityData = colors[i + 1];
        }
      });
    }
    additionalColor = severityData?.hex ?? defaultColor ?? '#223da7';
    additionalLineWidth = severityData?.lineWidth ?? defaultLineWidth ?? null;

    return { additionalColor, additionalLineWidth };
  };
  const getBooleanAdditionalData = (colorsData: IColorRangeModel, value: boolean) => {
    let additionalColor: string | null = null;
    let additionalLineWidth: string | null = null;
    const { colors, defaultColor } = colorsData.ranges;

    const neededColorSet = colors.find((c: any) => c.booleanValue === value);

    additionalColor = neededColorSet?.hex ?? defaultColor ?? null;
    additionalLineWidth = neededColorSet?.lineWidth ?? colorsData?.ranges?.defaultLineWidth ?? null;

    return { additionalColor, additionalLineWidth };
  };

  addEventListener('message', (event: MessageEvent<IProps>) => {
    const { mapData, additionalParams, colorData } = event.data;

    const newData = mapData.flatMap((md) => {
      let color: string | null = null;
      let lineWidth: string | null = null;
      if (md.parameters != null) {
        const mdParameters: [string, string][] = Object.entries(md.parameters);
        mdParameters?.forEach(([key, value]) => {
          if (colorData[key]) {
            const { correctValType } = colorData[key];
            if (correctValType === 'string') {
              const { additionalColor, additionalLineWidth } = getStringAdditionalData(
                colorData[key],
                value,
              );
              color = additionalColor;
              lineWidth = additionalLineWidth;
            }
            if (correctValType === 'number') {
              const { additionalColor, additionalLineWidth } = getNumberAdditionalData(
                colorData[key],
                +value,
              );
              color = additionalColor;
              lineWidth = additionalLineWidth;
            }

            if (correctValType === 'boolean') {
              const { additionalLineWidth, additionalColor } = getBooleanAdditionalData(
                colorData[key],
                !!value,
              );
              color = additionalColor;
              lineWidth = additionalLineWidth;
            }
          }
        });
      } else if (md.params != null) {
        let currentTprm: any | null = null;
        Object.keys(colorData).forEach((key) => {
          currentTprm = md.params.find((p: any) => String(p.tprm_id) === key);
        });
        if (currentTprm && colorData[currentTprm.tprm_id]) {
          const { correctValType } = colorData[currentTprm?.tprm_id];
          if (correctValType === 'string') {
            const { additionalColor, additionalLineWidth } = getStringAdditionalData(
              colorData[currentTprm?.tprm_id],
              currentTprm.value,
            );
            color = additionalColor;
            lineWidth = additionalLineWidth;
          }
          if (correctValType === 'number') {
            const { additionalColor, additionalLineWidth } = getNumberAdditionalData(
              colorData[currentTprm?.tprm_id],
              +currentTprm.value,
            );
            color = additionalColor;
            lineWidth = additionalLineWidth;
          }

          if (correctValType === 'boolean') {
            const { additionalLineWidth, additionalColor } = getBooleanAdditionalData(
              colorData[currentTprm?.tprm_id],
              !!currentTprm.value,
            );
            color = additionalColor;
            lineWidth = additionalLineWidth;
          }
        }
      }

      if (md.tmo_id && additionalParams[md.tmo_id]) {
        if (!additionalParams[md.tmo_id].visible) return [];
        return { ...md, ...additionalParams[md.tmo_id], color, lineWidth };
      }
      return md;
    });

    const dataConnectVisible = newData.filter((d) => {
      const { coloredTprms } = d;

      if (!coloredTprms) return true;
      return !coloredTprms?.ranges.colors.some((ct: any) => {
        return (
          ct.visible === false && String(ct.coloredTMOId) === String(d.tmo_id) && ct.hex === d.color
        );
      });
    });

    postMessage({ newData: dataConnectVisible });
  });
};
