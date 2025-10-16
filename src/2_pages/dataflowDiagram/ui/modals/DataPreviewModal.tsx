import {
  Modal,
  Table,
  sourcesManagementApi,
  useDataflowDiagram,
  useDataflowDiagramPage,
} from '6_shared';

const { useGetSourceDataQuery } = sourcesManagementApi;

export const DataPreviewModal = () => {
  const { isDataPreviewModalOpen, setIsDataPreviewModalOpen } = useDataflowDiagramPage();
  const { selectedNode } = useDataflowDiagram();

  const { data, isFetching } = useGetSourceDataQuery(selectedNode?.id!, {
    skip: !isDataPreviewModalOpen || !selectedNode?.id,
  });

  return (
    <Modal
      open={isDataPreviewModalOpen}
      onClose={() => setIsDataPreviewModalOpen(false)}
      ModalContentSx={{ overflow: 'hidden' }}
    >
      <Table tableData={data} isLoading={isFetching} />
    </Modal>
  );
};
