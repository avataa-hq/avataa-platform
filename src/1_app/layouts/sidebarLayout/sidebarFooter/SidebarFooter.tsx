import { ChangeEvent, useState } from 'react';
import { AvatarMenu, Locale, LocaleSelect, NameAvatar, ThemeSwitcher } from '6_shared';
import { SidebarFooterStyled } from './SidebarFooter.styled';

interface IMainSidebarFooterProps {
  userImage?: string;
  userName?: string;

  isSwitchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;

  availableLocales: Partial<Record<Locale, { code: Locale; name: string }>>;
  locale?: Locale;
  onLocaleChange?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const SidebarFooter = ({
  userImage,
  userName,
  isSwitchChecked,
  onSwitchChange,

  availableLocales,
  locale,
  onLocaleChange,
}: IMainSidebarFooterProps) => {
  const [anchorAvatarElement, setAnchorAvatarElement] = useState<HTMLElement | null>(null);

  return (
    <SidebarFooterStyled>
      <LocaleSelect
        locale={locale}
        availableLocales={availableLocales}
        onLocaleChange={onLocaleChange}
      />
      <ThemeSwitcher isSwitchChecked={isSwitchChecked} onSwitchChange={onSwitchChange} />
      <NameAvatar
        name={userName}
        image={userImage}
        onClick={(event) => setAnchorAvatarElement(event.currentTarget)}
      />

      <AvatarMenu
        open={!!anchorAvatarElement}
        anchorEl={anchorAvatarElement}
        onClose={() => setAnchorAvatarElement(null)}
      />
    </SidebarFooterStyled>
  );
};
