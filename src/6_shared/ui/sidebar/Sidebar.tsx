import { ReactNode } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  ContentContainer,
  SidebarContainer,
  SidebarContent,
  SidebarStyled,
  SidebarFooter,
  SidebarBody,
  SidebarHeader,
  SidebarFooterSwitchButton,
} from './Sidebar.styled';
import { LoadingContainer } from '../loadingContainer';
import { LoadingAvataa } from '../loadingAvataa';

interface IProps {
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;

  headerSlot?: ReactNode;
  bodySlot?: ReactNode;
  footerSlot?: ReactNode;

  children?: ReactNode;

  widthWhenOpen?: number;

  isLoading?: boolean;
}

export const Sidebar = ({
  isOpen,
  setIsOpen,

  headerSlot,
  bodySlot,
  footerSlot,

  children,

  widthWhenOpen = 250,

  isLoading,
}: IProps) => {
  const onSwitchOpenButtonClick = () => {
    setIsOpen?.(!isOpen);
  };

  return (
    <SidebarContainer>
      <SidebarStyled width={widthWhenOpen} variant="permanent" open={isOpen}>
        <SidebarContent>
          <SidebarHeader>{headerSlot}</SidebarHeader>
          {isLoading && isOpen && (
            <LoadingContainer>
              <LoadingAvataa />
            </LoadingContainer>
          )}
          <SidebarBody style={{ opacity: isLoading ? 0.4 : 1 }}>{bodySlot}</SidebarBody>
          <SidebarFooter>
            <SidebarFooterSwitchButton>
              <IconButton className="icon-button" onClick={onSwitchOpenButtonClick} color="inherit">
                {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </SidebarFooterSwitchButton>

            {footerSlot}
          </SidebarFooter>
        </SidebarContent>
      </SidebarStyled>
      <ContentContainer>{children}</ContentContainer>
    </SidebarContainer>
  );
};
