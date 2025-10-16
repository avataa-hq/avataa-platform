import { center, centerOfMass, polygon, points } from '@turf/turf';

interface IProps {
  polygonCoordinates?: GeoJSON.Position[];
  selectedObjectList?: Record<string, any>[];
}

const createLookAt = (
  newPolygonCoordinates: GeoJSON.Position[],
  selectedObjectList: Record<string, any>[],
) => {
  const lineTypeObjects = selectedObjectList?.filter((item) => item.geometry);

  const pointsCoordinates = selectedObjectList
    .filter((obj) => !obj.geometry)
    .map((item) => [item.longitude, item.latitude]);

  const getCenter = () => {
    if (newPolygonCoordinates.length === 0 && pointsCoordinates.length !== 0) {
      const centerOfPoints = center(points(pointsCoordinates));
      const lookAtPointsCoordinates = centerOfPoints.geometry.coordinates;

      return lookAtPointsCoordinates;
    }

    if (newPolygonCoordinates.length !== 0) {
      const centerCoord = centerOfMass(polygon([newPolygonCoordinates]));
      const lookAtCoordinates = centerCoord.geometry.coordinates;
      return lookAtCoordinates;
    }

    if (
      newPolygonCoordinates.length === 0 &&
      pointsCoordinates.length === 0 &&
      lineTypeObjects.length !== 0
    ) {
      const centerCoord = center(
        points(lineTypeObjects.flatMap((item) => item.geometry.path.coordinates)),
      );
      const lookAtCoordinates = centerCoord.geometry.coordinates;
      return lookAtCoordinates;
    }

    return [0, 0];
  };

  return `<LookAt>
      <gx:TimeStamp>
        <when>1994</when>
      </gx:TimeStamp>
      <longitude>${getCenter()[0]}</longitude>
      <latitude>${getCenter()[1]}</latitude>
      <altitude>3000</altitude>
      <range>500</range>
      <tilt>0</tilt>
      <heading>0</heading>
      <altitudeMode>clampToGround</altitudeMode>
    </LookAt>`;
};

const formatObjectPlacemark = (selectedObjectList: Record<string, any>[]) => {
  const pointsCoordinates = selectedObjectList.filter((obj) => !obj.geometry);

  const objectPoints = pointsCoordinates.map(
    (item) => `<Placemark>
      <name>${item.name}</name>
      <description>${item.name}</description>
      <LookAt>
        <longitude>${item.longitude}</longitude>
        <latitude>${item.latitude}</latitude>
        <altitude>6.955482411243212</altitude>
        <heading>0</heading>
        <tilt>0</tilt>
        <gx:fovy>30.00041758</gx:fovy>
        <range>1205.770198411628</range>
        <altitudeMode>absolute</altitudeMode>
      </LookAt>
      <styleUrl>#__managed_style_05EEA8508C2E08CB7A90</styleUrl>
      <Point>
        <coordinates>${item.longitude},${item.latitude},0</coordinates>
      </Point>
    </Placemark>`,
  );

  return objectPoints.join('\n');
};

const formatPolygonPlacemark = (
  polygonCoordinates: GeoJSON.Position[],
  selectedObjectList: Record<string, any>[],
) => {
  const coordinatesString = polygonCoordinates
    .map((coord) => `${coord[0]},${coord[1]},0`)
    .join('\n');

  return `<Placemark id="088BAE0CE62E067E4D6F">
    <name>Polygon</name>
    <description>Description</description>
    ${createLookAt(polygonCoordinates, selectedObjectList)}
    <styleUrl>#__managed_style_0E9FB128B32E067E4D72</styleUrl>
    <Polygon>
      <outerBoundaryIs>
        <LinearRing>
          <coordinates>
            ${coordinatesString}
          </coordinates>
        </LinearRing>
      </outerBoundaryIs>
    </Polygon>
  </Placemark>`;
};

const formatLineStringPlacemark = (lineTypeObjects: Record<string, any>[]) => {
  const lineObjects = lineTypeObjects.map(
    (item) => `<Placemark>
    <name>LineString</name>
    <description>Description</description>
    <styleUrl>#__managed_style_0E9FB128B32E067E4D72</styleUrl>
    <LineString>
      <coordinates>
        ${item.geometry.path.coordinates
          .map((coord: GeoJSON.Position[]) => `${coord[0]},${coord[1]},0`)
          .join('\n')}
      </coordinates>
    </LineString>
  </Placemark>`,
  );

  return lineObjects.join('\n');
};

export const exportToKml = async ({ polygonCoordinates, selectedObjectList }: IProps) => {
  const lineTypeObjects = selectedObjectList?.filter(
    (item) => item.geometry && item.geometry.path.type === 'LineString',
  );

  try {
    const kmlData = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" 
xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
  <name>KML Samples</name>
  <gx:CascadingStyle kml:id="__managed_style_293A4C8AA32E067E4D72">
		<Style>
			<IconStyle>
				<scale>1.2</scale>
				<Icon>
					<href>https://earth.google.com/earth/rpc/cc/icon?color=1976d2&amp;id=2000&amp;scale=4</href>
				</Icon>
				<hotSpot x="64" y="128" xunits="pixels" yunits="insetPixels"/>
			</IconStyle>
			<LabelStyle>
			</LabelStyle>
			<LineStyle>
				<color>ff2dc0fb</color>
				<width>6</width>
			</LineStyle>
			<PolyStyle>
				<color>40ffffff</color>
			</PolyStyle>
			<BalloonStyle>
				<displayMode>hide</displayMode>
			</BalloonStyle>
		</Style>
	</gx:CascadingStyle>
	<gx:CascadingStyle kml:id="__managed_style_1584E6CC942E067E4D72">
		<Style>
			<IconStyle>
				<Icon>
					<href>https://earth.google.com/earth/rpc/cc/icon?color=1976d2&amp;id=2000&amp;scale=4</href>
				</Icon>
				<hotSpot x="64" y="128" xunits="pixels" yunits="insetPixels"/>
			</IconStyle>
			<LabelStyle>
			</LabelStyle>
			<LineStyle>
				<color>ff2dc0fb</color>
				<width>4</width>
			</LineStyle>
			<PolyStyle>
				<color>40ffffff</color>
			</PolyStyle>
			<BalloonStyle>
				<displayMode>hide</displayMode>
			</BalloonStyle>
		</Style>
	</gx:CascadingStyle>
    <StyleMap id="__managed_style_0E9FB128B32E067E4D72">
      <Pair>
        <key>normal</key>
        <styleUrl>#__managed_style_1584E6CC942E067E4D72</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#__managed_style_293A4C8AA32E067E4D72</styleUrl>
      </Pair>
    </StyleMap>
    <Placemark>
      <name>KML Samples</name>
    </Placemark>
    ${formatPolygonPlacemark(polygonCoordinates || [], selectedObjectList || [])}
    ${formatObjectPlacemark(selectedObjectList || [])}
    ${formatLineStringPlacemark(lineTypeObjects || [])}
</Document>
</kml>`.trim();

    // Download KML-file
    const blob = new Blob([kmlData], {
      type: 'application/vnd.google-earth.kml+xml',
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exportedData.kml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(error);
  }
};
