import { Tooltip, useTheme } from '@mui/material';
import { ISwitchButtonsConfig, useTranslate } from '6_shared';
import * as SC from './LeftSide.styled';

interface IProps {
  switchButtonsConfig?: ISwitchButtonsConfig[];
  title?: string;
  onSwitchButtonsClick?: (key: string) => void;
}

export const LeftSide = ({ switchButtonsConfig, title, onSwitchButtonsClick }: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  return (
    <SC.LeftSideStyled>
      {switchButtonsConfig?.map(({ key, label, Icon, dataTestId, permission }) => {
        const isVisible = permission !== undefined ? permission : true;

        if (!isVisible) return null;

        const isActive = title === label;

        return (
          <Tooltip key={key} title={translate(label as any)} placement="right-end">
            <SC.IconButtonStyled
              onClick={() => onSwitchButtonsClick?.(label)}
              name={label}
              data-testid={dataTestId}
            >
              <Icon sx={{ fill: isActive ? theme.palette.primary.main : 'currentColor' }} />
            </SC.IconButtonStyled>
          </Tooltip>
        );
      })}
    </SC.LeftSideStyled>
  );
};
