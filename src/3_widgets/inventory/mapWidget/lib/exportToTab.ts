interface IProps {
  polygonCoordinates?: GeoJSON.Position[];
  selectedObjectList?: Record<string, any>[];
}

const formatPolygonData = (polygonCoordinates: GeoJSON.Position[]): string => {
  return `PolygonCoordinates\n${polygonCoordinates
    .map((coord) => coord.join('\t'))
    .join('\n')}\n\n`;
};

const formatObjectData = (selectedObjectList: Record<string, any>[]): string => {
  const objectTabString = selectedObjectList
    .filter((item) => !item.geometry)
    .map((item) => `${item.name}\t${item.longitude}\t${item.latitude}`)
    .join('\n');

  return `ObjectData\nName\tLongitude\tLatitude\n${objectTabString}\n\n`;
};

const formatLineObjectsData = (lineObjects: Record<string, any>[]) => {
  const lineObjectsTabString = lineObjects
    .map((item) => {
      const coordinates = item.geometry.path.coordinates
        .map((coord: GeoJSON.Position, index: number) => {
          if (index === 0) {
            return coord.join('\t');
          }
          return `\t${coord.join('\t')}`;
        })
        .join('\n');
      return `${item.name}\t${coordinates}`;
    })
    .join('\n\n');

  return `LineObjectsData\nName\tLongitude\tLatitude\n${lineObjectsTabString}`;
};

export const exportToTab = async ({ polygonCoordinates, selectedObjectList }: IProps) => {
  const pointObjects = selectedObjectList?.filter((item) => !item.geometry);
  const lineObjects = selectedObjectList?.filter((item) => item.geometry);
  try {
    let tabData = '';

    if (polygonCoordinates && polygonCoordinates.length !== 0) {
      tabData += formatPolygonData(polygonCoordinates);
    }

    if (pointObjects && pointObjects.length !== 0) {
      tabData += formatObjectData(pointObjects);
    }

    if (lineObjects && lineObjects.length !== 0) {
      tabData += formatLineObjectsData(lineObjects);
    }
    // Download TAB-file
    const blob = new Blob([tabData], {
      type: 'text/tab-separated-values',
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exportedData.tab';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(error);
  }
};
