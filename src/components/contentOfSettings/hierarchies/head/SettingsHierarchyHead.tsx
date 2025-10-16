import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button } from '@mui/material';
import { useTranslate } from '6_shared';
import SettingsObjectsHeadStyled from './SettingsHierarchyHead.styled';

interface IProps {
  onRefreshButtonClick?: () => Promise<void>;
  disableRefreshButtonClick?: boolean;
}

const SettingsHierarchyHead = ({ disableRefreshButtonClick, onRefreshButtonClick }: IProps) => {
  const translate = useTranslate();

  return (
    <SettingsObjectsHeadStyled>
      <Box component="div" className="title">
        <ArrowBackIcon className="title__icon" onClick={() => {}} />
        <Box component="h2" className="title__text">
          {translate('Edit hierarchy')}
        </Box>
      </Box>
      <Button
        disabled={disableRefreshButtonClick}
        onClick={onRefreshButtonClick}
        variant="contained"
      >
        {translate('Complete')}
      </Button>
    </SettingsObjectsHeadStyled>
  );
};

export default SettingsHierarchyHead;
