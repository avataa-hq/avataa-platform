import { ButtonBaseProps, Tooltip } from '@mui/material';
import { CustomToolbarButton } from './CustomTableToolbar.styled';

interface IToolbarButtonProps extends ButtonBaseProps {
  title?: string;
  testId?: string;
  disabled?: boolean;
  id?: string;
}

export const ToolbarButton = (props: IToolbarButtonProps) => {
  const { children, title, onClick, testId, disabled, id } = props;
  return (
    <Tooltip title={title} data-testid={testId} arrow>
      <CustomToolbarButton
        color="inherit"
        variant="outlined"
        onClick={onClick}
        disabled={disabled}
        id={id}
      >
        {children}
      </CustomToolbarButton>
    </Tooltip>
  );
};
