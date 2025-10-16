export const file2Base64 = (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(reader.result?.toString().replace('data:', '').replace(/^.+,/, '') || '');
    reader.onerror = (error) => reject(new Error('Failed to read file', { cause: error }));
  });
