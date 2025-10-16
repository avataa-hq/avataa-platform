import { APIProvider } from '@vis.gl/react-google-maps';
import config from 'config';
import { IMapComponentProps, MapComponent } from './MapComponent';

interface IProps extends IMapComponentProps {}
export const StreetView = (props: IProps) => {
  return (
    <APIProvider apiKey={config._mapApiKey}>
      <MapComponent {...props} />
    </APIProvider>
  );
};
