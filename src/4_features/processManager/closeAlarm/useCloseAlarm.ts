import { severityApi } from '6_shared';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

const { useCloseAlarmMutation } = severityApi;

interface IProps {
  afterSuccessFn?: () => void;
}
export const useCloseAlarm = ({ afterSuccessFn }: IProps) => {
  const [
    closeProcessAlarm,
    { isSuccess: isSuccessCloseAlarm, isLoading, isError: isErrorCloseAlarm },
  ] = useCloseAlarmMutation();

  useEffect(() => {
    if (isSuccessCloseAlarm) {
      enqueueSnackbar('Alarm was successfully closed', { variant: 'success' });
      afterSuccessFn?.();
    }
    if (isErrorCloseAlarm) {
      enqueueSnackbar('An error occurred when closing the alarm', { variant: 'error' });
    }
  }, [isSuccessCloseAlarm, isErrorCloseAlarm]);

  const closeAlarm = async (ids: number[]) => {
    await closeProcessAlarm(ids).unwrap();
  };

  return { closeAlarm };
};
