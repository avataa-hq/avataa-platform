import * as Icons from '@mui/icons-material';
import { renderToString } from 'react-dom/server';
import { useCallback } from 'react';

export const useGetMuiIcon = () => {
  return useCallback(
    (muiIcon: keyof typeof Icons, fillColor?: string, size?: { height: number; width: number }) => {
      const Icon = Icons[muiIcon];
      const renderIcon = renderToString(
        <Icon
          fill={fillColor}
          height={size ? size.height : 240}
          width={size ? size.width : 240}
          xmlns="http://www.w3.org/2000/svg"
        />,
      );
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderIcon)}`;
    },
    [],
  );
};
