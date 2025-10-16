import dayjs from 'dayjs';
import cronParser from 'cron-parser';

export const parseCronExpression = (cronExpression: string | null | undefined) => {
  try {
    if (!cronExpression) return undefined;

    const nextRunDate = cronParser.parseExpression(cronExpression).next().toString();
    return dayjs(nextRunDate).format('DD.MM.YYYY[,] HH:MM:ss');
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
