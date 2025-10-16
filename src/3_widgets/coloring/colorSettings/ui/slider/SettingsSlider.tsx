import { useEffect, useState } from 'react';
import { sliderValueRounder } from '6_shared/lib/utils/valueDimensioners';

import { Color, PaletteSettings } from '6_shared';
import { SettingSliderStyled } from './SettingSlider.styled';

const SettingsSlider = ({
  colors,
  values,
  comparisonZeroPoint,
  updatePalette,
}: {
  colors: Color[];
  values: number[];
  comparisonZeroPoint?: { active: boolean; index: number; value: number };
  updatePalette?: (updateFn: (prev: PaletteSettings) => PaletteSettings) => void;
}) => {
  const [sliderValues, setSliderValues] = useState<number[]>([]);
  const [perc, setPerc] = useState<number[]>([]);
  const [selectedThumb, setSelectedThumb] = useState<{
    index: number | null;
    value: number | null;
  } | null>(
    comparisonZeroPoint
      ? { index: comparisonZeroPoint.index, value: comparisonZeroPoint.value }
      : null,
  );

  useEffect(() => {
    if (!values?.length) return;
    setSelectedThumb({
      index: selectedThumb?.index ?? null,
      value: values[selectedThumb?.index ? selectedThumb.index - 1 : 0] ?? null,
    });

    updatePalette?.((prev) => ({
      ...prev,
      ranges: {
        ...prev.ranges,
        comparisonZeroPoint: {
          active: !!selectedThumb,
          index: selectedThumb?.index ?? null,
          value: values[selectedThumb?.index ? selectedThumb.index - 1 : 0] ?? null,
        },
      },
    }));
  }, [values]);

  useEffect(() => {
    if (!values) return;
    if (values?.length === 1) {
      setSliderValues([0, values[0], values[0] * 2]);
    } else {
      const offset = Math.max((Number(values[values.length - 1]) - values[0]) * 0.1, 0.3);
      const firstOffset = Number(values[0]) - offset;
      const lastOffset = Number(values[values.length - 1]) + offset;
      setSliderValues([firstOffset, ...values, lastOffset]);
    }
  }, [values]);

  useEffect(() => {
    const percVals = sliderValues?.map(
      (val) =>
        ((val - sliderValues[0]) / (sliderValues[sliderValues.length - 1] - sliderValues[0])) * 100,
    );
    setPerc(percVals);
  }, [sliderValues]);

  const handleChange = (event: Event, sliderValue: number | number[], activeThumb: number) => {
    const minDistance = Math.max((values[values.length - 1] - values[0]) / 100, 0.1);
    if (!Array.isArray(sliderValue)) return;
    if (activeThumb === 0) return;
    if (activeThumb === sliderValues.length - 1) return;
    if (
      sliderValue[activeThumb] >= sliderValue[activeThumb - 1] + minDistance &&
      sliderValue[activeThumb] <= sliderValue[activeThumb + 1] - minDistance
    ) {
      if (sliderValue[activeThumb] < 0) sliderValue[activeThumb] = 0;
      const newValues = [
        ...sliderValues.slice(1, activeThumb),
        sliderValue[activeThumb],
        ...sliderValues.slice(activeThumb + 1, -1),
      ];
      updatePalette?.((prev) => ({
        ...prev,
        ranges: {
          ...prev.ranges,
          values: newValues,
        },
      }));
      setPerc(
        sliderValues?.map((val) =>
          Math.round(
            ((val - sliderValues[0]) / (sliderValues[sliderValues.length - 1] - sliderValues[0])) *
              100,
          ),
        ),
      );
    }
  };

  const valuetext = (value: number) => `${value}`;

  const sliderColors = colors
    ?.map((item, index) => `${item.hex} ${perc[index]}% ${perc[index + 1]}%`)
    .join(', ');

  const marksObjects = values?.map((value) => ({
    value,
    label: `${sliderValueRounder(value)}`,
  }));

  return (
    <SettingSliderStyled
      sx={{ width: '95%' }}
      slidercolors={sliderColors}
      selectedThumbIndex={selectedThumb?.index ?? null}
      step={0.1}
      value={sliderValues}
      onChange={handleChange}
      disableSwap
      min={sliderValues[0]}
      max={sliderValues[sliderValues.length - 1]}
      valueLabelDisplay="off"
      marks={marksObjects}
      getAriaValueText={valuetext}
      slotProps={{
        thumb: ({ className, ...rest }) => ({
          ...rest,
          className: `${className ?? ''}`,
          onMouseDown: (e: React.MouseEvent) => {
            const indexAttr = (e.currentTarget as HTMLElement).getAttribute('data-index');
            const index = indexAttr !== null ? Number(indexAttr) : null;
            const value = sliderValues[index ?? 0];
            const newSelected =
              selectedThumb?.index === index ? null : { index: index ?? 0, value };

            setSelectedThumb(newSelected);
            updatePalette?.((prev) => ({
              ...prev,
              ranges: {
                ...prev.ranges,
                comparisonZeroPoint: {
                  active: !!newSelected,
                  ...(newSelected ?? {}),
                },
              },
            }));
          },
        }),
      }}
    />
  );
};

export default SettingsSlider;
