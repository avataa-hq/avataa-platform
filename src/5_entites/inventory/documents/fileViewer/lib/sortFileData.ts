import { IFileData } from '6_shared';

interface IProps {
  newFileData: IFileData[] | undefined;
  type: string;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<string>>;
}

export const sortFileData = ({
  newFileData,
  type = '',
  sortDirection = 'asc',
  setSortDirection,
}: IProps) => {
  let sortedData;
  if (newFileData && type === '') {
    if (sortDirection === 'asc') {
      sortedData = [...newFileData].sort((a, b) => a.name.localeCompare(b.name));
      setSortDirection('desc');
    } else {
      sortedData = [...newFileData].sort((a, b) => b.name.localeCompare(a.name));
      setSortDirection('asc');
    }
  }

  if (newFileData && type === 'date') {
    const compareDates = (a: any, b: any) => {
      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    };

    sortedData = [...newFileData].sort(compareDates);
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  }

  return sortedData;
};
