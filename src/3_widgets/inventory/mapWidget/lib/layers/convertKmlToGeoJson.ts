import { kml as kmlToGeoJSON } from '@tmcw/togeojson';

export const convertKmlToGeoJson = (kmlContent: string) => {
  try {
    const kml = new DOMParser().parseFromString(kmlContent, 'application/xml');

    const geoJSON = kmlToGeoJSON(kml);

    return geoJSON;
  } catch (error) {
    console.error('Error processing KML:', error);
    throw error;
  }
};
