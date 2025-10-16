import { Button, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  InventoryObjectTypesModel,
  LoadingAvataa,
  useAppNavigate,
  useHierarchy,
  useSettingsObject,
} from '6_shared';
import { NoStatusStyled } from './NoStatus.styled';
import { MainModuleListE } from '../../../../../config/mainModulesConfig';

interface IProps {
  currentTMO?: InventoryObjectTypesModel | null;
  isLoading?: boolean;
}

export const NoStatus = ({ currentTMO, isLoading }: IProps) => {
  const navigate = useAppNavigate();

  const { setSelectedObjectTypeItem, setParentId } = useHierarchy();
  const { setElementIdToScroll } = useSettingsObject();

  const onClick = () => {
    navigate(MainModuleListE.objects);

    if (currentTMO) {
      setSelectedObjectTypeItem(currentTMO);
      setParentId(currentTMO?.p_id ?? 0);
      setElementIdToScroll(String(currentTMO.id));
    }
  };

  return (
    <NoStatusStyled>
      {isLoading && <LoadingAvataa />}

      {!isLoading && (
        <>
          <Typography>{currentTMO?.name} TMO</Typography>
          <Typography>
            does not set the status parameter. You can configure it in the settings
          </Typography>
          <Button variant="contained.icon" onClick={onClick}>
            Open settings <SettingsIcon fontSize="small" sx={{ ml: 1 }} />
          </Button>
        </>
      )}
    </NoStatusStyled>
  );
};
