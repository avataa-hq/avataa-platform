import { useEffect, useMemo, useState } from 'react';
import {
  InitialSourceObjectValues,
  MoLinkInfoModel,
  OutMoLinkData,
  useDeleteObjectWithLinks,
} from '6_shared';
import { useGetLinkToObjectParamValues } from '../../../api';

interface IProps {
  objId: number;
  incMoLinkInfo?: MoLinkInfoModel[];
  outMoLinkInfo?: OutMoLinkData[];
}

export const useGetLinkedObjectsInitialValues = ({
  objId,
  incMoLinkInfo,
  outMoLinkInfo,
}: IProps) => {
  const { addedObjectId } = useDeleteObjectWithLinks();

  // Incoming links
  const incomingLinkObjectInitialValues = useMemo(() => {
    if (!incMoLinkInfo) return [];

    return incMoLinkInfo.reduce((acc, curr) => {
      const initialValue = { [curr.mo_id]: { [curr.tprm_id]: curr.value } };
      return { ...acc, ...initialValue };
    }, {});
  }, [incMoLinkInfo]);

  // Outgoing links for object to delete
  const outgoingLinkObjectToDeleteInitialValues = useMemo(() => {
    if (!outMoLinkInfo) return {};

    return {
      [objId]: outMoLinkInfo.reduce<Record<string, number | number[]>>((acc, item) => {
        const { tprm_id, multiple, mo_out_info } = item;
        const key = tprm_id.toString();

        if (multiple) {
          if (!Array.isArray(acc[key])) {
            acc[key] = [];
          }
          (acc[key] as number[]).push(mo_out_info.id);
        } else {
          acc[key] = mo_out_info.id;
        }
        return acc;
      }, {}),
    };
  }, [objId, outMoLinkInfo]);

  // Outgoing links for added objects
  const [outgoingLinkObjectInitialValues, setOutgoingLinkObjectInitialValues] =
    useState<InitialSourceObjectValues>({});

  const outMoLinkTprms: number[] = useMemo(() => {
    if (!outMoLinkInfo) return [];

    return outMoLinkInfo.reduce((acc: number[], curr: OutMoLinkData) => {
      if (!acc.includes(curr.tprm_id)) {
        acc.push(curr.tprm_id);
      }
      return acc;
    }, [] as number[]);
  }, [outMoLinkInfo]);

  // useEffect(() => {
  //   if (outMoLinkInfo) setOutgoingLinkObjectInitialValues(outgoingLinkObjectToDeleteInitialValues);
  // }, [outMoLinkInfo, outgoingLinkObjectToDeleteInitialValues, setOutgoingLinkObjectInitialValues]);

  const { moLinkParamValues } = useGetLinkToObjectParamValues({
    moId: addedObjectId,
    tprmList: outMoLinkTprms,
  });

  const initialValues = useMemo(() => {
    if (!moLinkParamValues || !addedObjectId) return {};

    const moLinkInitialValues = moLinkParamValues.reduce<Record<string, number | number[]>>(
      (acc, curr) => {
        acc[curr.tprm_id] = curr.value;
        return acc;
      },
      {},
    );

    return { [addedObjectId]: moLinkInitialValues };
  }, [moLinkParamValues, addedObjectId]);

  useEffect(() => {
    if (initialValues)
      setOutgoingLinkObjectInitialValues((prevState) => ({ ...prevState, ...initialValues }));
  }, [initialValues, setOutgoingLinkObjectInitialValues]);

  return {
    outgoingLinkObjectToDeleteInitialValues,
    incomingLinkObjectInitialValues,
    outgoingLinkObjectInitialValues,
  };
};
