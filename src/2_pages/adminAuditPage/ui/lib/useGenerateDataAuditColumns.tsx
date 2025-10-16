import { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';
import { IGetEventsByFilterModel, InternalProjectLink, useObjectDetails, useTabs } from '6_shared';

interface IProps {
  eventsData: IGetEventsByFilterModel | undefined;
}

export const useGenerateDataAuditColumns = ({ eventsData }: IProps) => {
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  const { addAdminTab } = useTabs();
  const { pushObjectIdToStack } = useObjectDetails();

  const onObjectClick = useCallback((objectId: number) => {
    addAdminTab({ value: 'objectDetails' });
    if (objectId) pushObjectIdToStack(objectId);
  }, []);

  const renderInstanceCell = useCallback(
    (instance: string, instanceId: number) => {
      if (instance === 'MO') {
        return (
          <Box
            component="div"
            sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}
          >
            <InternalProjectLink onClick={() => onObjectClick(instanceId)}>
              {instanceId}
            </InternalProjectLink>
          </Box>
        );
      }
      return <span>{instanceId}</span>;
    },
    [onObjectClick],
  );

  const formatDate = useCallback((value: any) => {
    if (value && dayjs(value).isValid()) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    }
    return value;
  }, []);

  const generateDataAuditColumns = useCallback(
    (obj: Record<string, any>): GridColDef[] => {
      return Object.keys(obj).map((key) => {
        const column: GridColDef = {
          field: key,
          headerName: key
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          width: 150,
        };

        if (key === 'instance_id') {
          column.renderCell = (params) => renderInstanceCell(params.row.instance, params.value);
        }

        if (key === 'valid_from') {
          column.valueGetter = (value) => formatDate(value);
        }

        return column;
      });
    },
    [formatDate, renderInstanceCell],
  );

  // const generateDataAuditColumns = useCallback(
  //   (obj: Record<string, any>): GridColDef[] => {
  //     return Object.keys(obj).map((key) => {
  //       const column: GridColDef = {
  //         field: key,
  //         headerName: key
  //           .split('_')
  //           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //           .join(' '),
  //         width: 150,
  //       };

  //       if (key === 'instance_id') {
  //         column.renderCell = (params) => {
  //           const { instance } = params.row;
  //           const instanceId = params.value;
  //           if (instance === 'MO') {
  //             return (
  //               <Box
  //                 component="div"
  //                 sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}
  //               >
  //                 <InternalProjectLink onClick={() => onObjectClick(instanceId)}>
  //                   {instanceId}
  //                 </InternalProjectLink>
  //               </Box>
  //             );
  //           }
  //           return <span>{instanceId}</span>;
  //         };
  //       }

  //       if (key === 'valid_from') {
  //         column.valueGetter = (value) => {
  //           const isValid = value && dayjs(value).isValid();
  //           return isValid ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value;
  //         };
  //       }

  //       return column;
  //     });
  //   },
  //   [onObjectClick],
  // );

  useEffect(() => {
    if (!eventsData || !eventsData?.data?.length) {
      setRows([]);
      setColumns([]);
      return;
    }

    const generatedColumns = generateDataAuditColumns(eventsData.data[0]);
    const generatedRows = eventsData.data.map((item, index) => ({
      id: index + 1,
      ...item,
    }));

    setColumns(generatedColumns);
    setRows(generatedRows);
  }, [eventsData, generateDataAuditColumns]);

  return { columns, rows };
};
