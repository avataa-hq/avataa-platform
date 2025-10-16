import mapbox from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { IMapBoxObjectCustomEvent } from '6_shared/models/inventoryMapWidget/types';

const createDivWithText = (text: string, markerId: number | string) => {
  const div = document.createElement('div');
  div.innerHTML = text;
  div.style.boxShadow = '-2px -4px 5px 0 rgba(0, 0, 0, 0.5)';
  div.style.fontSize = '16px';
  div.style.color = 'black';
  div.style.fontFamily = 'Montserrat, sans-serif';
  div.style.fontWeight = '700';
  div.style.padding = '5px 10px';
  div.style.background = 'rgba(255,255,255)';
  div.style.borderRadius = '10px';
  div.style.zIndex = '10';
  div.classList.add('my_popup');
  div.setAttribute('id', String(markerId));
  return div;
};

const createDivMarker = (markerId: number | string) => {
  const div = document.createElement('div');
  div.style.boxShadow = '-2px -4px 5px 0 rgba(0, 0, 0, 0.5)';
  div.style.padding = '10px';
  div.style.background = '#0085FF';
  div.style.borderRadius = '50%';
  div.style.zIndex = '10';
  div.classList.add('my_marker');
  div.setAttribute('id', String(markerId));
  return div;
};
const calculateMiddleAndDistance = (startPoint: Point, endPoint: Point) => {
  const start = turf.point(startPoint.coordinates);
  const end = turf.point(endPoint.coordinates);

  const midPoint = turf.midpoint(start, end);
  const distance = turf.distance(start, end, { units: 'meters' });

  return {
    middleCoordinate: midPoint.geometry.coordinates as [number, number],
    distance,
  };
};

const createMarker = ({
  markerId,
  dragFn,
  text,
  position,
  map,
}: {
  map: mapbox.Map;
  position: [number, number];
  markerId: string | number;
  text?: string;
  dragFn?: (e: any) => void;
}) => {
  const element = text ? createDivWithText(text, markerId) : createDivMarker(markerId);
  const marker = new mapbox.Marker({ draggable: !!dragFn, element }).setLngLat(position);
  marker.addTo(map);
  // @ts-ignore
  marker.id = markerId;

  if (dragFn) marker.on('drag', dragFn);
  return marker;
};
interface IConnectedPoint {
  point: Point;
  middleCoordinate: [number, number];
  distance: number;
  id: string;
}
export interface Point {
  coordinates: [number, number];
  connectedPoints?: {
    prev?: IConnectedPoint | null;
  };
  id: number;
}

type MapMarkerType = mapbox.Marker & { id?: string | number };

export type RulerSourceDataType = Feature<Geometry, GeoJsonProperties>;

export class Ruler {
  private readonly map: mapbox.Map | null = null;

  private isActiveRuler: boolean = false;

  private mapMarkers: MapMarkerType[] = [];

  sourceData: RulerSourceDataType[] = [];

  points: Point[] = [];

  private pointUniqueId: number = 0;

  totalDistance = 0;

  constructor(map: mapbox.Map) {
    this.map = map;
  }

  private connectPoints() {
    const pointsList = this.points;
    this.points = pointsList.map((newPoint, pointId) => {
      if (pointId > 0) {
        const prevPoint = pointsList[pointId - 1];
        const { middleCoordinate, distance } = calculateMiddleAndDistance(prevPoint, newPoint);
        const connectedPoint: IConnectedPoint = {
          point: prevPoint,
          middleCoordinate,
          distance,
          id: `prev_${newPoint.id}`,
        };

        newPoint.connectedPoints = { prev: connectedPoint };
      }

      return newPoint;
    });
    this.calculateDistance();
  }

  public onRulerClick(e: IMapBoxObjectCustomEvent) {
    if (!this.isActiveRuler || e.detail !== 1) return;
    if (
      this.points[this.points.length - 1]?.coordinates[0] === e.position.longitude &&
      this.points[this.points.length - 1]?.coordinates[1] === e.position.latitude
    )
      return;

    const coordinates = [e.position.longitude, e.position.latitude] as [number, number];
    const pointId = this.pointUniqueId;
    this.pointUniqueId++;

    const newPoint: Point = { coordinates, id: pointId };
    this.points.push(newPoint);
    this.connectPoints();

    this.renderPointMarkers();
    this.renderDistanceMarkers();

    this.renderLineBetweenPoint();
  }

  public onRulerDoubleClick(e?: mapbox.MapMouseEvent) {
    this.isActiveRuler = false;
    this.clearSourceLine();
  }

  public onRuleMouseMove(e: mapbox.MapMouseEvent) {
    if (!this.isActiveRuler || !this.points.length) return;
    const currentLine = turf.lineString([
      ...this.points.map((p) => p.coordinates),
      [e.lngLat.lng, e.lngLat.lat],
    ]);
    const feature: RulerSourceDataType[] = [currentLine];
    this.createSourceLine(feature);
  }

