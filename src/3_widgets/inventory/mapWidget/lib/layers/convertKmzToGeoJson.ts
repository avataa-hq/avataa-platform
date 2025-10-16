import { kml as kmlToGeoJSON } from '@tmcw/togeojson';
import JSZip from 'jszip';

export const convertKmzToGeoJson = async (fileLink: string) => {
  try {
    const response = await fetch(fileLink);
    if (!response.ok) {
      throw new Error(`Failed to fetch KMZ: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const zip = await JSZip.loadAsync(arrayBuffer);

    const kmlFile = Object.keys(zip.files).find((fileName) => fileName.endsWith('.kml'));

    if (!kmlFile) throw new Error('KML file not found in KMZ');

    const kmlContent = await zip.files[kmlFile].async('string');
    const kmlDom = new DOMParser().parseFromString(kmlContent, 'text/xml');

    const geoJson = kmlToGeoJSON(kmlDom);

    return geoJson;
  } catch (error) {
    console.error('Error converting KMZ to GeoJSON:', error);
    throw error;
  }
};
