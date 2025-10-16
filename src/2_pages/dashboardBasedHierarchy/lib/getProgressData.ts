import { IArcProgressData, IArcProgressIcon, ITickMark } from '6_shared/ui/arcProgress/types';
import { EventType, IRangeModel } from '6_shared';
import { getAggregationNumberArray } from './getAggregationNumberArray';

const getIcon = (value: number, comparisonZeroPoint: number): IArcProgressIcon => {
  if (value > comparisonZeroPoint) return { type: 'up' };
  if (value < comparisonZeroPoint) return { type: 'down' };
  return { type: 'stable' };
};

const getTargets = (goal?: string, colorRanges?: IRangeModel): ITickMark[] => {
  return (
    colorRanges?.colors?.map((c, idx) => {
      const prevValue = colorRanges?.values[idx - 1];
      const currenValue = colorRanges?.values[idx];

      let label = '';

      if (idx === 0) label = `< ${currenValue}`;

      if (prevValue && currenValue) label = `${prevValue} - ${currenValue}`;

      if (!currenValue && prevValue) label = `> ${prevValue}`;

      return { color: c.hex, label, description: goal } as ITickMark;
    }) ?? []
  );
};

interface IProps {
  mainValueList: number[];
  additionalValueList: number[];
  comparisonZeroPoint: number;

  colorRanges?: IRangeModel;
  kpi?: EventType | null;
}

export const getProgressData = ({
  mainValueList,
  additionalValueList,
  comparisonZeroPoint,
  colorRanges,
  kpi,
}: IProps) => {
  const { aggregation, goal, min, max, unit, name, decimals, description } = { ...kpi };

  const valueDecimals = decimals ? +decimals : undefined;

  const aggregationType = aggregation ?? 'AVG';

  const minValue = min ? +min : 0;
  const maxValue = max ? +max : 100;
  const unitValue = unit ?? '';
  const nameValue = name ?? '-';

  const AGGMainValue = getAggregationNumberArray(mainValueList, aggregationType);
  const AGGAdditionalValue = getAggregationNumberArray(additionalValueList, aggregationType);

  const icon = getIcon(AGGMainValue, comparisonZeroPoint);
  const targets = getTargets(goal, colorRanges);

  const arcProgressData: IArcProgressData = {
    value: {
      value: AGGMainValue,
      min: minValue,
      max: maxValue,
      valueUnit: unitValue,
      valueDecimals,
      tickMarks: targets,
      label: nameValue,
      description: description ?? '',
    },
    additionalValue: {
      value: AGGAdditionalValue,
      min: minValue,
      max: maxValue,
      valueUnit: unitValue,
    },
    icon,
  };

  return arcProgressData;
};
