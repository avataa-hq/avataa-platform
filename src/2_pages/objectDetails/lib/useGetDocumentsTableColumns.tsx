import { IFileData, TableColumn, useTranslate } from '6_shared';
import { DownloadFile, ShareFile } from '5_entites';

export const useGetDocumentsTableColumns = (): TableColumn<IFileData['attachment'][number]>[] => {
  const translate = useTranslate();

  return [
    {
      dataIndex: 'name',
      key: 'name',
      title: translate('File name'),
    },
    {
      dataIndex: 'attachmentType',
      key: 'status',
      title: translate('Type'),
      render: (item) => item.attachmentType,
    },
    {
      key: 'save',
      title: translate('Save'),
      render: (item) => (
        <DownloadFile fileName={item.name} fileSize={item.size} fileUrl={item.url} />
      ),
    },
    {
      key: 'link',
      title: translate('Link'),
      render: (item) => <ShareFile fileLink={item.url} />,
    },
  ];
};
