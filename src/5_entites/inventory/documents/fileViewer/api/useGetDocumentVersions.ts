export const useGetDocumentVersions = () => {
  const getFileVersions = async (fileUrl: string) => {
    const response = await fetch(`${fileUrl}/versions`);
    return response.json();
  };
  return { getFileVersions };
};
