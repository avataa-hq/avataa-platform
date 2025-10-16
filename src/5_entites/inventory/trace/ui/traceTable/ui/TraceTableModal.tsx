import { useMemo, useState } from 'react';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { filterTraceTableData } from '5_entites/inventory/trace/lib';
import { ActionTypes, Box, GetPathModel } from '6_shared';
import { IRoute } from '5_entites';
import { Header } from './header/Header';
import { TraceTable } from './traceTable/TraceTable';
import * as SC from './TraceTableModal.styled';

interface TraceTableProps {
  isOpen: boolean;
  onClose: () => void;
  pathData: GetPathModel | undefined;
  loading: boolean;
  traceRouteValue?: IRoute | null;
  permissions?: Record<ActionTypes, boolean>;
}

export const TraceTableModal = ({
  isOpen,
  onClose,
  pathData,
  loading,
  traceRouteValue,
  permissions,
}: TraceTableProps) => {
  const apiRef = useGridApiRef();
  const [searchQuery, setSearchQuery] = useState('');

  const commonViewRows = useMemo(() => {
    if (!pathData) return [];
    const { nodes, tmo } = pathData;

    return nodes.map(({ data, key }) => {
      return data
        ? {
            id: key,
            tmo_name: tmo.find((t) => t.tmo_id === data.tmo_id)?.name || '-',
            mo_id: data.id,
            mo_name: data.name,
            parent_mo_name:
              nodes.find((n) => data.p_id && n.data?.id === data.p_id)?.data?.name || '-',
            parent_mo_id: data.p_id || '-',
            latitude: data.latitude || '-',
            longitude: data.longitude || '-',
          }
        : {};
    });
  }, [pathData]);

  return (
    <SC.TraceTableModalStyled open={isOpen} onClose={onClose}>
      <SC.TraceTableModalContainer>
        <IconButton sx={{ position: 'absolute', right: '10px', top: '10px' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Header
          title=""
          apiRef={apiRef}
          setSearchQuery={setSearchQuery}
          traceRouteValue={traceRouteValue}
        />
        <Box sx={{ height: '400px', overflow: 'auto' }}>
          <TraceTable
            apiRef={apiRef}
            rows={filterTraceTableData(commonViewRows, searchQuery)}
            loading={loading}
          />
        </Box>
      </SC.TraceTableModalContainer>
    </SC.TraceTableModalStyled>
  );
};
