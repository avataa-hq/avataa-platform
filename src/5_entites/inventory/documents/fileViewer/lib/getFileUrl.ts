export const getFileUrl = async (url: string, token: string): Promise<string> => {
  try {
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const blob = await resp.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching file URL:', error);
    return '';
  }
};
