import dayjs from 'dayjs';

export const transformDefaultValue = (valType?: string) => {
  if (valType === 'bool') {
    return 'True';
  }
  if (valType === 'date') {
    return dayjs().format('YYYY-MM-DD');
  }
  if (valType === 'datetime') {
    return `${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSSSS')}Z`;
  }
  if (valType && ['mo_link', 'prm_link', 'enum'].includes(valType)) {
    return null;
  }

  return '';
};
