import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Button } from '6_shared';

interface IProps {
  maptreeLayersSortOrder: 'asc' | 'desc';
  setMaptreeLayersSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

export const TreemapLayersSortButton = ({
  maptreeLayersSortOrder,
  setMaptreeLayersSortOrder,
}: IProps) => {
  const toggleLayersSort = () =>
    setMaptreeLayersSortOrder((prevView) => (prevView === 'asc' ? 'desc' : 'asc'));

  return (
    <Button onClick={toggleLayersSort}>
      <SwapVertIcon />
    </Button>
  );
};
