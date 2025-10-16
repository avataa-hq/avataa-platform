interface IProps {
  paramValue: string;
  processMapBaseUrl: string;
}

export const generateOpenMapLink = ({ paramValue, processMapBaseUrl }: IProps) => {
  const BASE_URL = processMapBaseUrl;
  let obj_type = '';
  let obj_name = '';

  if (paramValue.toLowerCase().includes('cell')) {
    obj_type = 'cell';
    obj_name = paramValue;
  }

  if (paramValue.toLowerCase().includes('bts')) {
    obj_type = 'bts';
    obj_name = paramValue;
  }

  const link = `${BASE_URL}/gis/url_shortener/?gis_type=topology&obj_type=${obj_type}&obj_name=${obj_name}`;

  if (obj_type !== '' && obj_name !== '') {
    return link;
    // return window.open(link, '_blank');
  }

  return null;
};
