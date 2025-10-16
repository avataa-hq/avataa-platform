import { MapOutlined, TableChartOutlined } from '@mui/icons-material';
import { Button } from '6_shared';

interface IProps {
  mapView: 'map' | 'tree';
  setMapView: React.Dispatch<React.SetStateAction<'map' | 'tree'>>;
}

export const MapView = ({ mapView, setMapView }: IProps) => {
  const toggleMapView = () => setMapView((prevView) => (prevView === 'map' ? 'tree' : 'map'));

  return (
    <Button onClick={toggleMapView}>
      {mapView === 'tree' ? <MapOutlined /> : <TableChartOutlined />}
    </Button>
  );
};
