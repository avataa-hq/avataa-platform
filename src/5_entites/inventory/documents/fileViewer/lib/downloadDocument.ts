export const downloadDocument = async (fileUrl: string, fileName: string) => {
  const res = await fetch(fileUrl);
  if (res.status === 200) {
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
