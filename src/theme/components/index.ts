// These type imports are extending the MUI `Components` type to support @mui/lab and @mui/data-grid components
import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';

import { Components, Theme } from '@mui/material';

import { MuiDataGrid } from './DataGrid';
import { MuiButton } from './Button';
import { MuiLoadingButton } from './LoadingButton';
import { MuiInputBase } from './InputBase';
import { MuiSelect } from './Select';
import { MuiOutlinedInput } from './OutlinedInput';
import { MuiAutocomplete } from './Autocomplete';
import { MuiCard } from './Card';
import { MuiCheckbox } from './Checkbox';
import { MuiIconButton } from './IconButton';
import { MuiListItemButton } from './ListItemButton';
import { MuiPaper } from './Paper';
import { MuiSvgIcon } from './SvgIcon';
import { MuiTab } from './Tab';
import { MuiTabPanel } from './TabPanel';
import { MuiTabs } from './Tabs';
import { MuiTextField } from './TextField';

export const components: Components<Theme> = {
  MuiDataGrid,
  MuiButton,
  MuiLoadingButton,
  MuiInputBase,
  MuiSelect,
  MuiOutlinedInput,
  MuiTextField,
  MuiAutocomplete,
  MuiTabPanel,
  MuiTabs,
  MuiTab,
  MuiPaper,
  MuiCard,
  MuiSvgIcon,
  MuiCheckbox,
  MuiIconButton,
  MuiListItemButton,
};
