import { useState } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Box, Button, Typography } from '@mui/material';
import { AddRounded, FolderOffRounded } from '@mui/icons-material';
import { useTheme } from '@emotion/react';

import {
  Modal,
  SidebarLayout,
  Table,
  useTranslate,
  sourcesManagementApi,
  SearchInput,
  ActionTypes,
  useDataflowPage,
} from '6_shared';
import { useAppDispatch } from 'hooks/reduxHooks';
import {
  DeleteSourceModal,
  EditApiSourceModal,
  EditDbSourceModal,
  EditFileManualModal,
  EditFileSftpModal,
} from '.';
import { GroupedDataflowSources, GroupedDataflowSourcesProps } from './GroupedDataflowSources';

const { useGetSourceDataQuery } = sourcesManagementApi;

export const ConfigureDataSourceModal = ({
  permissions,
}: {
  permissions?: Record<ActionTypes, boolean>;
}) => {
  const translate = useTranslate();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [searchValue, setSearchValue] = useState<string>();
  const [selectedDataviewSourceId, setSelectedDataviewSourceId] = useState<number>();

  const {
    isConfigureDataSourceModalOpen,
    setAddDataSourceModalOpen,
    setConfigureDataSourceModalOpen,
    setDeleteSourceModalOpen,
    setEditApiSourceModalOpen,
    setEditDbSourceModalOpen,
    setEditFileManualModalOpen,
    setEditFileSftpModalOpen,
    setSelectedSource,
  } = useDataflowPage();

  const modalOpenActions: Record<
    Parameters<GroupedDataflowSourcesProps['onEditSourceClick']>[1],
    (payload: boolean) => void
  > = {
    DB: setEditDbSourceModalOpen,
    RestAPI: setEditApiSourceModalOpen,
    Manual: setEditFileManualModalOpen,
    SFTP: setEditFileSftpModalOpen,
  };

  const { data: sourceData, isFetching: isSourceDataFetching } = useGetSourceDataQuery(
    selectedDataviewSourceId ?? 0,
    { skip: !selectedDataviewSourceId },
  );

  const handleSourceDeleteClick: GroupedDataflowSourcesProps['onDeleteSourceClick'] = (source) => {
    setSelectedSource(source);
    setDeleteSourceModalOpen(true);
  };

  const handleSourceEditClick: GroupedDataflowSourcesProps['onEditSourceClick'] = (
    source,
    sourceType,
  ) => {
    setSelectedSource(source);
    modalOpenActions[sourceType](true);
  };

  const handleSourceClick: GroupedDataflowSourcesProps['onSourceClick'] = (
    source,
    dataviewSourceId,
  ) => {
    setSelectedDataviewSourceId(dataviewSourceId);
  };

  const { Sidebar, SidebarBody, Container, SidebarHeader } = SidebarLayout;

  return (
    <>
      <Modal
        title={translate('Data sources management')}
        open={isConfigureDataSourceModalOpen}
        minWidth="900px"
        height="700px"
        onClose={() => setConfigureDataSourceModalOpen(false)}
        ModalContentSx={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        actions={
          <>
            <Button variant="outlined" onClick={() => setConfigureDataSourceModalOpen(false)}>
              {translate('Cancel')}
            </Button>
            <Button disabled={!(permissions?.update ?? true)} variant="contained">
              {translate('Save')}
            </Button>
          </>
        }
      >
        <SidebarLayout>
          <Sidebar collapsible background="transparent">
            <SidebarHeader>
              <Box component="div" display="flex" gap="5px" alignItems="center">
                <SearchInput onChange={(_, value) => setSearchValue(value)} />
                <Button
                  variant="contained.icon"
                  onClick={() => setAddDataSourceModalOpen(true)}
                  disabled={!(permissions?.update ?? true)}
                  style={{
                    backgroundColor: !(permissions?.update ?? true)
                      ? theme.palette.text.disabled
                      : '',
                  }}
                >
                  <AddRounded />
                </Button>
              </Box>
            </SidebarHeader>
            <SidebarBody>
              <GroupedDataflowSources
                onDeleteSourceClick={handleSourceDeleteClick}
                onEditSourceClick={handleSourceEditClick}
                onSourceClick={handleSourceClick}
                searchValue={searchValue}
                permissions={permissions}
              />
            </SidebarBody>
          </Sidebar>
          <Container padding="20px">
            {(sourceData?.length && selectedDataviewSourceId) || isSourceDataFetching ? (
              <Table isLoading={isSourceDataFetching} tableData={sourceData} exceptions={['id']} />
            ) : (
              <Box
                component="div"
                width="100%"
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <FolderOffRounded fontSize="large" />
                <Typography variant="h6" color="text.secondary">
                  {translate('No data')}
                </Typography>
              </Box>
            )}
          </Container>
        </SidebarLayout>
      </Modal>
      <EditFileManualModal />
      <EditDbSourceModal />
      <EditApiSourceModal />
      <EditFileSftpModal />
      <DeleteSourceModal />
    </>
  );
};
