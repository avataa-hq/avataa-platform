import { DataTransferFileExtension } from '6_shared/models';
import { downloadFile } from '../../lib';

export const transformExport = async (
  response: Response,
  downloadFileName: string,
  fileType: DataTransferFileExtension,
) => {
  const blob = await response.blob();
  const date = new Date().toISOString();
  const contentDisposition = response.headers.get('Content-Disposition');

  // const fileName = `pm_report_${date}.${fileType}`;
  let fileName = `${downloadFileName}_${date}.${fileType}`;

  if (contentDisposition) {
    [, fileName] = contentDisposition.split('filename=');
    fileName = fileName?.replaceAll('"', '').trim();
  }

  downloadFile({ blob, fileName });
};
