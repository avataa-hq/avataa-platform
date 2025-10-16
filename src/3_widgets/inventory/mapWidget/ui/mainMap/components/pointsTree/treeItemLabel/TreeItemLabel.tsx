import * as Icons from '@mui/icons-material';
import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import { LineSvg, LineType, lineTypes } from '6_shared';
import { Typography } from '@mui/material';
import { TreeItemLabelStyled, ItemLeft, ItemRight } from './TreeItemLabel.styled';

interface IProps {
  name: string;
  icon?: string | null;
  lineType?: LineType | null;
  iconColor?: string;
  selected?: boolean;
  geometryType?: 'line' | 'point';
  onClick?: () => void;
}
export const TreeItemLabel = ({
  name,
  icon,
  lineType,
  selected,
  iconColor,
  onClick,
  geometryType = 'point',
}: IProps) => {
  const Icon = Icons[icon ? (icon as IMuiIconsType) : 'Place'];

  return (
    <TreeItemLabelStyled
      onClick={onClick}
      sx={{
        color: !selected ? 'inherit' : ({ palette }) => palette.success.main,
      }}
    >
      <ItemLeft>
        {geometryType === 'point' && (
          <Icon
            fontSize="large"
            sx={{ fill: iconColor || (({ palette }) => palette.primary.main) }}
          />
        )}
        {geometryType === 'line' && (
          <LineSvg lineType={lineTypes[lineType ?? 'solid']} color={iconColor} />
        )}
      </ItemLeft>
      <ItemRight>
        <Typography variant="h3">{name}</Typography>
      </ItemRight>
    </TreeItemLabelStyled>
  );
};
