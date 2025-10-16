import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Button } from '6_shared';
import { MapSwitcherStyled } from './MapSwitcher.styled';

interface IProps {
  handleFullScreen?: () => void;
  isFullscreen?: boolean;
}

export const MapSwitcher = ({ handleFullScreen, isFullscreen }: IProps) => {
  return (
    <Button onClick={handleFullScreen}>
      {isFullscreen ? <FullscreenExitIcon color="primary" /> : <FullscreenIcon color="secondary" />}
    </Button>
  );
};
