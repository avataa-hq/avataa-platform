import { alpha, Tooltip, useTheme } from '@mui/material';
import { getCroppedTextByLength } from '../lib/getCroppedTextByLength';
import { getCroppedTextByWidth } from '../lib/getCroppedTextByWidth';

interface IProps {
  label?: string;
}

export const ArcLabel = ({ label }: IProps) => {
  const { palette } = useTheme();

  if (!label) return null;

  const croppedText = getCroppedTextByWidth(label, 16);

  const isCropped = croppedText.length !== label.length;
  if (!isCropped) {
    return (
      <text
        x="50"
        y="120"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill={alpha(palette.text.primary, 1)}
      >
        {croppedText}
      </text>
    );
  }

  return (
    <Tooltip title={label}>
      <text x="-40" y="130" fontSize="11" fontWeight="bold" fill={alpha(palette.text.primary, 1)}>
        {croppedText}
      </text>
    </Tooltip>
  );
};
