import { useEffect, useState } from 'react';
import { LicenseInfo } from '@mui/x-license';
import {
  accountDataApi,
  securityMiddlewareApi,
  useAccountData,
  useConfig,
  useUser,
} from '6_shared';
import { updateConfigFromVault } from '../../config/updateConfigFromVault';
import config, { ConfigType } from '../../config';

const { useGetUserInfoQuery } = securityMiddlewareApi;
const { useGetAccountDataQuery } = accountDataApi;

export const useSetConfig = () => {
  const { tokenParsed } = useUser();

  const { setAccountData } = useAccountData();

  const { setConfig, setUserInfo } = useConfig();

  const [loadedConfig, setLoadedConfig] = useState<Partial<ConfigType>>();
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  useEffect(() => {
    if (!loadedConfig) return;
    setConfig(loadedConfig);

    if (loadedConfig._table_Data_Grid_License_Key) {
      LicenseInfo.setLicenseKey(loadedConfig._table_Data_Grid_License_Key);
    }
  }, [loadedConfig]);

  // useEffect fires only once, on first load
  useEffect(() => {
    if (!config._vaultURL || !config._vaultSecret) {
      setLoadedConfig(config);
      setIsConfigLoading(false);
      return;
    }
    (async () => {
      try {
        const updatedConfig = await updateConfigFromVault();
        setLoadedConfig(updatedConfig);
      } catch (error) {
        console.error('Error updating config:', error);
      } finally {
        setIsConfigLoading(false);
      }
    })();
  }, []);

  const { data: userInfo } = useGetUserInfoQuery(
    { realm: loadedConfig?._keycloakRealm! },
    { skip: !loadedConfig?._keycloakRealm || !loadedConfig._securityMiddlewareApi },
  );

  useEffect(() => {
    if (userInfo) setUserInfo(userInfo);
    else if (tokenParsed) setUserInfo(tokenParsed);
  }, [userInfo, tokenParsed]);

  const { data: kcAccountData } = useGetAccountDataQuery();

  useEffect(() => {
    if (kcAccountData) {
      setAccountData(kcAccountData);
    }
  }, [kcAccountData]);

  return { isConfigLoading };
};
