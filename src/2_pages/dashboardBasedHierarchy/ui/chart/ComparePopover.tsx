import {
  Box,
  IconButton,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { CompareResult, IMultipleObjectsCompareResult, StatKey, useTranslate } from '6_shared';
import { useMemo } from 'react';

interface IProps {
  isOpen: boolean;
  compareResult: CompareResult | null;
  multipleObjectsTooltipData?: IMultipleObjectsCompareResult[];
  popoverPosition: {
    top: number;
    left: number;
  } | null;
  onPopoverClose: () => void;
}

export const ComparePopover = ({
  isOpen,
  compareResult,
  multipleObjectsTooltipData,
  popoverPosition,
  onPopoverClose,
}: IProps) => {
  const translate = useTranslate();

  const TooltipTable = useMemo(() => {
    if (!multipleObjectsTooltipData || multipleObjectsTooltipData.length === 0) {
      return (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{compareResult?.previousLabel}</TableCell>
              <TableCell>{compareResult?.currentLabel}</TableCell>
              <TableCell>{translate('Difference')}</TableCell>
              <TableCell>% {translate('Difference')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(['min', 'avg', 'max'] as StatKey[]).map((key) => (
              <TableRow key={key}>
                <TableCell>{key.toUpperCase()}</TableCell>
                <TableCell>{compareResult?.previous[key].toFixed(2)}</TableCell>
                <TableCell>{compareResult?.current[key].toFixed(2)}</TableCell>
                <TableCell>{compareResult?.delta[key].diff.toFixed(2)}</TableCell>
                <TableCell>{compareResult?.delta[key].percent.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {multipleObjectsTooltipData.map((tooltipData) => (
              <TableCell key={tooltipData.label}>{tooltipData.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(['min', 'avg', 'max'] as StatKey[]).map((key) => (
            <TableRow key={key}>
              <TableCell>{key.toUpperCase()}</TableCell>
              {multipleObjectsTooltipData.map((tooltipData) => (
                <TableCell align="center" key={tooltipData.label}>
                  {tooltipData.states[key].toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [compareResult, multipleObjectsTooltipData, translate]);

  return (
    <Popover
      open={isOpen}
      anchorReference="anchorPosition"
      anchorPosition={popoverPosition ?? { top: 0, left: 0 }}
      onClose={onPopoverClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      hideBackdrop
      aria-hidden={false}
      slotProps={{
        root: {
          sx: {
            pointerEvents: 'none',
          },
        },
        paper: {
          sx: {
            pointerEvents: 'auto',
          },
        },
      }}
    >
      <Box component="div" p={2}>
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle2">Intervals Comparison</Typography>
          <IconButton onClick={onPopoverClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        {TooltipTable}
      </Box>
    </Popover>
  );
};
