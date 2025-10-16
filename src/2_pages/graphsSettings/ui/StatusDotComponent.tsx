import { useTranslate } from '6_shared';
import { GraphData } from '6_shared/api/graph/types';
import { FiberManualRecord } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const statusColors = {
  New: 'info',
  Complete: 'success',
  Error: 'error',
  'In Process': 'primary',
} as const;

export const StatusDotComponent = ({ status }: { status: GraphData['status'] }) => {
  const translate = useTranslate();

  return (
    // @ts-ignore - `translate` function has a fallback in case the phrase is not found
    <Tooltip title={translate(status)}>
      <FiberManualRecord sx={{ width: '15px' }} color={statusColors[status]} />
    </Tooltip>
  );
};
