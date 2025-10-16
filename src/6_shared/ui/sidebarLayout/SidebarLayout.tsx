import { Sidebar } from './Sidebar';
import {
  Layout,
  LayoutContainer,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
} from './SidebarLayout.styled';

export const SidebarLayout = ({ children }: React.PropsWithChildren) => {
  return <Layout>{children}</Layout>;
};

SidebarLayout.Container = LayoutContainer;
SidebarLayout.Sidebar = Sidebar;
SidebarLayout.SidebarHeader = SidebarHeader;
SidebarLayout.SidebarBody = SidebarBody;
SidebarLayout.SidebarFooter = SidebarFooter;
