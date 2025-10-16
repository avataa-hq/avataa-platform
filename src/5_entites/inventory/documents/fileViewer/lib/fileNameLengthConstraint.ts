import { cutTypeFromFileName } from './cutTypeFromFileName';

export const fileNameLengthConstraint = (name: string, fileId?: string): string => {
  const maxLength = fileId?.trim() ? 36 : 10;
  const nameFile = fileId?.trim() || cutTypeFromFileName(name.trim());
  return nameFile.length > maxLength ? `${nameFile.slice(0, maxLength)}...` : nameFile;
};
