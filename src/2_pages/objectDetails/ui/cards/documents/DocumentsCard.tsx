import { useCallback, useState } from 'react';
import { Box, CardContent, CardHeader } from '@mui/material';

import { IFileData, SearchInput, useTranslate } from '6_shared';
import { FileViewerWidget } from '3_widgets/inventory/fileViewerWidget';

import { ObjectDetailsCard } from '../ObjectDetailsCard';
import { DocumentsTable } from './DocumentsTable';
import { IconButtonStyled } from '../../commonComponents';

interface DocumentsCardProps {
  objectId: number;
}

export const DocumentsCard = ({ objectId }: DocumentsCardProps) => {
  const translate = useTranslate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>();

  const handleLinkButtonClick = () => {
    setIsModalOpen(true);
  };

  const filterDocuments = useCallback(
    (file: IFileData['attachment'][number]) => {
      if (!searchValue) return true;
      return file.name.toLowerCase().includes(searchValue.toLowerCase());
    },
    [searchValue],
  );

  return (
    <ObjectDetailsCard>
      <CardHeader
        action={
          <Box component="div" display="flex">
            <SearchInput onChange={(_, searchVal) => setSearchValue(searchVal)} expandable />
            <IconButtonStyled onClick={handleLinkButtonClick} />
          </Box>
        }
        title={translate('Documents')}
      />
      <CardContent sx={{ height: '100%', mt: '3px' }}>
        <DocumentsTable
          objectId={objectId}
          filter={searchValue?.trim().length ? filterDocuments : undefined}
        />
      </CardContent>
      <FileViewerWidget
        objectId={objectId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        withModal
      />
    </ObjectDetailsCard>
  );
};
