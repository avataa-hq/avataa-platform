// This component is inserted anywhere on the page.
// It takes a function that internally gives the name of the icon from the material
// The name is of type IMuiIconsType, which can be exported from this component.
// MUIIcons is an import * as MUIIcons from '@mui/icons-material';
// therefore, using this component boils down to,
// in the parent, where we create this component, a state is created with the name of the icon,
// and a function that we pass here. This function will change the stack,
// and, correspondingly, change the icon. Let's say our stack is called
// iconName, and to get the necessary icon, we take the Icons object
// and Icons[iconName] - the necessary icon. The main thing is to set the stack to the correct type:
// const [iconName, setIconName] = useState<IMuiIconsType>('Place');

import * as MUIIcons from '@mui/icons-material';
import React, { useMemo, useState } from 'react';
import { TextField } from '@mui/material';
import { useTranslate } from '6_shared';
import { Body, Header, MuiIconLibraryStyled } from './MUIIconLibrary.styled';
import useDebounceValue from '../../hooks/useDebounceValue';

const ICON_EXCLUSIONS = ['Outlined', 'Rounded', 'TwoTone', 'Sharp'];

export type IMuiIconsType = keyof typeof MUIIcons;
interface IProps {
  onIconClick?: (iconName: keyof typeof MUIIcons) => void;
}
export const MuiIconLibrary = ({ onIconClick }: IProps) => {
  const translate = useTranslate();

  const [searchTerm, setSearchTerm] = useState('');
  const debounceValue = useDebounceValue(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredIcons = useMemo(
    () =>
      Object.keys(MUIIcons)
        .filter((key) => !ICON_EXCLUSIONS.some((exclusion) => key.endsWith(exclusion)))
        .reduce((obj, key) => {
          obj[key as IMuiIconsType] = MUIIcons[key as IMuiIconsType];
          return obj;
        }, {} as Record<keyof typeof MUIIcons, any>),
    [],
  );
  const FoundIcons = useMemo(() => {
    return Object.keys(filteredIcons)
      .filter((key) => key.toLowerCase().includes(debounceValue.toLowerCase()))
      .map((iconName, idx) => {
        const IconComponent = filteredIcons[iconName as IMuiIconsType];
        return (
          <IconComponent
            key={idx}
            fontSize="large"
            onClick={() => {
              onIconClick?.(iconName as IMuiIconsType);
            }}
          />
        );
      });
  }, [debounceValue]);

  return (
    <MuiIconLibraryStyled>
      <Header>
        <TextField
          fullWidth
          placeholder={translate('Search icons')}
          onChange={handleSearchChange}
        />
      </Header>
      <Body>{FoundIcons}</Body>
    </MuiIconLibraryStyled>
  );
};
