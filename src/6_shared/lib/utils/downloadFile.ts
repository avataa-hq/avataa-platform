interface IDownloadFile {
  blob: Blob;
  fileName: string;
}

export const downloadFile = ({ blob, fileName }: IDownloadFile) => {
  const url = window.URL || window.webkitURL;
  const downloadUrl = url.createObjectURL(blob);
  const hiddenElement = document.createElement('a');
  hiddenElement.href = downloadUrl;
  hiddenElement.download = fileName;
  document.body.append(hiddenElement);
  hiddenElement.click();
  hiddenElement.remove();
  URL.revokeObjectURL(downloadUrl);
};
