import { IFile } from '../type';

export const fileConvert = (file: File): IFile => {
  return {
    id: Date.now(),
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
  };
};
