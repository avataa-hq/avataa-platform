import { useCallback, useEffect, useState, useRef } from 'react';
import { Drawer } from '@mui/material';
import { ISwitchButtonsConfig, LeftSide, RightSideHeader } from '6_shared';
import * as SC from './CustomDrawer.styled';

interface IProps extends React.PropsWithChildren {
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
  setDrawerWidth?: (width: number) => void;
  drawerMinWidth?: number;
  drawerMaxWidth?: number;
  id?: string;

  switchButtonsConfig?: ISwitchButtonsConfig[];
  onSwitchButtonsClick?: (key: string) => void;
  externalMouseup?: () => Promise<void>;

  children?: React.ReactNode;
  titleSlot?: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
  bottomControllsSlot?: React.ReactNode;
  hideResizing?: boolean;
  resizable?: boolean;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  selectedTab?: string;
}

export const CustomDrawer = ({
  open,
  onClose,
  drawerWidth = 320,
  setDrawerWidth,
  drawerMinWidth = 320,
  drawerMaxWidth = window.innerWidth,
  id,
  switchButtonsConfig,
  onSwitchButtonsClick,
  headerActions,
  bottomControllsSlot,
  children,
  titleSlot,
  title,
  hideResizing,
  resizable = true,
  anchor = 'right',
  externalMouseup,
  selectedTab,
}: IProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [newMaxWidth, setNewMaxWidth] = useState<number>(window.innerWidth);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleMousedown = () => {
    setIsResizing(true);
    document.body.style.userSelect = 'none';
  };

  const handleMousemove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !drawerRef.current) return;

      const offsetRight =
        drawerRef.current.offsetWidth -
        (e.clientX - drawerRef.current.getBoundingClientRect().left);

      if (offsetRight > drawerMinWidth && offsetRight < newMaxWidth) {
        setDrawerWidth?.(offsetRight);
      }
    },
    [isResizing, newMaxWidth, drawerMinWidth, setDrawerWidth],
  );

  const handleMouseup = useCallback(async () => {
    setIsResizing(false);
    document.body.style.userSelect = 'auto';

    externalMouseup?.();
  }, [externalMouseup]);

  const handleMouseupSync = useCallback(() => {
    handleMouseup().catch((error) => console.error('Error in handleMouseup:', error));
  }, [handleMouseup]);

  useEffect(() => {
    const handleResize = () => {
      setNewMaxWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [newMaxWidth]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseupSync);

    return () => {
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', handleMouseupSync);
    };
  }, [handleMousemove, handleMouseupSync]);

  useEffect(() => {
    setIsFullScreen(drawerWidth >= newMaxWidth);
  }, [newMaxWidth, drawerWidth]);

  const onResizeScreenClick = useCallback(() => {
    setIsResizing(true);
    setIsFullScreen(!isFullScreen);

    if (drawerWidth < newMaxWidth) {
      setDrawerWidth?.(newMaxWidth);
    } else {
      setDrawerWidth?.(drawerMinWidth);
    }

    setIsResizing(false);
  }, [isFullScreen, drawerWidth, newMaxWidth, drawerMinWidth, setDrawerWidth]);

  useEffect(() => {
    setIsTransitionEnabled(open);
  }, [open]);

  return (
    <Drawer
      ref={drawerRef}
      onMouseMove={handleMousemove as unknown as React.MouseEventHandler<HTMLDivElement>}
      onMouseUp={handleMouseup}
      open={open}
      anchor={anchor}
      variant="persistent"
      PaperProps={{
        id,
        style: {
          width: open ? drawerWidth : 0,
          maxWidth: drawerMaxWidth,
          transition: isTransitionEnabled
            ? 'transform 250ms cubic-bezier(0, 0, 0.2, 1), width 250ms ease'
            : 'transform 250ms cubic-bezier(0, 0, 0.2, 1)',
          overflow: 'hidden',
          borderRadius:
            selectedTab === 'processManager' || selectedTab === 'inventory'
              ? '10px'
              : '10px 0 0 10px',
          borderLeft: 'none',
          position:
            selectedTab === 'processManager' || selectedTab === 'inventory' ? 'static' : 'absolute',
        },
      }}
      onClose={onClose}
    >
      {resizable && <SC.Dragger onMouseDown={handleMousedown} />}

      <SC.CustomDrawerContent
        ref={containerRef}
        sx={anchor === 'left' ? { flexDirection: 'row-reverse' } : undefined}
      >
        {switchButtonsConfig && (
          <SC.LeftContent
            sx={{
              ...(anchor === 'right' && {
                borderRight: (theme) => `1px solid ${theme.palette.neutralVariant.outline}`,
              }),
              ...(anchor === 'left' && {
                borderLeft: (theme) => `1px solid ${theme.palette.neutralVariant.outline}`,
              }),
            }}
          >
            <LeftSide
              switchButtonsConfig={switchButtonsConfig}
              title={title}
              onSwitchButtonsClick={onSwitchButtonsClick}
            />
          </SC.LeftContent>
        )}

        <SC.RightContent>
          <SC.RightContentHeader>
            <RightSideHeader
              isFullScreen={isFullScreen}
              onClose={onClose}
              onResizeScreenClick={onResizeScreenClick}
              headerActions={headerActions}
              titleSlot={titleSlot}
              title={title}
              hideResizing={hideResizing}
            />
          </SC.RightContentHeader>

          <SC.RightContentBody>{children}</SC.RightContentBody>

          {bottomControllsSlot && (
            <SC.RightContentFooter>{bottomControllsSlot}</SC.RightContentFooter>
          )}
        </SC.RightContent>
      </SC.CustomDrawerContent>
    </Drawer>
  );
};
