import { cloneElement, ReactElement, ReactNode, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import { Typography, useTheme } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import {
  GroupIconContainer,
  IconContainer,
  ModuleListItemStyled,
  TitleContainer,
} from './ModuleListItem.styled';

interface IModuleListItemProps {
  title: string;
  icon?: ReactNode;
  selected?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  isChild?: boolean;
  isGroup?: boolean;
}

export const ModuleListItem = ({
  icon,
  title,
  isOpen = true,
  onClick,
  selected,

  isChild,
  isGroup,
}: IModuleListItemProps) => {
  const { palette } = useTheme();

  const IconComponent = useMemo(() => {
    if (isGroup) {
      return selected ? (
        <ExpandCircleDownIcon fontSize="small" />
      ) : (
        <ArrowCircleRightIcon fontSize="small" />
      );
    }
    return null;
  }, [selected, isGroup]);

  return (
    <ModuleListItemStyled
      sx={{
        color: selected ? palette.components.sidebar.activeText : 'inherit',
        padding: `0 ${isChild ? '15px' : '5px'}`,
        transition: 'color 0.3s',
      }}
      onClick={onClick}
      data-testid={`module-list-item__${title}`}
    >
      <IconContainer>
        <IconButton sx={{ '.MuiSvgIcon-root': { color: 'inherit' } }} color="inherit">
          {cloneElement(icon as ReactElement, { fontSize: isChild ? 'small' : 'medium' })}
        </IconButton>
      </IconContainer>

      {isOpen && (
        <TitleContainer>
          <Typography fontSize={isChild ? '14px' : '15px'}>{title}</Typography>
          <GroupIconContainer>{IconComponent}</GroupIconContainer>
        </TitleContainer>
      )}
    </ModuleListItemStyled>
  );
};
