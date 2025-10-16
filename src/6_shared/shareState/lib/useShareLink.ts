import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import store from 'store';
import { getStateUrl } from './getStateUrl';
import { stateApi } from '../../api';
import { useTranslate } from '../../localization';

export const useShareLink = () => {
  const translate = useTranslate();

  const [postState, { isLoading }] = stateApi.usePostStateMutation();

  const [link, setLink] = useState<string | null>(null);

  const onGenerateLink = async (linkExpires: number) => {
    const state = store.getState();
    const url = await getStateUrl(state, postState, linkExpires);
    if (url) {
      setLink(url);
      enqueueSnackbar(translate('Application state link created successfully'), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(translate('Error creating link'), { variant: 'error' });
    }
  };

  return { onGenerateLink, link, setLink, isLoading };
};
