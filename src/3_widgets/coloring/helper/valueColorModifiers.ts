import { Color, PaletteSettings } from '6_shared';
import colorBetweenGenerator from './colorGenerator';

interface IProps {
  value?: number | string;
  index: number;
  colors: Color[];
  values: number[];
  updatePalette?: (updateFn: (prev: PaletteSettings) => PaletteSettings) => void;
}

type ChangeRowColorProps = Omit<IProps, 'values'>;
type ChangeRowValueProps = IProps;
type MutateColorProps = Omit<IProps, 'event'>;

let timeoutId: string | number | NodeJS.Timeout | undefined;
export const onChangeRowColor = ({ value, index, colors, updatePalette }: ChangeRowColorProps) => {
  if (index === 999) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      updatePalette?.((prev) => ({
        ...prev,
        ranges: { ...prev.ranges, defaultColor: value },
      }));
    }, 300);
  } else {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const newColorObject = {
        name: colors[index].name,
        id: colors[index].id,
        hex: value,
        ...(colors[index].booleanValue && { booleanValue: colors[index].booleanValue }),
        ...(colors[index].lineWidth && { lineWidth: colors[index].lineWidth }),
      };
      const newColors = [...colors.slice(0, index), newColorObject, ...colors.slice(index + 1)];

      updatePalette?.((prev) => ({ ...prev, ranges: { ...prev.ranges, colors: newColors } }));
    }, 300);
  }
};

export const onChangeRowLineWidth = ({
  value,
  index,
  colors,
  updatePalette,
}: ChangeRowColorProps) => {
  if (index === 999) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      updatePalette?.((prev) => ({
        ...prev,
        ranges: { ...prev.ranges, defaultLineWidth: value },
      }));
    }, 300);
  } else {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const newColorObject = {
        name: colors[index].name,
        id: colors[index].id,
        lineWidth: value,
        hex: colors[index].hex,
        ...(colors[index].booleanValue && {
          booleanValue: colors[index].booleanValue,
        }),
      };
      const newColors = [...colors.slice(0, index), newColorObject, ...colors.slice(index + 1)];

      updatePalette?.((prev) => ({ ...prev, ranges: { ...prev.ranges, colors: newColors } }));
    }, 300);
  }
};

export const onChangeRowValue = ({
  value,
  index,
  values,
  colors,
  updatePalette,
}: ChangeRowValueProps) => {
  let inputValue = String(value).replace(/[^0-9.,]/g, '');

  const dotCount = (inputValue.match(/\./g) || []).length;
  const commaCount = (inputValue.match(/,/g) || []).length;
  if (dotCount > 1 || commaCount > 1) {
    inputValue = inputValue.substring(0, inputValue.length - 1);
  }

  inputValue = inputValue.replace(/^0+(?![.,]|$)/, '');

  let numericValue;
  if (inputValue === '') {
    numericValue = 0;
  } else if (inputValue === '.' || inputValue === ',') {
    numericValue = '0.';
  } else {
    numericValue = inputValue.replace(',', '.');
  }
  if (index !== 0 && index !== colors.length) {
    const newValues = [...values.slice(0, index - 1), numericValue, ...values.slice(index)];
    updatePalette?.((prev) => ({ ...prev, ranges: { ...prev.ranges, values: newValues } }));
  }
};

export const onAddColor = ({ index, colors, values, updatePalette }: MutateColorProps) => {
  if (colors.length) {
    const existingNewTierNames = colors
      .filter((color) => color.name.startsWith('New tier'))
      .map((color) => color.name);

    let nextTierName = `New tier`;
    let counter = 1;

    while (existingNewTierNames.includes(nextTierName)) {
      counter++;
      nextTierName = `New tier ${counter}`;
    }

    const newColors = [
      ...colors.slice(0, index + 1),
      {
        name: nextTierName,
        hex: colorBetweenGenerator(colors[index]?.hex, colors[index + 1]?.hex, 50),
        id: Date.now().toString(),
        booleanValue: false,
      },
      ...colors.slice(index + 1),
    ];
    updatePalette?.((prev) => ({ ...prev, ranges: { ...prev.ranges, colors: newColors } }));
  }

  const newValues = [
    ...values.slice(0, index),
    index === 0 ? (+values[index] * 1.8) / 2 : (+values[index] + +values[index - 1]) / 2,
    ...values.slice(index),
  ];
  updatePalette?.((prev) => ({ ...prev, ranges: { ...prev.ranges, values: newValues } }));
};

export const onRemoveColor = ({ index, colors, values, updatePalette }: MutateColorProps) => {
  const filteredValues = values?.filter((_, i) => i !== index);

  const filteredColors = colors.filter((_, i) => i !== index);
  updatePalette?.((prev) => ({
    ...prev,
    ranges: { ...prev.ranges, colors: filteredColors, values: filteredValues },
  }));
};

export const onToggleSongWarningCheck = ({
  index,
  colors,
  updatePalette,
}: Omit<MutateColorProps, 'values'>) => {
  const newColors = colors.map((c, idx) => {
    if (idx === index) {
      return {
        ...c,
        warningSignal: !c.warningSignal,
      };
    }
    return c;
  });
  updatePalette?.((prev) => ({ ...prev, ranges: { ...prev.ranges, colors: newColors } }));
};
