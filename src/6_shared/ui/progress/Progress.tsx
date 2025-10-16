import { CircularProgress, Typography } from '@mui/material';

interface IProps {
  value: number;
}

export const Progress = ({ value }: IProps) => {
  const getColorByValue = (val: number) => {
    if (val <= 25) return 'error';
    if (val > 25 && val < 100) return 'warning';
    if (val === 100) return 'success';
    return 'info';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
      <CircularProgress
        color={getColorByValue(value)}
        size={22}
        variant="determinate"
        value={value}
      />
      <Typography sx={{ whiteSpace: 'nowrap' }}>{value} %</Typography>
    </div>
  );
};
