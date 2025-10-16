import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { BoxProps } from '@mui/material';
import { useLeftSidebar } from '6_shared/models';
import { LayoutSidebar, SidebarContainer } from './SidebarLayout.styled';
import { SidebarCollapseButton } from './CollapseButton';

interface SidebarProps extends BoxProps {
  collapsible?: boolean;
  background?: string;
  openSize?: number;
}

export const Sidebar = ({
  collapsible = false,
  className,
  children,
  background,
  openSize,
  ...props
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const { setIsLeftSidebarOpen } = useLeftSidebar();

  useEffect(() => {
    setIsLeftSidebarOpen(isOpen);
  }, [isOpen]);

  return (
    <LayoutSidebar
      background={background}
      className={classNames({ close: !isOpen }, className)}
      opensize={openSize}
      {...props}
    >
      <SidebarContainer>{children}</SidebarContainer>
      {collapsible && (
        <SidebarCollapseButton isOpenLeftPanel={isOpen} setIsOpenLeftPanel={setIsOpen} />
      )}
    </LayoutSidebar>
  );
};
