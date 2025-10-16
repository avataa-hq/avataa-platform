import dayjs from 'dayjs';
import { useConfig } from '6_shared/models';

export const useTimezoneAdjustment = () => {
  const {
    config: { _disable_timezone_adjustment: disableTimezoneAdjustment },
  } = useConfig();

  const getAdjustedDateTime = (date: dayjs.Dayjs) => {
    return disableTimezoneAdjustment
      ? date.utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]')
      : `${date.format('YYYY-MM-DDTHH:mm:ss.SSSSSS')}Z`;
  };

  return { disableTimezoneAdjustment: disableTimezoneAdjustment === 'true', getAdjustedDateTime };
};
