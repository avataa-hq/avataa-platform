import { useMemo } from 'react';
import { MoLinkInfoModel, OutMoLinkData } from '6_shared';

interface IProps {
  incMoLinkInfo?: MoLinkInfoModel[];
  outMoLinkInfo?: OutMoLinkData[];
  objId: number;
}

export const useGetObjectParamPairs = ({ incMoLinkInfo, outMoLinkInfo, objId }: IProps) => {
  const incomingObjectParamPairs = useMemo(() => {
    if (!incMoLinkInfo) return [];

    return incMoLinkInfo.map((item) => {
      return {
        object_id: item.mo_id,
        tprm_id: item.tprm_id,
      };
    });
  }, [incMoLinkInfo]);

  const outgoingObjectParamPairs = useMemo(() => {
    if (!outMoLinkInfo) return [];

    return outMoLinkInfo
      .map((item) => ({ object_id: objId, tprm_id: item.tprm_id }))
      .filter((item, index, self) => index === self.findIndex((i) => i.tprm_id === item.tprm_id));
  }, [objId, outMoLinkInfo]);

  return {
    incomingObjectParamPairs,
    outgoingObjectParamPairs,
  };
};