  public setActive(isActive: boolean) {
    this.isActiveRuler = isActive;
  }

  public clearAll() {
    this.mapMarkers.forEach((m) => m.remove());
    this.mapMarkers = [];
    this.points = [];
    this.pointUniqueId = 0;

    this.createSourceLine();

    this.clearMapMarkers();
    this.totalDistance = 0;
  }

  private clearMapMarkers() {
    // @ts-ignore
    const mapMarkers = this.map._markers as MapMarkerType[] | undefined;
    if (mapMarkers?.length && mapMarkers.some((m) => m.id)) {
      mapMarkers?.forEach((m) => m.id !== undefined && m.remove());
      this.clearMapMarkers();
    }
  }

  private markerDrag(dragEvent: any) {
    const position = dragEvent.target.getLngLat().toArray();
    const markerId = dragEvent.target.getElement().getAttribute('id');
    this.points = this.points.map((point) => {
      if (String(point.id) === markerId) {
        return { ...point, coordinates: position };
      }
      return point;
    });
    this.renderLineBetweenPoint();
    this.connectPoints();
    this.renderDistanceMarkers();
  }

  private createSourceLine(features: RulerSourceDataType[] = []) {
    this.sourceData = features;

    // REMOVE THIS CODE IF YOU ARE SURE THAT EVERYTHING WILL WORK WITHOUT IT.

    // if (!this.map) return;
    // const source = this.map.getSource(RULE_SOURCE_ID) as mapbox.GeoJSONSource | undefined;
    // if (source) source.setData({ type: 'FeatureCollection', features });
    // else {
    //   this.map.addSource(RULE_SOURCE_ID, {
    //     type: 'geojson',
    //     data: { type: 'FeatureCollection', features },
    //   });
    //   this.map.addLayer({
    //     id: LINE_LAYER_ID,
    //     type: 'line',
    //     source: RULE_SOURCE_ID,
    //     paint: { 'line-color': '#ff0000', 'line-width': 2, 'line-dasharray': [2, 2, 2] },
    //   });
    // }
  }

  public clearSourceLine() {
    this.createSourceLine();
    this.connectPoints();
    this.renderLineBetweenPoint();
  }

  calculateDistance() {
    const distance = this.points.reduce((acc, point) => {
      if (point.connectedPoints?.prev) {
        // eslint-disable-next-line no-param-reassign
        acc += point.connectedPoints.prev.distance;
      }
      return acc;
    }, 0);
    this.totalDistance = distance;
  }

  private renderLineBetweenPoint() {
    if (!this.map) return;
    const features =
      this.points.length < 2 ? [] : [turf.lineString(this.points.map((p) => p.coordinates))];
    this.createSourceLine(features);
  }

  // ===============
  private renderDistanceMarkers() {
    if (!this.map) return;
    const currentMap = this.map;
    // @ts-ignore
    const mapMarkers = this.map._markers as MapMarkerType[] | undefined;

    this.mapMarkers = this.points.reduce((acc, point) => {
      if (point.connectedPoints?.prev) {
        const { middleCoordinate, distance, id } = point.connectedPoints.prev;
        const mapMarker = mapMarkers?.find((m) => m.id === id);
        if (mapMarker) mapMarker.remove();
        const connectedMarker = this.mapMarkers.find((m) => m.id === id);
        if (connectedMarker) {
          // @ts-ignore
          connectedMarker._element.innerHTML = `${distance.toFixed()} m`;
          connectedMarker.setLngLat(middleCoordinate);
          acc.push(connectedMarker);
        } else {
          const newMarker = createMarker({
            map: currentMap,
            markerId: id,
            position: middleCoordinate,
            text: `${distance.toFixed()} m`,
          });
          acc.push(newMarker);
        }
      }

      return acc;
    }, [] as MapMarkerType[]);
    this.mapMarkers.forEach((m) => m.addTo(currentMap));
  }

  // ===============

  private renderPointMarkers() {
    if (!this.map) return;
    const currentMap = this.map;
    // @ts-ignore
    const mapMarkers = this.map._markers as MapMarkerType[] | undefined;

    this.mapMarkers = this.points.reduce((acc, point) => {
      const marker = this.mapMarkers.find((m) => m.id === point.id);
      const mapMarker = mapMarkers?.find((m) => m.id === point.id);
      if (mapMarker) mapMarker.remove();
      if (marker) {
        marker.setLngLat(point.coordinates);
        acc.push(marker);
      } else {
        const newMarker = createMarker({
          map: currentMap,
          markerId: point.id,
          position: point.coordinates,
          dragFn: (e) => this.markerDrag.call(this, e),
        });
        acc.push(newMarker);
      }

      return acc;
    }, [] as MapMarkerType[]);

    this.mapMarkers.forEach((m) => m.addTo(currentMap));
  }
}
