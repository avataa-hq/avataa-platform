import { CircularProgress, MenuItem, Paper, Popper, Typography } from '@mui/material';

import { GetNodesByMoIdModel, graphApi, useTranslate } from '6_shared';
import { useState } from 'react';
import { ArrowForwardIosRounded } from '@mui/icons-material';

interface DiagramContextMenuItemProps {
  onClick: (d: GetNodesByMoIdModel) => void;
  objectId: number;
}

export const DiagramContextMenuItem = ({ objectId, onClick }: DiagramContextMenuItemProps) => {
  const { useGetObjectDiagramsQuery } = graphApi.search;
  const translate = useTranslate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: objectDiagrams, isFetching: isObjectDiagramsFetching } = useGetObjectDiagramsQuery(
    objectId ?? 0,
    {
      skip: !objectId,
    },
  );

  return (
    <MenuItem
      sx={{ display: 'flex', justifyContent: 'space-between' }}
      disabled={isObjectDiagramsFetching || !objectDiagrams?.length}
      onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
      onMouseLeave={() => setAnchorEl(null)}
    >
      <Typography>{translate('Show in diagram')}</Typography>
      {isObjectDiagramsFetching && <CircularProgress size={20} />}
      {!isObjectDiagramsFetching && !!objectDiagrams?.length && (
        <ArrowForwardIosRounded sx={{ fontSize: 12 }} />
      )}
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          maxHeight: '300px',
        }}
        placement="right-start"
      >
        <Paper sx={{ overflow: 'hidden', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
          {objectDiagrams?.map((diagram) => (
            <MenuItem key={diagram.key} onClick={() => onClick(diagram)}>
              {diagram.name}
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    </MenuItem>
  );
};
