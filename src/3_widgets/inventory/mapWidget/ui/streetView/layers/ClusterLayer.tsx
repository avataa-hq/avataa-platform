import Supercluster, { AnyProps, ClusterProperties, PointFeature } from 'supercluster';
import { Marker } from '@vis.gl/react-google-maps';
import { ILatitudeLongitude } from '6_shared';
import { useTheme } from '@mui/material';
import '../swmap.css';
import { useGetMuiIcon } from '3_widgets/inventory/mapWidget/lib/useGetMuiIcon';

interface IProps {
  clusters?: (PointFeature<any> | PointFeature<ClusterProperties & AnyProps>)[];
  supercluster?: Supercluster<any, AnyProps>;
  onClusterClick?: (position: ILatitudeLongitude, expansionZoom?: number) => void;
}

export const ClusterLayer = ({ clusters, supercluster, onClusterClick }: IProps) => {
  const getMuiIcon = useGetMuiIcon();
  const { palette } = useTheme();

  return clusters?.map((cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const {
      cluster: isCluster,
      point_count: pointCount,
      name,
      icon,
      color,
      label,
    } = cluster.properties;
    const objectName = label && label !== '' ? label : name;
    const correctObjectName =
      objectName?.length > 10 ? `${objectName?.slice(0, 10)}...` : objectName;

    if (isCluster) {
      return (
        <Marker
          label={{
            text: pointCount.toString(),
            color: palette.primary.contrastText,
            fontSize: '3rem',
          }}
          key={`cluster-${cluster.id}`}
          position={{ lat: latitude, lng: longitude }}
          onClick={() => {
            const expansionZoom = supercluster?.getClusterExpansionZoom(+cluster.id!);
            onClusterClick?.({ latitude, longitude }, expansionZoom);
          }}
          icon={{
            url: getMuiIcon('Circle', palette.primary.main, { height: 80, width: 80 }),
          }}
        />
      );
    }

    return (
      <Marker
        label={{
          text: correctObjectName,
          fontSize: '1.15rem',
          fontFamily: 'inherit',
          className: 'sw-map-marker-custom-label',
        }}
        key={`crime-${cluster.properties.id}`}
        position={{ lat: latitude, lng: longitude }}
        onClick={() => {
          onClusterClick?.({ latitude, longitude });
        }}
        icon={{
          url: getMuiIcon(icon ?? 'Place', color ?? palette.primary.main, {
            height: 50,
            width: 50,
          }),
        }}
      />
    );
  });
};
