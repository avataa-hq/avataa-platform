import Map, { Marker } from 'react-map-gl';
import { FeatureCollection } from 'geojson';
import { Button, CircularProgress, Typography } from '@mui/material';
import { Button as MyButton, IPointsEvenlyModel } from '6_shared';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import {
  IBuildingPathItem,
  IMapViewState,
  MapStyleType,
} from '6_shared/models/inventoryMapWidget/types';
import {
  BuildingPathPreviewMapStyled,
  Body,
  Footer,
  FooterActions,
  FooterText,
  FooterPathPointsContainer,
  FooterPathPoint,
} from './BuildingPathPreviewMap.styled';

import config from '../../../../../config';
import { getMapStyle } from '../../lib/getMapStyle';
import { MapBoxLineLayer } from '../mainMap/layers/mapBoxLineLayer/MapBoxLineLayer';

interface ISelectedPath {
  index: number;
  data: IBuildingPathItem;
}

interface IProps {
  themeMode?: 'dark' | 'light';
  mapStyle?: MapStyleType;
  mapViewState: IMapViewState;

  buildingPaths?: IPointsEvenlyModel[];

  onSaveClick?: (data: IBuildingPathItem) => void;
  onCancelClick?: () => void;

  isLoading?: boolean;
  errorMessage?: string | null;
}

export const BuildingPathPreviewMap = ({
  mapViewState,
  mapStyle = 'Default',
  themeMode = 'dark',

  buildingPaths,

  onSaveClick,
  onCancelClick,

  isLoading,
  errorMessage,
}: IProps) => {
  const [activePath, setActivePath] = useState<ISelectedPath | null>(null);
  const [transformedData, setTransformedData] = useState<ISelectedPath[]>([]);

  useEffect(() => {
    if (!buildingPaths || !buildingPaths.length) return;

    const correctData: ISelectedPath[] = buildingPaths.map((buildingPath, index) => {
      const { end_point, start_point, way_of_vertexes, way_of_edges } = buildingPath;

      const allPoints = [end_point, start_point, ...way_of_vertexes];

      const geoLine: FeatureCollection = {
        type: 'FeatureCollection',
        features: way_of_edges.flatMap((line) => {
          const { id, point_a, point_b } = line;
          const pointAData = allPoints.find((p) => p.id === point_a);
          const pointBData = allPoints.find((p) => p.id === point_b);
          if (!pointAData || !pointBData) return [];
          return {
            id,
            type: 'Feature',
            properties: null,
            geometry: {
              type: 'LineString',
              coordinates: [
                [pointAData.longitude, pointAData.latitude],
                [pointBData.longitude, pointBData.latitude],
              ],
            },
          };
        }),
      };
      return { index, data: { points: allPoints, lines: geoLine } };
    });
    setTransformedData(correctData);
  }, [buildingPaths]);

  useEffect(() => {
    if (!activePath && transformedData.length) {
      setActivePath({ index: 0, data: transformedData[0].data });
    }
  }, [activePath, transformedData]);

  const onPrevClick = () => {
    if (activePath && transformedData.length) {
      const currentIndex = activePath.index;
      if (currentIndex === 0) {
        setActivePath({
          index: transformedData.length - 1,
          data: transformedData[transformedData.length - 1].data,
        });
      } else {
        const prevIndex = currentIndex - 1;
        const prevData = transformedData[prevIndex]?.data;
        if (prevData) setActivePath({ index: prevIndex, data: prevData });
      }
    }
  };
  const onNextClick = () => {
    if (activePath && transformedData.length) {
      const currentIndex = activePath.index;
      const lastIndex = transformedData.length - 1;
      if (currentIndex === lastIndex) {
        setActivePath({ index: 0, data: transformedData[0].data });
      } else {
        const nextIndex = currentIndex + 1;
        const nextData = transformedData[nextIndex]?.data;
        if (nextData) setActivePath({ index: nextIndex, data: nextData });
      }
    }
  };

  return (
    <BuildingPathPreviewMapStyled>
      <Body>
        <Map
          mapStyle={getMapStyle(themeMode, mapStyle, '2d')}
          initialViewState={mapViewState}
          mapboxAccessToken={config._mapboxApiAccessToken}
        >
          {activePath?.data?.points?.map(({ id, longitude, latitude }) => (
            <Marker key={id} latitude={latitude} longitude={longitude} />
          ))}
          <MapBoxLineLayer selectedObject={null} dataGeometry={activePath?.data?.lines} />
        </Map>
      </Body>
      <Footer>
        <FooterPathPointsContainer>
          {transformedData.length > 1 &&
            transformedData.map((item, idx) => (
              <FooterPathPoint
                key={idx}
                sx={{ height: idx === activePath?.index ? '16px' : '10px' }}
              />
            ))}
        </FooterPathPointsContainer>
        {!errorMessage && (
          <FooterText>
            <Typography>
              {transformedData.length === 1
                ? 'There is only one path you can build'
                : `There are ${
                    transformedData.length ?? 0
                  } path(s) that can be applied. Please choose one of them: `}
            </Typography>
            {transformedData.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MyButton onClick={onPrevClick}>
                  <ChevronLeftIcon />
                </MyButton>
                <MyButton onClick={onNextClick}>
                  <ChevronRightIcon />
                </MyButton>
              </div>
            )}
          </FooterText>
        )}

        {errorMessage && (
          <FooterText>
            <Typography variant="h3" color="error">
              error: {errorMessage}
            </Typography>
          </FooterText>
        )}

        <FooterActions>
          <Button onClick={onCancelClick}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (activePath) onSaveClick?.(activePath.data);
            }}
          >
            {isLoading ? <CircularProgress size={23} /> : 'Apply'}
          </Button>
        </FooterActions>
      </Footer>
    </BuildingPathPreviewMapStyled>
  );
};
