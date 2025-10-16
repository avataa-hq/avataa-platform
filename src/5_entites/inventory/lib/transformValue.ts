import dayjs from 'dayjs';

interface IProps {
  value: any;
  valType?: string;
  disableTimezoneAdjustment?: boolean;
  crop?: boolean;
  cropLength?: number;
}

export const transformValue = ({
  value,
  valType,
  disableTimezoneAdjustment,
  crop,
  cropLength = 50,
}: IProps) => {
  if (valType === 'user_link' && value === 'Unassigned') {
    return '';
  }

  if (valType === 'date' && Array.isArray(value))
    return value.map((item) => dayjs(item).format('DD-MM-YYYY')).join(', ');

  if (valType === 'date') return dayjs(value).format('DD-MM-YYYY');

  if (
    Array.isArray(value) &&
    (valType === 'datetime' ||
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/.test(value[0] as string))
  ) {
    return value
      .map((item: string) => {
        const dateString = disableTimezoneAdjustment ? item.replace('Z', '') : item;
        return dayjs(dateString).format('DD-MM-YYYY HH:mm:ss');
      })
      .join(', ');
  }

  if (
    valType === 'datetime' ||
    (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/.test(value) && dayjs(value).isValid())
  ) {
    const dateString = disableTimezoneAdjustment ? String(value).replace('Z', '') : String(value);
    return dayjs(dateString).format('DD-MM-YYYY HH:mm:ss');
  }

  if (typeof value === 'boolean') return value ? 'True' : 'False';

  if (typeof value === 'number') return value.toString();

  if (value === null) return 'null';

  if (value === undefined) return 'undefined';

  if (typeof value === 'string' && value.trim() === '') return '_blank';

  if (valType && ['str', 'int', 'float'].includes(valType) && Array.isArray(value) && crop) {
    return value.join(', ').length > cropLength
      ? `${value.join(', ').slice(0, cropLength)}...`
      : value.join(', ');
  }

  if (Array.isArray(value)) return value.join(', ');

  if (valType && ['str', 'int', 'float'].includes(valType) && crop) {
    return value.length > cropLength ? `${value.slice(0, cropLength)}...` : value;
  }

  if (typeof value === 'string' && value.trim() === '[object Object]') return '';

  if (typeof value === 'string') return value.trim().split('_').join(' ');

  return value;
};
