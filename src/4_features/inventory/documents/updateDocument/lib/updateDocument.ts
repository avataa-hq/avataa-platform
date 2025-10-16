import { file2Base64, fileSizeInMegabyte, UpdateFileBody } from '6_shared';

interface IProps {
  documentId: number | string;
  file: File;
  fileId: string;
  updateDocumentFn: (body: UpdateFileBody) => Promise<void>;
}

export const updateDocument = async ({ documentId, file, fileId, updateDocumentFn }: IProps) => {
  const fileSize = fileSizeInMegabyte(file.size);
  const fileBase64 = await file2Base64(file);
  const body: UpdateFileBody = {
    id: documentId,
    body: {
      attachment: [
        {
          content: fileBase64,
          id: fileId,
          attachmentType: file.name.split('.').pop() || 'unknown',
          mimeType: file.type,
          name: file.name,
          size: { amount: +fileSize, units: 'MB' },
        },
      ],
    },
  };
  await updateDocumentFn(body);
};
