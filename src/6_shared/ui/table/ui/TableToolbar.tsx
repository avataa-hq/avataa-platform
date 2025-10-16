import { Typography } from '@mui/material';
import { TableToolbarContainer } from './Table.styled';

interface ToolbarProps {
  title?: string;
}

export const TableToolbar = ({ title, children }: React.PropsWithChildren<ToolbarProps>) => {
  return (
    <TableToolbarContainer>
      <Typography
        sx={{
          fontSize: '1.125rem',
          lineHeight: '1.375rem',
          fontWeight: '600',
        }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      {children}
    </TableToolbarContainer>
  );
};
