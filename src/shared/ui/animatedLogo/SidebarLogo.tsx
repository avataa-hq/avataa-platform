import { useSidebar } from '6_shared';
import { Box, useTheme } from '@mui/material';
import {
  AnimatedLogoDarkClose,
  AnimatedLogoDarkOpen,
  AnimatedLogoLightClose,
  AnimatedLogoLightOpen,
} from 'shared/ui/animatedLogo';

interface IProps {
  onLogoClick?: () => void;
}

export const SidebarLogo = ({ onLogoClick }: IProps) => {
  const theme = useTheme();
  const { isOpen } = useSidebar();

  const { logo } = theme.palette.components;

  if (logo.large || logo.small) {
    if (logo.large === 'avataa' || logo.small === 'avataa') {
      if (isOpen) {
        if (theme.palette.mode === 'dark') return <AnimatedLogoDarkOpen />;
        if (theme.palette.mode === 'light') return <AnimatedLogoLightOpen />;
      } else {
        if (theme.palette.mode === 'dark') return <AnimatedLogoDarkClose />;
        if (theme.palette.mode === 'light') return <AnimatedLogoLightClose />;
      }
    }

    return (
      <Box component="div" onClick={onLogoClick}>
        <img
          style={{ height: '100%', objectFit: 'contain', overflow: 'hidden' }}
          src={isOpen ? logo.large ?? logo.small : logo.small ?? logo.large}
          alt="logo"
        />
      </Box>
    );
  }

  return null;
};
