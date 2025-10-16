import { ChevronLeft } from '@mui/icons-material';

import { CollapseButton } from './SidebarLayout.styled';

interface IButton {
  isOpenLeftPanel: boolean;
  setIsOpenLeftPanel: (isOpen: boolean) => void;
}

export const SidebarCollapseButton = ({ isOpenLeftPanel, setIsOpenLeftPanel }: IButton) => {
  const handleClick = () => {
    document.dispatchEvent(
      new CustomEvent('toggleSidebar', { detail: { isOpen: !isOpenLeftPanel } }),
    );
    setIsOpenLeftPanel(!isOpenLeftPanel);
  };

  return (
    <CollapseButton
      className={isOpenLeftPanel ? 'right' : 'close'}
      variant="text"
      onClick={handleClick}
      data-testid={`left-panel__toggle-${isOpenLeftPanel ? 'open' : 'closed'}`}
    >
      <ChevronLeft sx={{ color: (theme) => theme.palette.primary.main }} />
    </CollapseButton>
  );
};
