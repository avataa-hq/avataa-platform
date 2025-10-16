import { mapStyles } from '6_shared/models/inventoryMapWidget/constants';
import { MapStyleType } from '6_shared/models/inventoryMapWidget/types';

export const getMapStyle = (
  theme: 'dark' | 'light',
  selectedStyle: MapStyleType,
  mapType: '2d' | '3d' = '2d',
) => {
  const style = mapStyles[mapType].find((s) => s.label === selectedStyle);
  if (!style) {
    if (mapStyles[mapType][0].style.dark) return mapStyles[mapType][0].style[theme];
    return mapStyles[mapType][0].style.light;
  }
  if (style.style.dark) return style.style[theme];
  return style.style.light;
};
