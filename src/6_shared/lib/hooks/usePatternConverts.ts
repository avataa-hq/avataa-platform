import { useTranslate } from '6_shared';

export const usePatternConverts = () => {
  const translate = useTranslate();

  const patternConverts: (valType: string) => { value: RegExp; message: string } | undefined = (
    valType,
  ) => {
    if (valType === 'int' || valType === 'float') {
      const regex = valType === 'int' ? /^-?\d+$/ : /^-?[0-9]*(\.[0-9]+)?$/;
      return {
        value: regex,
        message:
          valType === 'int'
            ? translate('Please enter a valid number')
            : translate('Please enter a valid float'),
      };
    }

    if (valType === 'sequence') {
      const regex = /^[1-9]\d*$/;
      return {
        value: regex,
        message: translate('Please enter a positive integer'),
      };
    }

    return undefined;
  };
  return { patternConverts };
};
