import { Typography, alpha, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { ripples, tailChase, ring } from 'ldrs';
import {
  NamedObjectPointStyled,
  Point,
  PointActiveContainer,
  PointContainer,
  PointLoadingContainer,
  PointName,
} from './NamedObjectPoint.styled';
import { CustomPalette } from '../../../theme/types';

tailChase.register();
ripples.register();
ring.register();
const getPointColor = (palette: CustomPalette, customColor?: string, selected?: boolean) => {
  if (selected) return palette.success.main;
  if (customColor) return customColor;
  return palette.primary.main;
};

const getNameBlockColor = (palette: CustomPalette, customColor?: string, selected?: boolean) => {
  if (selected) return palette.success.main;
  if (customColor) return customColor;
  return palette.background.default;
};

interface IProps {
  onClick?: (e: React.MouseEvent) => void;

  circleColor?: string;
  infoBackgroundColor?: string;
  textColor?: string;

  icon?: ReactNode;

  title?: string;
  description?: string;

  selected?: boolean;
  loading?: boolean;
  shadowSize?: number;
  rippleSize?: number;
  shadow?: boolean;
}
export const NamedObjectPoint = ({
  onClick,
  icon,
  infoBackgroundColor,
  textColor,
  circleColor,
  description,
  title,
  selected,
  loading,
  shadowSize,
  rippleSize,
  shadow,
}: IProps) => {
  const { palette } = useTheme();
  return (
    <NamedObjectPointStyled
      sx={{
        transform: title || description ? 'translate(0, 30px)' : 'translate(0, 0)',
      }}
    >
      <PointContainer>
        <Point
          data-testid="Map__object-point"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClick?.(e);
          }}
          sx={{
            background: getPointColor(palette, circleColor, selected),
            boxShadow:
              selected || shadow
                ? null
                : ` 0 0 1px ${shadowSize ?? 15}px ${alpha(
                    getPointColor(palette, circleColor, selected),
                    0.3,
                  )}`,
          }}
        >
          {icon}
        </Point>
        <PointActiveContainer>
          <l-ripples
            size={rippleSize ? String(rippleSize) : '50'}
            speed={selected && !loading ? 4 : 0}
            color={getPointColor(palette, circleColor, selected)}
          />
        </PointActiveContainer>
        <PointLoadingContainer>
          {loading && ( // Default values shown
            <l-ring size="90" stroke="6" bg-opacity="0" speed="2" color="white" />
          )}
        </PointLoadingContainer>
      </PointContainer>
      {(title || description) && (
        <PointName
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClick?.(e);
          }}
          sx={{
            background: getNameBlockColor(palette, infoBackgroundColor, selected),
          }}
        >
          <Typography sx={{ color: textColor ?? palette.text.primary, overflowWrap: 'anywhere' }}>
            {title}
          </Typography>
          <Typography
            sx={{ color: textColor ?? palette.text.primary, lineBreak: 'anywhere' }}
            variant="subtitle2"
          >
            {description}
          </Typography>
        </PointName>
      )}
    </NamedObjectPointStyled>
  );
};
