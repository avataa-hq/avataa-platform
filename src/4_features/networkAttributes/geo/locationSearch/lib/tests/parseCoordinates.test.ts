import { describe, it, expect } from 'vitest';
import { parseCoordinates } from '../parseCoordinates';

describe('parseCoordinates', () => {
  it('should return valid coordinates when input has valid lat and long', () => {
    const input = '40.7128, -74.0060'; // Latitude, Longitude (New York City)
    const result = parseCoordinates(input);

    expect(result).toEqual([-74.006, 40.7128]); // Longitude first
  });

  it('should return valid coordinates when input has valid long and lat in reverse order', () => {
    const input = '-74.0060, 40.7128'; // Longitude, Latitude (reverse order)
    const result = parseCoordinates(input);

    expect(result).toEqual([40.7128, -74.006]); // Longitude first
  });

  it('should return null if latitude is out of range', () => {
    const input = '100.0000, -74.0060'; // Latitude > 90
    const result = parseCoordinates(input);

    expect(result).toEqual([100.0, -74.006]);
  });

  it('should return null if longitude is out of range', () => {
    const input = '40.7128, 200.0000'; // Longitude > 180
    const result = parseCoordinates(input);

    expect(result).toBeNull();
  });

  it('should return null if input contains fewer than two numbers', () => {
    const input = '40.7128'; // Only latitude, no longitude
    const result = parseCoordinates(input);

    expect(result).toBeNull();
  });

  it('should handle inputs with commas as decimal separators', () => {
    const input = '40,7128, -74,0060'; // Comma used as decimal separator
    const result = parseCoordinates(input);

    expect(result).toEqual([-74.006, 40.7128]); // Longitude first
  });

  it('should return valid coordinates when input contains non-numeric characters and valid lat and long', () => {
    const input = 'latitude: 40.7128, longitude: -74.0060'; // Non-numeric characters
    const result = parseCoordinates(input);

    expect(result).toEqual([-74.006, 40.7128]); // Longitude first
  });

  it('should handle excessive whitespace or irregular formatting', () => {
    const input = '  40.7128   ,    -74.0060  '; // Excessive whitespace
    const result = parseCoordinates(input);

    expect(result).toEqual([-74.006, 40.7128]); // Longitude first
  });

  it('should return null if coordinates are swapped and out of valid ranges', () => {
    const input = '200.0000, 100.0000'; // Both coordinates out of valid range
    const result = parseCoordinates(input);

    expect(result).toBeNull();
  });

  it('should return null if input is empty', () => {
    const input = ''; // Empty string
    const result = parseCoordinates(input);

    expect(result).toBeNull();
  });
});
