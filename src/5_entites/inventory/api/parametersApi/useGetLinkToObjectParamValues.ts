import { parametersApi } from '6_shared';

const { useGetParameterValuesQuery } = parametersApi;

interface IProps {
  moId: number | null;
  tprmList?: number[];
  skip?: boolean;
}

export const useGetLinkToObjectParamValues = ({ moId, tprmList, skip }: IProps) => {
  const {
    data: moLinkParamValues,
    isFetching: isMoLinkParamValuesLoading,
    isSuccess: isMoLinkParamValuesSuccess,
    isError: isMoLinkParamValuesError,
  } = useGetParameterValuesQuery(
    { id: moId!, body: tprmList! },
    { skip: !moId || !tprmList || !tprmList.length || skip },
  );

  return {
    moLinkParamValues,
    isMoLinkParamValuesLoading,
    isMoLinkParamValuesSuccess,
    isMoLinkParamValuesError,
  };
};
