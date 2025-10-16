import { ITableColumnSettingsValueModel, ITableColumnsSettingsBody } from '6_shared';
import { enqueueSnackbar } from 'notistack';
import { GridInitialStatePremium } from '@mui/x-data-grid-premium/models/gridStatePremium';
import { GridExportStateParams } from '@mui/x-data-grid-premium';

interface IProps {
  exportState?: (params?: GridExportStateParams) => GridInitialStatePremium;
  updateSettings: (params: any) => any;
}

interface IUpdateProps {
  settingId: number;
  name: string;
  isDefault?: boolean;
  isPublic?: boolean;
  value?: ITableColumnSettingsValueModel | null;
}

export const useUpdateSettings = ({ exportState, updateSettings }: IProps) => {
  const goodUpdateMessage = () => {
    enqueueSnackbar('The settings set has been successfully updated', { variant: 'success' });
  };
  const badUpdateMessage = () => {
    enqueueSnackbar('Something went wrong when updating a preset', { variant: 'error' });
  };
  const withoutState = () => {
    enqueueSnackbar('Missing table state', { variant: 'error' });
  };

  const updateSetting = async ({ settingId, isDefault, isPublic, name, value }: IUpdateProps) => {
    if (!exportState) {
      withoutState();
      return;
    }

    const initialGridState = exportState?.();

    const body: ITableColumnsSettingsBody = {
      id: settingId,
      forced_default: isDefault,
      body: {
        name,
        public: isPublic || false,
        default: isDefault || false,
        value: value || { tableInitialState: initialGridState },
        // order:
        //   value?.tableInitialState?.columns?.orderedFields ||
        //   initialGridState?.columns?.orderedFields,
      },
    };
    try {
      await updateSettings(body);
      goodUpdateMessage();
    } catch (e) {
      badUpdateMessage();
    }
  };

  return { updateSetting };
};
