import { useTranslate } from '6_shared';
import {
  firstValueRounder,
  secondValueRounder,
  valueDimensioner,
} from '6_shared/lib/utils/valueDimensioners';

interface IGetColorIntervalProps {
  //   color: string;
  index: number;
  values: number[];
}

export const useColorIntervals = () => {
  const translate = useTranslate();

  const getColorInterval = ({ index, values }: IGetColorIntervalProps) => {
    if (index === 0) {
      return `${translate('Less than')} ${secondValueRounder({
        values,
        index,
      })} ${translate(valueDimensioner({ values, index }))}`;
    }

    if (index !== 0 && index !== values.length) {
      return `${firstValueRounder({ values, index })} to ${secondValueRounder({
        values,
        index,
      })} ${translate(valueDimensioner({ values, index }))}`;
    }

    if (index === values.length) {
      return `${translate('More than')} ${firstValueRounder({
        values,
        index,
      })} ${translate(valueDimensioner({ values, index: index - 1 }))}`;
    }

    return null;
  };

  return { getColorInterval };
};
