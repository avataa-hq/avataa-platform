import { Typography, Button, Divider, CircularProgress } from '@mui/material';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import { Icons, Button as MyButton } from '6_shared';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorIcon from '@mui/icons-material/Error';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  BuildingPathHintStyle,
  HintActions,
  HintMessageContainer,
  HintMessageItem,
  HintIconContainer,
  Content,
} from './BuildingPathHint.styled';

interface IProps {
  haveTwoPoints?: boolean;
  haveSelectedZone?: boolean;

  onSaveClick?: () => void;
  onCancelClick?: () => void;

  isActivePolygonTool?: boolean;
  onPolygonButtonClick?: () => void;

  errorMessage?: string | null;
  isLoading?: boolean;
}

// Select two points
// Select an area using the "polygon" tool

export const BuildingPathHint = ({
  haveTwoPoints,
  haveSelectedZone,

  onSaveClick,
  onCancelClick,
  isActivePolygonTool,
  onPolygonButtonClick,

  errorMessage,
  isLoading,
}: IProps) => {
  return (
    <BuildingPathHintStyle>
      <Content>
        <HintIconContainer>
          {errorMessage ? (
            <ErrorIcon color="error" fontSize="large" />
          ) : (
            <LightbulbRoundedIcon color="warning" fontSize="large" />
          )}
        </HintIconContainer>
        {errorMessage && (
          <HintMessageContainer sx={{ maxWidth: '600px' }}>
            <Typography variant="body1">{errorMessage}.</Typography>
            <Typography variant="body2">
              Please try to adjust the selected area and try again.
            </Typography>
            <Button onClick={onSaveClick}>
              Refresh <ReplayIcon />
            </Button>
          </HintMessageContainer>
        )}
        {!errorMessage && (
          <HintMessageContainer>
            <HintMessageItem>
              <CheckCircleRoundedIcon
                sx={({ palette }) => ({
                  fill: haveTwoPoints ? palette.success.main : palette.info.main,
                })}
              />
              <Typography sx={{ opacity: haveTwoPoints ? 0.6 : 1 }} variant="body1">
                Select start and end point
              </Typography>
            </HintMessageItem>

            <HintMessageItem>
              <CheckCircleRoundedIcon
                sx={({ palette }) => ({
                  fill: haveSelectedZone ? palette.success.main : palette.info.main,
                })}
              />
              <Typography sx={{ opacity: haveSelectedZone ? 0.6 : 1 }} variant="body1">
                Select the area between two points using the &ldquo;polygon&ldquo; tool
              </Typography>
              <MyButton
                disabled={!haveTwoPoints}
                active={isActivePolygonTool}
                onClick={onPolygonButtonClick}
              >
                <Icons.PolygonIcon color={isActivePolygonTool ? 'primary' : 'inherit'} />
              </MyButton>
            </HintMessageItem>
          </HintMessageContainer>
        )}
        {!errorMessage && <Divider />}
        {!errorMessage && (
          <HintActions>
            <Button onClick={onCancelClick} color="error">
              Cancel
            </Button>
            <Button
              disabled={!haveTwoPoints || !haveSelectedZone}
              onClick={onSaveClick}
              variant="contained"
            >
              {isLoading ? <CircularProgress size={23} /> : 'Save'}
            </Button>
          </HintActions>
        )}
      </Content>
    </BuildingPathHintStyle>
  );
};
