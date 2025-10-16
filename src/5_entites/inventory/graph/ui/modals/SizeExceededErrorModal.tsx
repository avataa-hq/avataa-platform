import { Box, Button, Typography } from '@mui/material';

import { AnalysisNode, Modal, useTranslate } from '6_shared';

import { GraphSearch } from '../search/GraphSearch';

interface SizeExceededErrorModalProps {
  onSearch: (nodeHierarchy: AnalysisNode[]) => void;
  isOpen: boolean;
  diagramKey: string;
  size: number;
  onClose: () => void;
  onShowAll: () => Promise<void> | void;
}

export const SizeExceededErrorModal = ({
  onSearch,
  isOpen,
  diagramKey,
  size,
  onClose,
  onShowAll,
}: SizeExceededErrorModalProps) => {
  const translate = useTranslate();

  const handleShowAnyway = async () => {
    await onShowAll();
    onClose();
  };

  const handleSearch = (nodeHierarchy: AnalysisNode[]) => {
    onSearch(nodeHierarchy);
    onClose();
  };

  return (
    <Modal
      title={translate('Size exceeded error')}
      onClose={handleShowAnyway}
      open={isOpen}
      minWidth="600px"
    >
      <Box component="div" display="flex" flexDirection="column" gap="10px">
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="20px"
        >
          <Typography>{`${translate(
            'There are too many nodes in the diagram',
          )}: ${size}`}</Typography>
          <Button variant="contained" onClick={handleShowAnyway} sx={{ minWidth: '150px' }}>
            {translate('Show anyway')}
          </Button>
        </Box>
        <GraphSearch
          graphKey={diagramKey}
          onChange={handleSearch}
          label={translate('Search for a specific node')}
        />
      </Box>
    </Modal>
  );
};
