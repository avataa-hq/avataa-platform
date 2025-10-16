import { getErrorMessage } from '6_shared';
import { enqueueSnackbar } from 'notistack';

interface IProps {
  openDashboardLinkParams: string;
  processDashboardBaseUrl: string;
}

export const generateOpenDashboardLink = ({
  openDashboardLinkParams,
  processDashboardBaseUrl,
}: IProps) => {
  const BASE_URL = processDashboardBaseUrl;

  try {
    const keyValuePairs = openDashboardLinkParams.split(',');

    const params: Record<string, any> = {};

    const allowedFields = [
      'INTERFACE_ID',
      'P_INT',
      'DATE_FROM',
      'DATE_TO',
      'COLUMN_LIST',
      'P_ISKPI',
      'P_MEASURE',
      'P_LEV',
      'P_AGR',
      'P_IN',
      'AGR_TYPE',
    ];

    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split(':');
      if (key && value) {
        const cleanKey = key.trim().replace(/'/g, '').trim();
        const cleanValue = value.trim().replace(/'/g, '').trim();
        if (allowedFields.includes(cleanKey)) {
          params[cleanKey] = cleanValue;
        }
      }
    });

    const jsonData = JSON.stringify(params);

    const encodedData = encodeURIComponent(jsonData);

    const link = `${BASE_URL}/navigator/?portlet=${encodedData}`;

    return link;
    // return window.open(link, '_blank');
  } catch (error) {
    enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  }

  return null;
};
