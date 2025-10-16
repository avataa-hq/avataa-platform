import { useEffect, useState } from 'react';
// import { enqueueSnackbar } from 'notistack';
import { objectsApi, useConfig, useProcessManager } from '6_shared';
import { generateOpenDashboardLink } from '../generateOpenDashboardLink';
import { generateOpenMapLink } from '../generateOpenMapLink';

const { useGetObjectWithGroupedParametersQuery, useGetObjectWithParametersQuery } = objectsApi;

interface IProps {
  objectId?: number;
}

export const useGenerateLink = ({ objectId }: IProps) => {
  const [openMapLink, setOpenMapLink] = useState<string | null>(null);
  const [openDashboardLink, setOpenDashboardLink] = useState<string | null>(null);

  const { setIsOpenMapActive, setIsOpenDashboardActive } = useProcessManager();

  const {
    config: { processDashboardBaseUrl, processMapBaseUrl },
  } = useConfig();

  const { data: groupedObjectParameters } = useGetObjectWithGroupedParametersQuery(
    { id: objectId! },
    { skip: objectId === undefined },
  );

  const { data: objectWithParametersData } = useGetObjectWithParametersQuery(
    { id: objectId!, with_parameters: true },
    { skip: objectId === undefined },
  );

  // const showMessage = (newParamName: string) => {
  //   enqueueSnackbar(
  //     `There is no link to ${newParamName === 'Element Name' ? 'map' : 'dashboard'}`,
  //     {
  //       variant: 'info',
  //     },
  //   );
  // };

  // /**
  //  * Function to find param value based on parameter type name.
  //  * @param {string} paramName - The name of the parameter to search for.
  //  * @returns {string|null} - The value of the parameter if found, or null.
  //  */
  // const openLink = (paramName: string) => {
  //   if (objectId !== undefined && groupedObjectParameters) {
  //     const findTprmObject = groupedObjectParameters.flatMap(
  //       (item) => item.params.find((param) => param.name === paramName) || [],
  //     );

  //     if (objectWithParametersData && findTprmObject.length > 0) {
  //       const isParamInObjectParams = objectWithParametersData.params?.find(
  //         (item) => item.tprm_id === findTprmObject[0]?.tprm_id,
  //       );

  //       if (!isParamInObjectParams) {
  //         showMessage(paramName);
  //       }

  //       if (isParamInObjectParams && paramName === 'Element Name') {
  //         const functionResponse = generateOpenMapLink({
  //           paramValue: isParamInObjectParams.value as string,
  //           processMapBaseUrl,
  //         });
  //         if (functionResponse) dispatch(setIsOpenMapActive(false));
  //         if (functionResponse === null) {
  //           dispatch(setIsOpenMapActive(true));
  //           showMessage(paramName);
  //         }
  //       }

  //       if (isParamInObjectParams && paramName === 'to_navigator') {
  //         const functionResponse = generateOpenDashboardLink({
  //           openDashboardLinkParams: isParamInObjectParams.value as string,
  //           processDashboardBaseUrl,
  //         });
  //         if (functionResponse) dispatch(setIsOpenDashboardActive(false));
  //         else dispatch(setIsOpenDashboardActive(true));
  //       }
  //     }
  //   }

  //   return null;
  // };

  useEffect(() => {
    if (objectId !== undefined && groupedObjectParameters) {
      // const findTprmObject = groupedObjectParameters.flatMap(
      //   (item) =>
      //     item.params.find(
      //       (param) => param.name === 'Element Name' || param.name === 'to_navigator',
      //     ) || [],
      // );

      const allParams = groupedObjectParameters.flatMap((item) => item.params);
      const findOpenMapParam = allParams.find((item) => item.name === 'Element Name');
      const findOpenDashboardParam = allParams.find((item) => item.name === 'to_navigator');

      if (objectWithParametersData) {
        if (findOpenMapParam) {
          const isParamInObjectParams = objectWithParametersData.params?.find(
            (item) => item.tprm_id === findOpenMapParam.tprm_id,
          );

          if (isParamInObjectParams) {
            const newOpenMapLink = generateOpenMapLink({
              paramValue: isParamInObjectParams.value as string,
              processMapBaseUrl,
            });
            setOpenMapLink(newOpenMapLink);
            setIsOpenMapActive(!newOpenMapLink);
          } else {
            setIsOpenMapActive(true);
          }
        }

        if (findOpenDashboardParam) {
          const isParamInObjectParams = objectWithParametersData.params?.find(
            (item) => item.tprm_id === findOpenDashboardParam.tprm_id,
          );
          if (isParamInObjectParams) {
            const newOpenDashboardLink = generateOpenDashboardLink({
              openDashboardLinkParams: isParamInObjectParams.value as string,
              processDashboardBaseUrl,
            });

            if (newOpenDashboardLink) {
              const url = new URL(newOpenDashboardLink);
              const searchParams = new URLSearchParams(url.search);
              const portlet = searchParams.get('portlet');

              if (portlet === '{}') {
                setOpenDashboardLink(null);
                setIsOpenDashboardActive(true);
              } else {
                setOpenDashboardLink(newOpenDashboardLink);
                setIsOpenDashboardActive(false);
              }
            }
          } else {
            setIsOpenDashboardActive(true);
          }
        }
      }
    }
  }, [
    groupedObjectParameters,
    objectId,
    objectWithParametersData,
    processDashboardBaseUrl,
    processMapBaseUrl,
  ]);

  return { openMapLink, openDashboardLink };
};
