import { IFileConDataPattern } from '6_shared/api/dataflowV3/types';

export const useDatePattern = () => {
  const isValidDate = (part1: string, part2: string, part3: string, pattern: string): boolean => {
    let day;
    let month;
    let year;

    switch (pattern) {
      case 'DDMMYYYY':
        day = parseInt(part1, 10);
        month = parseInt(part2, 10);
        year = parseInt(part3, 10);
        break;
      case 'MMDDYYYY':
        day = parseInt(part2, 10);
        month = parseInt(part1, 10);
        year = parseInt(part3, 10);
        break;
      case 'YYYYMMDD':
        day = parseInt(part3, 10);
        month = parseInt(part2, 10);
        year = parseInt(part1, 10);
        break;
      default:
        return false;
    }

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  };

  const replaceDateWithPattern = (fileName: string, pattern: IFileConDataPattern): string => {
    if (!pattern) {
      return fileName;
    }

    const datePattern = fileName.match(/\d{8}/);

    if (!datePattern) {
      return fileName;
    }

    const dateStr = datePattern[0];
    const newFileName = fileName.replace(dateStr, pattern);

    return newFileName;
  };

  const detectDatePattern = (fileName: string): IFileConDataPattern => {
    const datePatterns = [
      { regex: /(\d{2})(\d{2})(\d{4})/, pattern: 'DDMMYYYY' },
      { regex: /(\d{2})(\d{2})(\d{4})/, pattern: 'MMDDYYYY' },
      { regex: /(\d{4})(\d{2})(\d{2})/, pattern: 'YYYYMMDD' },
    ];

    for (const { regex, pattern } of datePatterns) {
      const match = fileName.match(regex);
      if (match) {
        const [_, part1, part2, part3] = match;
        if (isValidDate(part1, part2, part3, pattern)) {
          return pattern as IFileConDataPattern;
        }
      }
    }
    return null as IFileConDataPattern;
  };

  return { detectDatePattern, replaceDateWithPattern };
};
