import { read as readShapeFile } from 'shapefile';

export const convertShpToGeoJson = async (fileLink: string) => {
  try {
    const response = await fetch(fileLink);
    if (!response.ok) {
      throw new Error(`Failed to fetch KMZ: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const geoJson = await readShapeFile(arrayBuffer);
    return geoJson;
  } catch (error) {
    console.error('Error converting SHP to GeoJSON:', error);
    throw error;
  }
};
