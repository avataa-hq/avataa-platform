import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from '@reduxjs/toolkit/query';
import {
  GetObjectWithParametersQueryParamsRequest,
  GetParameterRequestParams,
  IInventoryObjectModel,
  InventoryParameterModel,
  useAppNavigate,
  useAssociatedObjects,
  useObjectDetails,
} from '6_shared';
import { MainModuleListE } from '../../../../config/mainModulesConfig';

type LazyGetParameterTriggerType = LazyQueryTrigger<
  QueryDefinition<
    GetParameterRequestParams,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta>,
    never,
    InventoryParameterModel
  >
>;

type LazyGetAttributesTriggerType = LazyQueryTrigger<
  QueryDefinition<
    GetObjectWithParametersQueryParamsRequest,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta>,
    never,
    IInventoryObjectModel
  >
>;

interface IProps {
  getParameter?: LazyGetParameterTriggerType;
  getAttributes?: LazyGetAttributesTriggerType;
}

export const useLinkClicks = ({ getParameter, getAttributes }: IProps) => {
  const navigate = useAppNavigate();

  const { setIsOpenAssociatedTableModal } = useAssociatedObjects();
  const { pushObjectIdToStack } = useObjectDetails();

  const openObjectInDetails = useCallback(
    (objId: number) => {
      navigate(MainModuleListE.objectDetails);
      if (objId) {
        pushObjectIdToStack(objId);
        setIsOpenAssociatedTableModal(false);
      }
    },
    [navigate],
  );

  const handleObjectLinkClick = useCallback(
    async (objectId: number, paramTypeId: number, moLinkIndex: number) => {
      if (!getParameter) return;

      try {
        const { data } = await getParameter({
          object_id: objectId,
          param_type_id: paramTypeId,
        });
        if (!data) return;

        const moLinkId = Array.isArray(data.value) ? data.value[moLinkIndex] : data.value;

        openObjectInDetails(moLinkId as number);
      } catch (error) {
        console.error(error);
        enqueueSnackbar({ message: error.message, variant: 'error' });
      }
    },
    [getParameter, openObjectInDetails],
  );

  const handleAttributesClick = useCallback(
    async (objectId: number, field: string) => {
      if (!getAttributes) return;

      try {
        const { data } = await getAttributes({ id: objectId, with_parameters: false });

        if (!data) return;

        if (data[field]) {
          openObjectInDetails(data[field] as number);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar({ message: error.message, variant: 'error' });
      }
    },
    [getAttributes, openObjectInDetails],
  );

  return { openObjectInDetails, handleObjectLinkClick, handleAttributesClick };
};
