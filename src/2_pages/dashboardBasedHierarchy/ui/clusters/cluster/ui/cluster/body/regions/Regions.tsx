import { memo, useMemo } from 'react';
import { Skeleton } from '@mui/material';
import { ArcProgress, ISpeedometerData } from '6_shared';
import { RegionsContainer } from './Regions.styled';

interface RegionsProps {
  speedometersData: ISpeedometerData[];
}

const RegionsComponent = ({ speedometersData }: RegionsProps) => {
  const correctData = useMemo(() => {
    return speedometersData?.filter((i) => Boolean(i)) ?? [];
  }, [speedometersData]);

  return (
    <RegionsContainer>
      {!correctData?.length
        ? [1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="circular"
              sx={{ height: '66%', aspectRatio: '1/1' }}
              animation={false}
            />
          ))
        : correctData?.map((item) => (
            <ArcProgress
              key={item.key}
              value={{
                value: item.value ? +item.value : 0,
                min: item.minValue ? +item.minValue : 0,
                max: item.maxValue ? +item.maxValue : 100,
                tickMarks: item.ticks,
                label: item.name,
                prevValue: item.initialValue ? +item.initialValue : 0,
                valueDecimals: item.numberOfDecimals,
                description: item.description,
                valueUnit: item.unit,
              }}
              additionalValue={item.additionalValue}
              icon={{ type: item.icon, color: item.iconColor, direction: item.directionValue }}
              name={item.name}
              numberOfDecimals={item.numberOfDecimals}
              viewBox="-20 0 120 120"
            />
          ))}
    </RegionsContainer>
  );
};

export const Regions = memo(RegionsComponent);
