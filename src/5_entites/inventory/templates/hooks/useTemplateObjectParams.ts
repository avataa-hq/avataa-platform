import { useMemo } from 'react';
import {
  InventoryParameterTypesModel,
  IObjectTemplateParameterModel,
  useTranslate,
} from '6_shared';
import { useFormContext } from 'react-hook-form';
import { ITemplateParam, TemplateMode } from '../model';

interface IProps {
  mode: TemplateMode;
  objectTypeParamTypes: InventoryParameterTypesModel[] | undefined;
  templateObjectParameters: IObjectTemplateParameterModel[] | undefined;
  searchValue: string;
}

export const useTemplateObjectParams = ({
  mode,
  objectTypeParamTypes,
  templateObjectParameters,
  searchValue,
}: IProps) => {
  const translate = useTranslate();
  const { setError, setValue } = useFormContext();

  const params = useMemo(() => {
    const newParams = objectTypeParamTypes
      ? objectTypeParamTypes.reduce<ITemplateParam[]>((acc, param) => {
          if (param.val_type === 'formula') return acc;
          const existingParam =
            mode === 'edit'
              ? templateObjectParameters?.find((item) => item.parameter_type_id === param.id)
              : null;

          if (existingParam) {
            if (!existingParam.valid) {
              setError(param.id.toString(), {
                type: 'required',
                message: translate('Template parameter is not valid'),
              });
            }
          }

          const paramValue =
            existingParam?.value && param.multiple
              ? JSON.parse(existingParam.value || '[]')
              : existingParam?.value || null;

          acc.push({
            ...param,
            templateParamId: existingParam?.id,
            tprm_id: param.id,
            value: paramValue,
            expanded: false,
            showExpandButton: false,
            mo_id: 0,
            prm_id: null,
            required: false,
            primary: false,
          });

          setValue(param.id.toString(), paramValue);

          return acc;
        }, [])
      : [];

    return newParams.filter((p) =>
      p.name.trim().toLowerCase().includes(searchValue.trim().toLowerCase()),
    );
  }, [
    setValue,
    objectTypeParamTypes,
    mode,
    templateObjectParameters,
    setError,
    translate,
    searchValue,
  ]);

  return { params };
};
