import { ITableColumnsSettingsBody } from '6_shared';
import { GridInitialStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';
import { enqueueSnackbar } from 'notistack';
import { GridExportStateParams } from '@mui/x-data-grid-premium';

interface IProps {
  exportState?: (params?: GridExportStateParams) => GridInitialStatePremium;
  currentTmoId?: number;
  addNewSettings: (params: any) => any;
}

interface ICreateSettingsProps {
  settingsName: string;
  setDefault?: boolean;
  isPublic?: boolean;
}

export const useCreateNewSettings = ({ exportState, currentTmoId, addNewSettings }: IProps) => {
  const goodMessage = () => {
    enqueueSnackbar('The settings set has been successfully created', { variant: 'success' });
  };
  const withoutIdMessage = () => {
    enqueueSnackbar('Missing object type id', { variant: 'error' });
  };
  const badMessage = () => {
    enqueueSnackbar('Something went wrong when creating a preset', { variant: 'error' });
  };

  const createSettings = async ({ settingsName, setDefault, isPublic }: ICreateSettingsProps) => {
    if (!currentTmoId) {
      withoutIdMessage();
      return null;
    }
    const initialGridState = exportState?.();

    const body: ITableColumnsSettingsBody = {
      id: currentTmoId,
      forced_default: setDefault,
      body: {
        name: settingsName,
        default: !!setDefault,
        public: !!isPublic,
        value: { tableInitialState: initialGridState },
        // order: initialGridState?.columns?.orderedFields,
      },
    };
    try {
      const createdSettingId = await addNewSettings(body).unwrap();
      goodMessage();
      return createdSettingId;
    } catch (e) {
      badMessage();
      return null;
    }
  };

  return { createSettings };
};
