import { GridEditDateCell, GridRenderCellParams } from '@mui/x-data-grid-premium';
import {
  CirclePercentageCell,
  ColoredNumericCell,
  ColoredBooleanCell,
  ROW_GROUPING_COLUMN_PREFIX,
} from '6_shared';
import { Typography } from '@mui/material';
import { CheckCircleRounded, DoNotDisturbOnRounded } from '@mui/icons-material';
import { Box } from '@mui/system';
import { ColorDataByTprms } from './types';

interface IProps {
  params: GridRenderCellParams;
  type: string;
  coloredColumn?: ColorDataByTprms[number];
}

interface IRangesColors {
  name: string;
  id: string;
  hex: string;
  booleanValue?: boolean;
}

export const getRenderCell = ({
  params: { value, rowNode, field },
  type,
  coloredColumn,
}: IProps) => {
  if (rowNode.type === 'group') {
    if (field === `${ROW_GROUPING_COLUMN_PREFIX}${rowNode.groupingField}__`) {
      return <div>{rowNode.groupingKey}</div>;
    }
    return null;
  }

  if (coloredColumn) {
    const { value_type, ranges } = coloredColumn;

    if (type === 'string') {
      if (value_type === 'General') {
        let colorRange;
        colorRange = ranges.colors.find((item: IRangesColors) => value?.includes(item.name))?.hex;
        if (!colorRange && ranges.defaultColor) colorRange = ranges.defaultColor;
        return <Typography color={colorRange}>{value}</Typography>;
      }
      if (value_type === 'Hex') {
        const hexColorRegex =
          /^#([A-Fa-f0-9]{3}([A-Fa-f0-9]{3})?|[A-Fa-f0-9]{6}([A-Fa-f0-9]{2})?)$/;
        const isValidHexColor = hexColorRegex.test(value);

        if (isValidHexColor) {
          return (
            <Box
              component="div"
              sx={{
                width: '60px',
                height: '30px',
                background: value,
                borderRadius: '10px',
              }}
            />
          );
        }

        return <Typography>value</Typography>;
      }
    }
    if (type === 'number') {
      const breakPoints = ranges.values;
      const colors = ranges.colors?.map((range: { hex: string }) => range.hex);

      if (value_type === 'Percent') {
        return (
          <CirclePercentageCell
            value={!Number.isNaN(+value) ? +value : 'Null'}
            breakPoints={breakPoints}
            colors={colors}
          />
        );
      }
      if (value_type === 'General') {
        return (
          <ColoredNumericCell
            width="60px"
            value={!Number.isNaN(+value) ? +value : 'Null'}
            breakPoints={breakPoints}
            colors={colors}
          />
        );
      }
    }
    if (value != null && type === 'boolean') {
      let name = '';
      let hex = '';

      if (
        value != null &&
        (value === true || value.toString().toLowerCase() === 'true' || value === 1)
      ) {
        const trueColor = ranges.colors.find((item: any) => item.booleanValue);
        if (trueColor) {
          name = trueColor.name;
          hex = trueColor.hex;
        }
      } else {
        const falseColor = ranges.colors.find((item: any) => !item.booleanValue);
        if (falseColor) {
          name = falseColor.name;
          hex = falseColor.hex;
        }
      }

      return (
        <Box
          component="div"
          sx={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            // maxWidth: '140px',
            color: hex,
            background: `${hex}1A`,
            borderRadius: '10px',
          }}
        >
          {value === true || value.toString().toLowerCase() === 'true' || value === 1 ? (
            <CheckCircleRounded sx={{ color: `${hex} !important` }} />
          ) : (
            <DoNotDisturbOnRounded sx={{ color: `${hex} !important` }} />
          )}
          <Typography whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            {name}
          </Typography>
        </Box>
      );
    }
  }
  if (!coloredColumn && type === 'boolean') {
    return <ColoredBooleanCell value={value} />;
  }

  return undefined;
};
