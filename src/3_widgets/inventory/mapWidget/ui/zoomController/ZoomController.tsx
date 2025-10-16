import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '6_shared';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ZoomControllerStyled = styled(Box)`
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

interface IProps {
  onClick?: (eventType: 'in' | 'out') => void;
}

let timer: NodeJS.Timer | null = null;
export const ZoomController = ({ onClick }: IProps) => {
  const onMouseDown = (eventType: 'in' | 'out') => {
    timer = setInterval(() => {
      onClick?.(eventType);
    }, 200);
  };
  const onMouseUp = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  return (
    <ZoomControllerStyled>
      <Button
        sx={{ borderRadius: '10px 10px 0 0 !important' }}
        onClick={() => onClick?.('in')}
        onMouseDown={() => onMouseDown('in')}
        onMouseUp={onMouseUp}
      >
        <AddIcon sx={{ '&:active': { color: ({ palette }) => palette.primary.main } }} />
      </Button>
      <Button
        sx={{ borderRadius: '0 0 10px 10px !important' }}
        onClick={() => onClick?.('out')}
        onMouseDown={() => onMouseDown('out')}
        onMouseUp={onMouseUp}
      >
        <RemoveIcon sx={{ '&:active': { color: ({ palette }) => palette.primary.main } }} />
      </Button>
    </ZoomControllerStyled>
  );
};
