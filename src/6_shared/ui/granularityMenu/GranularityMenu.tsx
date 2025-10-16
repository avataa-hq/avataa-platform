import { Menu, MenuItem } from '@mui/material';
import { GRANULARITY_TYPES, GranularityType } from '6_shared/api/clickhouse/constants';

type Props = {
  menuPosition: { mouseX: number; mouseY: number } | null;
  handleClose: () => void;
  selectedGranularity: GranularityType;
  handleSelectGranularity: (option: GranularityType) => void;
};

export const GranularityMenu = ({
  menuPosition,
  handleClose,
  selectedGranularity,
  handleSelectGranularity,
}: Props) => {
  return (
    <Menu
      open={!!menuPosition}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined
      }
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {GRANULARITY_TYPES.map((option) => (
        <MenuItem
          key={option}
          selected={option === selectedGranularity}
          onClick={() => handleSelectGranularity(option)}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );
};
