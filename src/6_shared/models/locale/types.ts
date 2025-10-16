export type Locale = 'enUS' | 'ruRU' | 'ukUA' | 'deDE';

export type LocaleMap = Partial<
  Record<
    Locale,
    {
      code: Locale;
      name: string;
    }
  >
>;
