import { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';
import {
  CompositeFiltersItem,
  InternalProjectLink,
  ISessionRegistryModel,
  useDataAudit,
  useUser,
} from '6_shared';
import { AuditOptionsType } from '5_entites';

interface IProps {
  sessionAuditData: ISessionRegistryModel[] | undefined;
  onSelectedAuditChange: (item: AuditOptionsType) => void;
}

export const useGenerateSessionAuditColumns = ({
  sessionAuditData,
  onSelectedAuditChange,
}: IProps) => {
  const { user } = useUser();

  const { setCustomFilter } = useDataAudit();

  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  const onSessionClick = useCallback(
    (sessionId: string) => {
      const filter: CompositeFiltersItem = {
        tmoId: 1,
        selectedFilter: {
          columnFilters: [
            {
              column: {
                id: 'session_id',
                name: 'Session Id',
                type: 'string',
              },
              logicalOperator: 'and',
              filters: [
                {
                  operator: 'contains',
                  value: sessionId,
                },
              ],
            },
          ],
        },
      };

      setCustomFilter(filter);

      onSelectedAuditChange('Data audit');
    },
    [onSelectedAuditChange],
  );

  const onUserClick = useCallback(() => {
    const url = `https://auth.avataa.dev/admin/master/console/`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const renderSessionCell = useCallback(
    (sessionId: string) => (
      <Box
        component="div"
        sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}
      >
        <InternalProjectLink onClick={() => onSessionClick(sessionId)}>
          {sessionId}
        </InternalProjectLink>
      </Box>
    ),
    [onSessionClick],
  );

  const formatDate = useCallback((value: any) => {
    if (value && dayjs(value).isValid()) return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    return value;
  }, []);

  const generateDataAuditColumns = useCallback(
    (obj: Record<string, any>): GridColDef[] => {
      return Object.keys(obj).map((key) => {
        const column: GridColDef = {
          field: key,
          headerName: key
            .split('_')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          width: 150,
        };

        if (key === 'session_id') column.renderCell = (params) => renderSessionCell(params.value);
        if (key === 'activation_datetime' || key === 'deactivation_datetime')
          column.valueGetter = (value) => formatDate(value);

        return column;
      });
    },
    [renderSessionCell, formatDate],
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

  //       if (key === 'session_id') {
  //         column.renderCell = (params) => {
  //           const sessionId = params.value;
  //           return (
  //             <Box
  //               component="div"
  //               sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}
  //             >
  //               <InternalProjectLink onClick={() => onSessionClick(sessionId)}>
  //                 {sessionId}
  //               </InternalProjectLink>
  //             </Box>
  //           );
  //         };
  //       }

  //       if (key === 'activation_datetime' || key === 'deactivation_datetime') {
  //         column.valueGetter = (value) => {
  //           const isValid = value && dayjs(value).isValid();
  //           return isValid ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value;
  //         };
  //       }

  //       return column;
  //     });
  //   },
  //   [onSessionClick],
  // );

  useEffect(() => {
    if (!sessionAuditData || !sessionAuditData?.length) {
      setRows([]);
      setColumns([]);
      return;
    }

    const userColumn: GridColDef = {
      field: 'user',
      headerName: 'User',
      width: 150,
      renderCell: (params) => (
        <InternalProjectLink onClick={onUserClick}>{params.value}</InternalProjectLink>
      ),
    };

    const generatedColumns = generateDataAuditColumns(sessionAuditData[0]);
    const generatedRows = sessionAuditData.map((item) => ({
      ...item,
      user: `${user?.name?.trim() ?? 'No user name'}`,
    }));

    setColumns([userColumn, ...generatedColumns]);
    setRows(generatedRows);
  }, [sessionAuditData, generateDataAuditColumns, user, onUserClick]);

  return { columns, rows };
};
