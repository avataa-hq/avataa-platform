import { describe, it, expect, vi, afterEach } from 'vitest';
import { Graph } from '@antv/g6';
import { exportGraphToImage } from '../exportGraphToImage';

const imageSettings = {
  backgroundColor: '#ddd',
  padding: [50, 70, 50, 50],
};

describe('exportGraphToImage', () => {
  const mockDownloadFullImage = vi.fn();

  const mockGraph = {
    downloadFullImage: mockDownloadFullImage,
  } as unknown as Graph;

  const graphRef = { current: mockGraph };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call downloadFullImage with default name if exportedName is undefined', () => {
    exportGraphToImage({
      graphRef,
      format: 'png',
      exportedName: undefined,
    });

    expect(mockDownloadFullImage).toHaveBeenCalledOnce();
    expect(mockDownloadFullImage).toHaveBeenCalledWith(
      'Graph',
      'image/png',
      expect.objectContaining(imageSettings),
    );
  });

  it('should call downloadFullImage with provided exportedName', () => {
    exportGraphToImage({
      graphRef,
      format: 'jpeg',
      exportedName: 'MyCustomGraph',
    });

    expect(mockDownloadFullImage).toHaveBeenCalledOnce();
    expect(mockDownloadFullImage).toHaveBeenCalledWith(
      'MyCustomGraph',
      'image/jpeg',
      expect.objectContaining(imageSettings),
    );
  });

  it('should use "image/png" as format if "png" is provided', () => {
    exportGraphToImage({
      graphRef,
      format: 'png',
      exportedName: 'GraphImage',
    });

    expect(mockDownloadFullImage).toHaveBeenCalledOnce();
    expect(mockDownloadFullImage).toHaveBeenCalledWith(
      'GraphImage',
      'image/png',
      expect.objectContaining(imageSettings),
    );
  });

  it('should use "image/jpeg" as format if "jpeg" is provided', () => {
    exportGraphToImage({
      graphRef,
      format: 'jpeg',
      exportedName: 'GraphImage',
    });

    expect(mockDownloadFullImage).toHaveBeenCalledOnce();
    expect(mockDownloadFullImage).toHaveBeenCalledWith(
      'GraphImage',
      'image/jpeg',
      expect.objectContaining(imageSettings),
    );
  });

  it('should not call downloadFullImage if graphRef.current is null', () => {
    const emptyGraphRef = { current: null };

    exportGraphToImage({
      graphRef: emptyGraphRef,
      format: 'png',
      exportedName: 'GraphImage',
    });

    expect(mockDownloadFullImage).not.toHaveBeenCalled();
  });
});
