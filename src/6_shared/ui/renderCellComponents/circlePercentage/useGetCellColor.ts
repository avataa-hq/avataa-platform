import { useEffect, useState } from 'react';

export const useGetCellColor = (
  value: number | 'Null',
  breakPoints: number[],
  colors: string[],
) => {
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    if (value === 'Null') {
      setColor('#4D33EB');
    }
    if (+value < breakPoints[0]) {
      setColor(colors[0]);
    } else if (+value >= breakPoints[breakPoints.length - 1]) {
      setColor(colors[breakPoints.length]);
    } else {
      breakPoints.forEach((breakPoint, i) => {
        if (+value >= breakPoint && +value < breakPoints[i + 1]) {
          setColor(colors[i + 1]);
        }
      });
    }
  }, [value, breakPoints, colors]);

  return { color };
};
