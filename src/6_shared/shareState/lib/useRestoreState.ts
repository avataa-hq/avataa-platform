import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useAppDispatch } from 'hooks/reduxHooks';
import { stateApi } from '../../api';
import { restoreStates } from './restoreStates';
import { useTranslate } from '../../localization';

export const useRestoreState = () => {
  const dispatch = useAppDispatch();
  const translate = useTranslate();
  const [getState, { isError, isSuccess }] = stateApi.useLazyGetStateQuery();

  useEffect(() => {
    if (isError)
      enqueueSnackbar(translate('Error restoring application state'), { variant: 'error' });
    if (isSuccess)
      enqueueSnackbar(translate('State successfully restored'), { variant: 'success' });
  }, [isError, isSuccess, translate]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const { origin, searchParams } = url;
    const stateId = searchParams.get('stateId');

    if (stateId) {
      getState(stateId)
        .unwrap()
        .then((data) => data && restoreStates(data, dispatch))
        .finally(() => {
          window.history.replaceState({}, '', `${origin}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
