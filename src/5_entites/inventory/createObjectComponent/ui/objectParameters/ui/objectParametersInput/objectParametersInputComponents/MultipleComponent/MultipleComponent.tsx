import { memo, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { transformValue } from '5_entites';
import { IObjectComponentParams, parametersApi, useTimezoneAdjustment } from '6_shared';
import * as SC from './MultipleComponent.styled';

const { useLazyGetFullDataAboutMoLinkQuery, useLazyGetFullDataAboutPrmLinkQuery } = parametersApi;

interface IProps {
  param: IObjectComponentParams;
  onEditClick: () => void;
  handleParamsLoading: (loading: boolean) => void;
  duplicateObject: boolean;
}

export const MultipleComponent = memo(
  ({ param, onEditClick, handleParamsLoading, duplicateObject }: IProps) => {
    const { setValue, getValues, formState } = useFormContext();
    const { disableTimezoneAdjustment } = useTimezoneAdjustment();
    const [isHovered, setIsHovered] = useState(false);

    const [getFullDataAboutMoLink, { isFetching: isMoLinkFetching }] =
      useLazyGetFullDataAboutMoLinkQuery();
    const [getFullDataAboutPrmLink, { isFetching: isPrmLinkFetching }] =
      useLazyGetFullDataAboutPrmLinkQuery();

    useEffect(() => {
      handleParamsLoading(isMoLinkFetching || isPrmLinkFetching);
    }, [handleParamsLoading, isMoLinkFetching, isPrmLinkFetching]);

    useEffect(() => {
      if (!param.prm_id) return;
      if (duplicateObject) {
        if (param.val_type === 'mo_link') {
          const getMoLinkData = async () => {
            const { data } = await getFullDataAboutMoLink([param.prm_id as number]);
            if (data && param.prm_id) {
              const value = data[param.prm_id.toString()]?.value ?? [];
              setValue(param.id.toString(), value);
            }
          };
          getMoLinkData();
        }

        if (param.val_type === 'prm_link') {
          const getPrmLinkData = async () => {
            const { data } = await getFullDataAboutPrmLink([param.prm_id as number]);
            if (data && param.prm_id) {
              const value = data[param.prm_id.toString()]?.value ?? [];
              setValue(param.id.toString(), value);
            }
          };
          getPrmLinkData();
        }
      }
    }, [getFullDataAboutMoLink, setValue, duplicateObject, param, getFullDataAboutPrmLink]);

    const transformParamValue = (currentParam: IObjectComponentParams) => {
      if (Array.isArray(getValues(currentParam.id.toString()))) {
        if (currentParam.val_type === 'datetime') {
          return getValues(currentParam.id.toString())
            .map((p: string) =>
              transformValue({ value: p, valType: 'datetime', disableTimezoneAdjustment }),
            )
            .join('/');
        }

        if (
          currentParam.val_type === 'mo_link' &&
          getValues(`${currentParam.id.toString()}_${currentParam.id.toString()}`)
        ) {
          return getValues(`${currentParam.id.toString()}_${currentParam.id.toString()}`)
            .map((item: any) => (typeof item === 'object' ? item.name : item))
            .join('/');
        }

        return getValues(currentParam.id.toString())
          ?.map((item: any) => (typeof item === 'object' ? item.name : item))
          .join('/');
      }

      return getValues(currentParam.name);
    };

    return (
      <SC.MultipleComponentStyled>
        <SC.Label>{param.name}</SC.Label>
        <SC.Wrapper
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <SC.Field>{transformParamValue(param)}</SC.Field>
          {isHovered && (
            <SC.IconButtonStyled onClick={onEditClick}>
              <SC.EditIcon />
            </SC.IconButtonStyled>
          )}
        </SC.Wrapper>
        {Object.keys(formState.errors).length > 0 && formState.errors[param.name]?.message && (
          <SC.ErrorMessage color="error">
            {String(formState.errors[param.name]?.message)}
          </SC.ErrorMessage>
        )}
      </SC.MultipleComponentStyled>
    );
  },
);
