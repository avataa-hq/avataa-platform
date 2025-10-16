import { ChangeEvent } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Locale } from '6_shared/models';
import { LocaleSelectStyled } from './LocaleSelect.styled';

interface ILocaleSelectProps {
  availableLocales: Partial<Record<Locale, { code: Locale; name: string }>>;
  locale?: Locale;
  onLocaleChange?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const LocaleSelect = ({ onLocaleChange, availableLocales, locale }: ILocaleSelectProps) => {
  return (
    <LocaleSelectStyled
      select
      value={locale}
      onChange={onLocaleChange}
      data-testid="main-sidebar__localization-select"
    >
      {Object.values(availableLocales).map((l) => (
        <MenuItem key={l?.code} value={l?.code}>
          {l?.name}
        </MenuItem>
      ))}
    </LocaleSelectStyled>
  );
};
