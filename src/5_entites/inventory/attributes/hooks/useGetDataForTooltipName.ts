import { useEffect, useState } from 'react';
import { useGetObjectTypes, useGetParamTypeNamesByParamTypeIds } from '5_entites/inventory/api';
import { ICreateTooltipTextProps } from '5_entites';
import { InventoryObjectWithGroupedParametersModel, InventoryParameterTypesModel } from '6_shared';

interface IProps {
  objectTypeParamTypesData?: InventoryParameterTypesModel[] | undefined;
  objectParams?: InventoryObjectWithGroupedParametersModel[];
}

export const useGetDataForTooltipName = ({ objectTypeParamTypesData, objectParams }: IProps) => {
  const [linkToObjectTmoIds, setLinkToObjectTmoIds] = useState<number[]>([]);
  const [tprmIds, setTprmIds] = useState<number[]>([]);

  const { objectTypesData, isFetching: isObjectTypesFetching } = useGetObjectTypes({
    objectTypesIds: linkToObjectTmoIds,
    skip: linkToObjectTmoIds.length === 0,
  });

  const { paramTypeNamesData, isParamTypeNamesFetching } = useGetParamTypeNamesByParamTypeIds({
    tprmIds,
  });

  useEffect(() => {
    if (objectParams && objectParams.length !== 0) {
      const allParams = objectParams.flatMap((p) => p.params);
      const { tmoIds, newTprmIds } = allParams.reduce<{ tmoIds: number[]; newTprmIds: number[] }>(
        (acc, param) => {
          if (param.constraint !== null) {
            if (param.val_type === 'mo_link') {
              acc.tmoIds.push(+param.constraint);
            }

            if (param.val_type === 'prm_link') {
              acc.newTprmIds.push(Number(param.constraint) || 0);
            }
          }

          return acc;
        },
        { tmoIds: [], newTprmIds: [] },
      );

      setLinkToObjectTmoIds(tmoIds);
      setTprmIds(newTprmIds);
    }
  }, [objectParams]);

  useEffect(() => {
    if (objectTypeParamTypesData && objectTypeParamTypesData.length !== 0) {
      const tmoIds = objectTypeParamTypesData.reduce((acc, param) => {
        if (param.val_type === 'mo_link' && param.constraint !== null) {
          acc.push(+param.constraint);
        }
        return acc;
      }, [] as number[]);

      setLinkToObjectTmoIds(tmoIds);

      const newTprmIds = objectTypeParamTypesData.reduce((acc, param) => {
        if (param.val_type === 'prm_link' && param.constraint !== null) {
          acc.push(Number(param.constraint.split(':')[1]) || 0);
        }
        return acc;
      }, [] as number[]);

      setTprmIds(newTprmIds);
    }
  }, [objectTypeParamTypesData]);

  const createTooltipText = ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => {
    if (paramConstraint !== null && paramConstraint !== '') {
      if (objectTypesData && paramValType === 'mo_link') {
        const objectTypeName = objectTypesData.find((item) => item.id === +paramConstraint!)?.name;
        return `Constraint: ${objectTypeName}`;
      }

      if (paramTypeNamesData && paramValType === 'prm_link') {
        return `Constraint: ${
          paramTypeNamesData[paramConstraint.split(':')[1] ?? paramConstraint]
        }`;
      }

      return `Constraint: ${paramConstraint}`;
    }

    return '';
  };

  return { createTooltipText, isObjectTypesFetching, isParamTypeNamesFetching };
};
