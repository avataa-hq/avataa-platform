import { Box, Tooltip, TooltipProps, alpha, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  tooltipText: string;
  placement?: TooltipProps['placement'];
  customSX?: any;
}

export const CustomTooltip = ({ tooltipText, placement = 'left', children, customSX }: IProps) => {
  const theme = useTheme();

  return (
    <Tooltip
      placement={placement}
      title={tooltipText}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            boxShadow: `0px 4px 20px 0px ${alpha(theme.palette.text.primary, 0.15)}`,
            borderRadius: '10px',
          },
        },
      }}
    >
      <Box component="div" sx={{ width: '100%', ...customSX }}>
        {children}
      </Box>
    </Tooltip>
  );
};
