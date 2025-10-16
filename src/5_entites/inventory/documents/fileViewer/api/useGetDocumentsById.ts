import { inventoryDocumentsApi } from '6_shared';

interface IProps {
  objectId: number | string;
  skip?: boolean;
}
export const useGetDocumentsById = ({ objectId, skip }: IProps) => {
  return inventoryDocumentsApi.useGetDocumentFilesQuery(objectId, { skip });
};
