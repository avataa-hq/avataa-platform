import { useState } from 'react';
import { Button } from '@mui/material';

import { useTranslate } from '6_shared';
import {
  ColumnsGroupsSwitchBox,
  ColumnsGroupsSwitchContainer,
  ColumnsGroupsSwitchMask,
} from './ColumnsGroupsSwitch.styled';

interface IColumnsGroupsSwitchProps {
  toggleToColumns: () => void;
  toggleToGroups: () => void;
}

const ColumnsGroupsSwitch = ({ toggleToColumns, toggleToGroups }: IColumnsGroupsSwitchProps) => {
  const [subType, setSubType] = useState<'columns' | 'groups'>('columns');
  const translate = useTranslate();

  const setColumns = () => {
    setSubType('columns');
    toggleToColumns();
  };

  const setGroups = () => {
    setSubType('groups');
    toggleToGroups();
  };

  return (
    <ColumnsGroupsSwitchContainer>
      <ColumnsGroupsSwitchBox>
        <ColumnsGroupsSwitchMask subtype={subType} />
        <Button
          disableRipple
          variant="text"
          sx={{
            color: (theme) =>
              subType === 'columns'
                ? theme.palette.primary.contrastText
                : theme.palette.primary.main,
            width: '50%',
          }}
          onClick={setColumns}
        >
          {translate('Columns')}
        </Button>
        <Button
          disableRipple
          variant="text"
          sx={{
            color: (theme) =>
              subType === 'groups'
                ? theme.palette.primary.contrastText
                : theme.palette.primary.main,
            width: '50%',
          }}
          onClick={setGroups}
        >
          {translate('Groups')}
        </Button>
      </ColumnsGroupsSwitchBox>
    </ColumnsGroupsSwitchContainer>
  );
};

export default ColumnsGroupsSwitch;
