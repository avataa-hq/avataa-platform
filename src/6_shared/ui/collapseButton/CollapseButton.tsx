import { ChevronLeft } from '@mui/icons-material';
import { CollapseButtonStyled } from './CollapseButton.styled';

interface IProps {
  isOpen: boolean;
  onToggle: () => void;
  direction?: 'left' | 'right';
  placement?: 'left' | 'right';
}

export const CollapseButton = ({
  isOpen,
  onToggle,
  direction = 'left',
  placement = 'left',
}: IProps) => {
  return (
    <CollapseButtonStyled
      className={isOpen ? 'right' : 'close'}
      variant="text"
      onClick={onToggle}
      placement={placement}
      sx={placement === 'left' ? { left: 0 } : { right: 0 }}
      // data-testid={`left-panel__toggle-${isOpenLeftPanel ? 'open' : 'closed'}`}
    >
      <ChevronLeft
        sx={{
          color: (theme) => theme.palette.primary.main,
          transform:
            // eslint-disable-next-line no-nested-ternary
            direction === 'left'
              ? isOpen
                ? 'rotate(0)'
                : 'rotate(180deg)'
              : isOpen
              ? 'rotate(180deg)'
              : 'rotate(0)',
        }}
      />
    </CollapseButtonStyled>
  );
};
