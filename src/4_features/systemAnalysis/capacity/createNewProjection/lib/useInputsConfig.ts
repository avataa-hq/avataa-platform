import { FieldErrors } from 'react-hook-form';
import { CapacityRegionsModel, useTranslate, InputField, Inputs } from '6_shared';

interface IProps {
  errors: FieldErrors<Inputs>;
  regions?: CapacityRegionsModel[] | undefined;
}

type DynamicErrors = Record<keyof Inputs, string>;

export const useInputsConfig = ({ errors, regions }: IProps) => {
  const translate = useTranslate();

  const additionalInputLeftFields: InputField[] = [
    {
      name: 'cqq',
      label: 'CQQ (%)',
      placeholder: '100%',
      pattern: /^(100|[1-9][0-9]?|0)$/,
      errorMessage: 'Please enter percentage between 1 and 100',
      haserror: !!errors.cqq,
    },
    {
      name: 'cqq_overload_thr_days',
      label: translate('CQQ Bad Days'),
      placeholder: '10',
      pattern: /^([0-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-5])$/, // Number should be between 0 and 365
      errorMessage: 'Please enter a number between 0 and 365',
      haserror: !!errors.cqq_overload_thr_days,
    },
    {
      name: 'cqq_quantile',
      label: translate('CQQ Quantile'),
      placeholder: '0.1',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.cqq_quantile,
    },
    {
      name: 'util_chnn',
      label: 'UTIL CHNN (%)',
      placeholder: '100%',
      pattern: /^(100|[1-9][0-9]?|0)$/,
      errorMessage: 'Please enter percentage between 1 and 100',
      haserror: !!errors.util_chnn,
    },
    {
      name: 'uchnn_quantile',
      label: translate('UTIL CHNN Quantile'),
      placeholder: '0.1',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.uchnn_quantile,
    },
  ];

  const additionalInputRightFields: InputField[] = [
    {
      name: 'ltc',
      label: 'LTC (%)',
      placeholder: '100%',
      pattern: /^(100|[1-9][0-9]?|0)$/,
      errorMessage: 'Please enter percentage between 1 and 100',
      haserror: !!errors.ltc,
    },
    {
      name: 'ltc_overload_thr_days',
      label: translate('LTC Bad Days'),
      placeholder: '10',
      pattern: /^([0-9]|[1-9][0-9]|[1-2][0-9]{2}|3[0-5][0-9]|36[0-5])$/, // Number should be between 0 and 365
      errorMessage: 'Please enter a valid number between 0 and 365',
      haserror: !!errors.ltc_overload_thr_days,
    },
    {
      name: 'ltc_quantile',
      label: translate('LTC Quantile'),
      placeholder: '0.1',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.ltc_quantile,
    },
  ];

  const targetsInputLeftFields: InputField[] = [
    {
      name: 'capex',
      label: 'CAPEX',
      placeholder: '20.000.000',
      // pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      pattern: /^\d+(\.\d{3})*(,\d{1,2})?$/, // Number with a dot as a thousand separator
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.capex,
    },
    {
      name: 'kinvest',
      label: 'KInvest',
      placeholder: '1',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.kinvest,
    },
    {
      name: 'topology_depth',
      label: 'Topology analysis depth',
      placeholder: '2',
      pattern: /^(100|[1-9][0-9]?|0)$/,
      errorMessage: 'Please enter a number between 1 and 100',
      haserror: !!errors.topology_depth,
    },
  ];

  const targetsInputRightFields: InputField[] = [
    {
      name: 'kvols',
      label: 'Kvols',
      placeholder: '1.7',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.kvols,
    },
    {
      name: 'kltc',
      label: 'Kltc',
      placeholder: '0.02',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.kltc,
    },
    {
      name: 'kcqq',
      label: 'Kcqq',
      placeholder: '1',
      pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
      errorMessage: 'Please enter a number greater or equal to 0',
      haserror: !!errors.kcqq,
    },
  ];

  const dynamicFields = regions?.map((region) => ({
    name: region.region_name,
    label: region.region_name,
    placeholder: region.region_name,
    pattern: /^\d+(\.\d+)?$/, // Number or float from 0 to infinity
    errorMessage: 'Please enter a number greater or equal to 0',
    haserror: !!errors[region.region_name as keyof DynamicErrors],
  }));

  return {
    additionalInputLeftFields,
    additionalInputRightFields,
    targetsInputLeftFields,
    targetsInputRightFields,
    dynamicFields,
  };
};
