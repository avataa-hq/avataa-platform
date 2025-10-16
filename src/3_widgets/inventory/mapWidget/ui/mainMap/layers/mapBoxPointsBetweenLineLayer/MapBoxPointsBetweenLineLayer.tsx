import { Marker } from 'react-map-gl';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { PointsBetweenLine } from '6_shared/models/inventoryMapWidget/types';

const PointStyled = styled(Box)`
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  border-width: 3px;
  border-style: solid;
  background: #ffffff;
  color: #232323;
  font-weight: 600;
  opacity: 0;
  animation: animation_appearancePoint 0.3s forwards;

  @keyframes animation_appearancePoint {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;

interface IProps {
  data: PointsBetweenLine[];
  onClick?: (item: PointsBetweenLine) => void;
  pointSize?: number;
}

export const MapBoxPointsBetweenLineLayer = ({ onClick, data, pointSize }: IProps) => {
  return data.map((item) => (
    <Marker
      key={item.id}
      {...item.position}
      onClick={(e) => {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
        onClick?.(item);
      }}
    >
      <PointStyled
        sx={({ palette }) => ({
          borderColor: item.color ?? palette.primary.main,
          height: `${pointSize ?? 40}px`,
          width: `${pointSize ?? 40}px`,
          transition: 'all 0.3s',
          fontSize: `${pointSize ? pointSize / 2.5 : 16}px`,
        })}
      >
        {item.count}
      </PointStyled>
    </Marker>
  ));
};
