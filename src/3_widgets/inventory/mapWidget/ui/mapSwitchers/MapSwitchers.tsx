import MapIcon from '@mui/icons-material/MapRounded';
import ManIcon from '@mui/icons-material/Man2Rounded';
import ThreeDIcon from '@mui/icons-material/ThreeDRotationRounded';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Button, useInventoryMapWidget } from '6_shared';
import { MouseEvent } from 'react';
import { SelectedMapType } from '6_shared/models/inventoryMapWidget/types';
import { MapSwitchersStyled } from './MapSwitchers.styled';

const eventOnCtrlAndClick = () => {
  document.dispatchEvent(new CustomEvent('clustersetting'));
};

interface IProps {
  handleFullScreen?: () => void;
  isFullscreen?: boolean;
}
export const MapSwitchers = ({ handleFullScreen, isFullscreen }: IProps) => {
  const { selectedMap, changeSelectedMap } = useInventoryMapWidget();

  const onBtnClick = (e: MouseEvent<HTMLButtonElement>, mapBtn: SelectedMapType | 'fullscreen') => {
    if (mapBtn !== 'fullscreen') changeSelectedMap(mapBtn);
    if (mapBtn === 'fullscreen') handleFullScreen?.();

    if (e.ctrlKey && e.shiftKey) {
      eventOnCtrlAndClick();
    }
  };

  return (
    <MapSwitchersStyled>
      <Button onClick={(e) => onBtnClick(e, 'fullscreen')}>
        {isFullscreen ? (
          <FullscreenExitIcon color="primary" />
        ) : (
          <FullscreenIcon color="secondary" />
        )}
      </Button>
      <Button active={selectedMap === 'main'} onClick={(e) => onBtnClick(e, 'main')}>
        <MapIcon color={selectedMap === 'main' ? 'primary' : 'secondary'} />
      </Button>
      <Button active={selectedMap === 'sw'} onClick={(e) => onBtnClick(e, 'sw')}>
        <ManIcon color={selectedMap === 'sw' ? 'primary' : 'secondary'} />
      </Button>
      <Button active={selectedMap === '3d'} onClick={(e) => onBtnClick(e, '3d')}>
        <ThreeDIcon color={selectedMap === '3d' ? 'primary' : 'secondary'} />
      </Button>
    </MapSwitchersStyled>
  );
};
