import { Box, useAppNavigate, useObjectDetails } from '6_shared';
import { Typography, useTheme } from '@mui/material';
import { MainModuleListE } from 'config/mainModulesConfig';

interface IProps {
  id: number;
  name: string;
}

export const GoToDetailsCell = ({ id, name }: IProps) => {
  const theme = useTheme();
  const navigate = useAppNavigate();

  const { pushObjectIdToStack } = useObjectDetails();

  return (
    <Box>
      <Typography
        sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
        onClick={() => {
          navigate(MainModuleListE.objectDetails);
          pushObjectIdToStack(id);
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};
