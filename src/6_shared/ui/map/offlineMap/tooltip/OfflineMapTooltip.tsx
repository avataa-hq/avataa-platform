import { createFormatter } from '6_shared/lib';
import { Typography } from '@mui/material';

interface IProps<T extends Record<string, any>> {
  object?: T;
}

export const OfflineMapTooltip = <T extends Record<string, any>>({ object }: IProps<T>) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        gap: '10px',
        minWidth: '300px',
      }}
    >
      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        <Typography sx={{ m: 0 }}>Name:</Typography>
        <Typography sx={{ m: 0 }}>{object?.name}</Typography>
      </div>
      {Object.entries(object?.eventValues ?? {}).map(([key, value]) => (
        <div key={key} style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <Typography sx={{ m: 0 }}>{key}:</Typography>
          <Typography sx={{ m: 0 }}>
            {/* @ts-ignore */}
            {createFormatter(value?.valueDecimals ?? 2).format(value?.value ?? 0)} {value?.unit}
          </Typography>
        </div>
      ))}
    </div>
  );
};
