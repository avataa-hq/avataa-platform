import { Close } from '@mui/icons-material';
import * as SC from './RightSideHeader.styled';

interface IProps {
  isFullScreen: boolean;
  onClose: () => void;
  onResizeScreenClick: () => void;
  headerActions?: React.ReactNode;
  titleSlot?: React.ReactNode;
  title?: string;
  hideResizing?: boolean;
}

export const RightSideHeader = ({
  isFullScreen,
  onClose,
  onResizeScreenClick,
  headerActions,
  titleSlot,
  title,
  hideResizing = false,
}: IProps) => {
  return (
    <SC.Header>
      <SC.TitleContent>
        {title && <SC.RightSideTitle>{title}</SC.RightSideTitle>}
        {titleSlot}
      </SC.TitleContent>

      <SC.IconsContent>
        {headerActions}

        {!hideResizing && (
          <SC.IconButtonStyled
            onClick={onResizeScreenClick}
            data-testid="right-panel-trace__fullscreen-handler"
          >
            {isFullScreen ? <SC.CloseFullScreenStyled /> : <SC.OpenInFullStyled />}
          </SC.IconButtonStyled>
        )}
        <SC.IconButtonStyled onClick={onClose} data-testid="right-panel-trace__close-panel-handler">
          <Close />
        </SC.IconButtonStyled>
      </SC.IconsContent>
    </SC.Header>
  );
};
