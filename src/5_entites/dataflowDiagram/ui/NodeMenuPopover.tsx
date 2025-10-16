import { DeleteRounded, Visibility } from '@mui/icons-material';
import { Box, Button, Popover, PopoverProps, Typography } from '@mui/material';
import { DataflowDiagramNode, useDataflowDiagram, useThemeSlice, useTranslate } from '6_shared';

interface NodeMenuPopoverProps {
  open: boolean;
  anchorEl: PopoverProps['anchorEl'];
  onClose: () => void;
  onNodePreview?: (node: DataflowDiagramNode) => void;
  onNodeEdit?: (node: DataflowDiagramNode) => void;
  onNodeDelete?: (node: DataflowDiagramNode) => void;
}

export const NodeMenuPopover = ({
  open,
  anchorEl,
  onClose,
  onNodePreview,
  onNodeEdit,
  onNodeDelete,
}: NodeMenuPopoverProps) => {
  const translate = useTranslate();

  const { mode } = useThemeSlice();
  const { selectedNode } = useDataflowDiagram();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => onClose()}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box component="div" display="flex" overflow="hidden">
        {selectedNode?.status !== 'draft' && (
          <Button
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={() => {
              if (!selectedNode) return;

              onNodePreview?.(selectedNode);
              onClose();
            }}
          >
            <Visibility />
            <Typography sx={{ color: mode === 'dark' ? 'white' : undefined }}>
              {translate('Preview')}
            </Typography>
          </Button>
        )}
        {/* <Button
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onClick={() => {
            onNodeEdit?.();
            onClose();
          }}
        >
          <EditRounded />
          <Typography sx={{ color: mode === 'dark' ? 'white' : undefined }}>Edit</Typography>
        </Button> */}
        <Button
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onClick={() => {
            if (!selectedNode) return;

            onNodeDelete?.(selectedNode);
            onClose();
          }}
        >
          <DeleteRounded />
          <Typography sx={{ color: mode === 'dark' ? 'white' : undefined }}>
            {translate('Delete')}
          </Typography>
        </Button>
      </Box>
    </Popover>
  );
};
