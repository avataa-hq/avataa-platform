import { IFileData } from '6_shared';

interface IProps {
  fileData: IFileData[] | undefined;
  debounceValue: string;
}

export const filterFileData = ({ fileData, debounceValue }: IProps) => {
  if (!fileData) return [];
  const newFilteredFileData = fileData.filter(
    (data) =>
      data.creationDate.includes(debounceValue.trim().toLowerCase()) ||
      data.attachment[0].name.includes(debounceValue.trim().toLowerCase()) ||
      data.attachment[0].attachmentType.includes(debounceValue.trim().toLowerCase()),
  );

  return newFilteredFileData;
};
