import { Box, Button, Typography } from '@mui/material';
import { AddRounded, RemoveRounded } from '@mui/icons-material';

import { useEffect, useMemo, useState } from 'react';

import { clamp } from '6_shared';
import { ZoomButtons, ZoomSlider } from './Graph.styled';
import { Graph3000 } from '../builder';

interface ZoomControlsProps {
  withSlider?: boolean;
  graph?: Graph3000 | null;
  currentZoom?: number;
}

export const ZoomControls = ({ withSlider, graph, currentZoom }: ZoomControlsProps) => {
  const [zoom, setZoom] = useState<number>(currentZoom ?? 0);

  const zoomSettings = useMemo(() => {
    if (!graph || graph.destroyed) return { minZoom: 1, maxZoom: 15, initialZoom: 1 };

    return {
      minZoom: graph.getMinZoom(),
      maxZoom: graph.getMaxZoom(),
      initialZoom: graph.getZoom(),
    };
  }, [graph]);

  const zoomFactor = useMemo(() => {
    const iterations = 100;
    return Math.E ** (Math.log(zoomSettings.maxZoom / zoomSettings.minZoom) / iterations);
  }, [zoomSettings.maxZoom, zoomSettings.minZoom]);

  useEffect(() => {
    const initZoom =
      Math.log((zoomSettings.initialZoom * zoomFactor) / zoomSettings.minZoom) /
      Math.log(zoomFactor);

    setZoom(Math.round(initZoom));
  }, [zoomSettings.initialZoom, zoomSettings.minZoom, zoomFactor]);

  useEffect(() => {
    if (!graph) return () => {};

    graph.on('wheelzoom', () => {
      const zoomValue = graph.getZoom();
      setZoom(
        Math.floor(
          Math.log((zoomValue * zoomFactor) / zoomSettings.minZoom) / Math.log(zoomFactor),
        ) - 1,
      );
    });

    return () => {
      graph.off('wheelzoom');
    };
  }, [graph, zoomSettings.minZoom, zoomFactor]);

  const handleZoomChange = (value: number) => {
    setZoom(value);
    if (!graph) return;

    graph.zoomTo(
      zoomSettings.minZoom * zoomFactor ** (value - 1),
      { x: graph.getWidth() / 2, y: graph.getHeight() / 2 },
      true,
      {
        duration: 100,
        easing: 'easeCubicIn',
      },
    );
  };

  return (
    <Box
      component="div"
      display="flex"
      alignItems="center"
      minWidth="fit-content"
      position="absolute"
      right="20px"
      sx={{ transition: '0.2s' }}
    >
      {withSlider && (
        <ZoomSlider
          orientation="vertical"
          min={0}
          max={100}
          marks={[
            { value: 0, label: '0' },
            { value: 100, label: '100' },
          ]}
          onChange={(e, value) => handleZoomChange(value as number)}
          value={zoom}
        />
      )}
      <ZoomButtons orientation="vertical">
        <Button onClick={() => handleZoomChange(clamp(zoom + 10, 0, 100))}>
          <AddRounded />
        </Button>
        <Typography padding="5px 0" fontSize={10} fontWeight={600} textAlign="center">
          {zoom}%
        </Typography>
        <Button onClick={() => handleZoomChange(clamp(zoom - 10, 0, 100))}>
          <RemoveRounded />
        </Button>
      </ZoomButtons>
    </Box>
  );
};
