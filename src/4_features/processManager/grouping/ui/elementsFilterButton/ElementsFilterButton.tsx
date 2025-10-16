import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { ElementsFilterButtonStyled } from './ElementsFilterButton.styled';

const elementsFilterButtonContent = {
  showFilterWithoutState: (
    <>
      <RemoveIcon color="error" fontSize="small" />
      Cancel filters
    </>
  ),
  showFilterWithState: (
    <>
      <ExpandLessRoundedIcon fontSize="small" />
      Hide filter
    </>
  ),
  closeFilterWithoutState: (
    <>
      <AddIcon color="success" fontSize="small" />
      Add elements by filter
    </>
  ),
  closeFilterWitState: (
    <>
      <ExpandMoreRoundedIcon fontSize="small" />
      Show filter
    </>
  ),
  disabledComponent: (
    <>
      <RemoveIcon color="error" fontSize="small" />
      unable to select filter
    </>
  ),
};
interface IProps {
  isFilterMode: boolean;
  onClick?: () => void;
  hasFilterState: boolean;

  disabled?: boolean;
}

export const ElementsFilterButton = ({
  isFilterMode,
  onClick,
  hasFilterState,
  disabled,
}: IProps) => {
  const getAddFilterButton = () => {
    const {
      showFilterWithState,
      showFilterWithoutState,
      closeFilterWitState,
      closeFilterWithoutState,
      disabledComponent,
    } = elementsFilterButtonContent;

    if (disabled) return disabledComponent;

    if (isFilterMode && hasFilterState) return showFilterWithState;
    if (isFilterMode && !hasFilterState) return showFilterWithoutState;

    if (!isFilterMode && hasFilterState) return closeFilterWitState;
    if (!isFilterMode && !hasFilterState) return closeFilterWithoutState;

    return null;
  };

  return (
    <ElementsFilterButtonStyled
      sx={{ opacity: disabled ? 0.5 : 1 }}
      onClick={disabled ? undefined : onClick}
    >
      {getAddFilterButton()}
    </ElementsFilterButtonStyled>
  );
};
