import { ChangeEvent } from 'react';
import { InputBase, Tooltip } from '@mui/material';
import { Add, Search, Visibility, VisibilityOff } from '@mui/icons-material';

import { useTranslate } from '6_shared';

import { PanelManagementContainer, PanelManagementInput, ButtonAdd } from '../MainView.styled';

interface IProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  onAssign: () => void;
  withInheritance?: boolean;
  showInherited?: boolean;
  onShowInherited?: () => void;
}

export const ManagementContainer = ({
  searchValue,
  setSearchValue,
  onAssign,
  withInheritance,
  showInherited,
  onShowInherited,
}: IProps) => {
  const translate = useTranslate();

  const onInputHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <PanelManagementContainer>
      <PanelManagementInput>
        <InputBase
          sx={{ ml: 1.5, flex: 1 }}
          placeholder={translate('Search')}
          value={searchValue}
          onChange={onInputHandleChange}
        />
        <Search sx={{ marginX: '10px' }} />
      </PanelManagementInput>
      {withInheritance && (
        <Tooltip title="Show inherited">
          <ButtonAdd onClick={onShowInherited}>
            {showInherited ? <Visibility /> : <VisibilityOff />}
          </ButtonAdd>
        </Tooltip>
      )}
      <ButtonAdd variant="contained" onClick={onAssign}>
        <Add />
      </ButtonAdd>
    </PanelManagementContainer>
  );
};
