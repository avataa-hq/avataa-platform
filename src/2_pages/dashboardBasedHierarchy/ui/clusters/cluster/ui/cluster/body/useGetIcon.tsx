import { ArrowDropDownRounded, ArrowDropUpRounded, CircleRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material';

const useGetIcon = ({ getFontSize }: { getFontSize: (fz: number) => string }) => {
  const theme = useTheme();

  return (direction: string, color: string, isNoData?: boolean) => {
    const colors = {
      DEFAULT: theme.palette.success.main,
      RED: theme.palette.error.main,
      YELLOW: theme.palette.warning.main,
      INFO: theme.palette.info.main,
    };

    let iconColor = isNoData ? colors.INFO : colors.DEFAULT;

    if (color === 'RED' && !isNoData) {
      iconColor = colors.RED;
    }
    if (color === 'YELLOW' && !isNoData) {
      iconColor = colors.YELLOW;
    }

    const iconStyles = {
      fontSize: direction === 'STABLE' ? getFontSize(60) : getFontSize(15),
      color: iconColor,
      position: 'absolute',
      left: '50%',
      bottom: '50%',
      transform: 'translate(-50%, 50%)',
    };
    switch (direction) {
      case 'UP':
        return <ArrowDropUpRounded sx={iconStyles} />;
      case 'STABLE':
        return <CircleRounded sx={iconStyles} />;
      case 'DOWN':
        return <ArrowDropDownRounded sx={iconStyles} />;
      default:
        return <span />;
    }
  };
};

export default useGetIcon;
