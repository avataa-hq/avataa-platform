import { useMemo } from 'react';
import { useGetObjectTypes } from '5_entites';
import { ITmoModel } from '4_features';
import { NavigationData, parametersApi, parameterTypesApi } from '6_shared';

interface IProps {
  tmoId: number | null;
  skipFetching?: boolean;
  selectedObjectData?: NavigationData | null;
}

export const useGetRelatedData = ({ tmoId, skipFetching, selectedObjectData }: IProps) => {
  const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
  const { useGetParameterValuesQuery } = parametersApi;

  // Get tprms for the selected object
  const { data: objectTypeParamTypesData, isLoading: objectTypeParamTypesLoading } =
    useGetObjectTypeParamTypesQuery(
      { id: tmoId! },
      {
        skip: !tmoId || skipFetching,
      },
    );

  // Select mo_link tprms
  const moLinkTprmsData = useMemo(() => {
    return objectTypeParamTypesData
      ? objectTypeParamTypesData.filter(
          (itm) => itm.val_type === 'mo_link' && itm.constraint !== null,
        )
      : [];
  }, [objectTypeParamTypesData]);

  // Get model for tmp and tprm mass queries
  const moLinksRequiredData = useMemo(() => {
    if (!moLinkTprmsData) return { tprm: [], tmo: [] };

    return moLinkTprmsData.reduce(
      (accumulator, item) => {
        accumulator.tprm.push(item.id);
        accumulator.tmo.push(+item.constraint!);

        return accumulator;
      },
      { tprm: [], tmo: [] } as {
        tprm: number[];
        tmo: number[];
      },
    );
  }, [moLinkTprmsData]);

  const {
    objectTypesData: outgoingLinkedObjectsTmo,
    isFetching: isOutgoingLinkedObjectsTmoLoading,
  } = useGetObjectTypes({
    objectTypesIds: moLinksRequiredData.tmo,
    skip: !moLinksRequiredData.tmo || !moLinksRequiredData.tmo.length || skipFetching,
  });

  // In this request we are getting object ids (NOT text names!) for tprm list from moLinksRequiredData for selected object
  const { data: moLinkParamValues, isFetching: isMoLinkParamValuesLoading } =
    useGetParameterValuesQuery(
      { id: selectedObjectData?.id!, body: moLinksRequiredData.tprm },
      { skip: !selectedObjectData?.id || !moLinksRequiredData?.tprm.length || skipFetching },
    );

  // Getting model to build DataGrid
  const relatedTmoModel = useMemo(() => {
    if (!outgoingLinkedObjectsTmo || !moLinkParamValues) return [];

    let model: ITmoModel[] = [];

    moLinkTprmsData.forEach((item) => {
      const currentTPRMObject = moLinkParamValues.find((elem) => elem.tprm_id === item.id);

      if (currentTPRMObject) {
        const currentTmoObject = outgoingLinkedObjectsTmo.find(
          (tmo) => item.constraint && String(tmo.id) === String(item.constraint),
        );

        if (currentTmoObject) {
          const getMoIds = (): number[] => {
            if (!currentTPRMObject.value) return [];
            if (Array.isArray(currentTPRMObject.value)) return currentTPRMObject.value as number[];
            if (typeof currentTPRMObject.value === 'string') return [+currentTPRMObject.value];
            if (typeof currentTPRMObject.value === 'number') return [currentTPRMObject.value];
            return [];
          };

          model = [
            ...model,
            {
              tmoName: currentTmoObject.name,
              tmoId: currentTmoObject.id,
              moIds: getMoIds(),
              tprmName: item.name,
            },
          ];
        }
      }
    });

    return model;
  }, [moLinkParamValues, moLinkTprmsData, outgoingLinkedObjectsTmo]);

  return {
    relatedTmoModel,
    isLoadingRelatedData:
      objectTypeParamTypesLoading ||
      isOutgoingLinkedObjectsTmoLoading ||
      isMoLinkParamValuesLoading,
  };
};
