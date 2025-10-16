import {
  Sidebar,
  ModulesList,
  ModulesTabs,
  accountDataApi,
  Box,
  ShareState,
  IModule,
  useLocale,
  useThemeSlice,
  useSidebar,
  useUser,
  useAccountData,
} from '6_shared';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent } from 'react';
import { GlobalSearch } from '1_processes';
import { SidebarFooter } from './sidebarFooter/SidebarFooter';
import { useModulesActions } from '../../lib/useModulesActions';
import { SidebarLogo } from '../../../shared/ui';

const { usePostAccountDataMutation } = accountDataApi;

interface IProps {
  isLoading?: boolean;
  modules: IModule[];
}

export const SidebarLayout = ({ isLoading, modules }: IProps) => {
  const { user } = useUser();
  const locale = user?.locale;

  const { isOpen: isSideBarOpen, setIsOpen: setIsSideBarOpen } = useSidebar();
  const { currentLocale, availableLocales, setLocale } = useLocale();
  const { setAccountData, ...accountData } = useAccountData();
  const { mode: themeMode, setMuiLocale, themeSwitch } = useThemeSlice();

  const navigate = useNavigate();

  const {
    activeModuleTab,
    activeModuleGroupTab,
    tabsModulesConfig,
    onSidebarModuleItemClick,
    onModuleTabClose,
    onModuleTabChange,
  } = useModulesActions({ defaultModule: 'main', modules });

  const [editAccountData] = usePostAccountDataMutation();
  const handleEditUser = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (accountData) {
      const updatedAccountData = { ...accountData };

      updatedAccountData.attributes = {
        ...updatedAccountData.attributes,
        locale: [event.target.value],
      };

      setAccountData(updatedAccountData);
      editAccountData(updatedAccountData);
    }
  };

  const onLocaleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleEditUser(event);
    setLocale(event.target.value);
    setMuiLocale(event.target.value);
  };

  return (
    <Sidebar
      isLoading={isLoading}
      isOpen={isSideBarOpen}
      setIsOpen={(isOpen) => setIsSideBarOpen(isOpen)}
      headerSlot={<SidebarLogo onLogoClick={() => navigate('/')} />}
      bodySlot={
        <ModulesList
          isOpen={isSideBarOpen}
          modules={modules}
          activeModule={activeModuleTab}
          onItemClick={onSidebarModuleItemClick}
          activeModuleGroupTab={activeModuleGroupTab}
        />
      }
      footerSlot={
        <SidebarFooter
          userImage={user?.picture}
          userName={user?.name}
          availableLocales={availableLocales}
          locale={locale || currentLocale.code}
          onLocaleChange={onLocaleChange}
          isSwitchChecked={themeMode === 'dark'}
          onSwitchChange={() => themeSwitch()}
        />
      }
    >
      <ModulesTabs
        activeModuleTab={activeModuleTab}
        setActiveModuleTab={onModuleTabChange}
        onTabClose={onModuleTabClose}
        modules={tabsModulesConfig}
        tabsRightSlot={
          <Box height="100%" display="flex" justifyContent="end" alignItems="center">
            <ShareState />
            <GlobalSearch />
          </Box>
        }
      />
    </Sidebar>
  );
};
