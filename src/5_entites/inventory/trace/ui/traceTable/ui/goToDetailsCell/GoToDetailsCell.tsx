import { Box, useAppNavigate, useObjectDetails } from '6_shared';
import { Typography, useTheme } from '@mui/material';
import { MainModuleListE } from 'config/mainModulesConfig';

interface IProps {
  id: number | string;
  name: string;
}

export const GoToDetailsCell = ({ id, name }: IProps) => {
  const navigate = useAppNavigate();
  const theme = useTheme();

  const { pushObjectIdToStack } = useObjectDetails();

  return (
    <Box>
      {id === '-' || name === '-' ? (
        <Typography sx={{ fontWeight: 400 }}>{name}</Typography>
      ) : (
        <Typography
          sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
          onClick={() => {
            navigate(MainModuleListE.objectDetails);
            pushObjectIdToStack(+id);
          }}
        >
          {name}
        </Typography>
      )}
    </Box>
  );
};
