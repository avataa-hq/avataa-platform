import { FullScreenHandle } from 'react-full-screen';
import { IMapWidgetProps, MapSwitchers, MapWidget } from '3_widgets';
import {
  MainContainerStyled,
  TopContainer,
  TopContainerRight,
  TopContainerLeft,
  MapContainer,
} from './MainContainer.styled';

interface IProps {
  handleFullscreen: FullScreenHandle;
  mapWidgetProps: IMapWidgetProps;
}

export const MainContainer = ({ handleFullscreen, mapWidgetProps }: IProps) => {
  const { active: isActiveFs, enter: enterFs, exit: exitFs } = handleFullscreen;
  return (
    <MainContainerStyled>
      <TopContainer>
        <TopContainerLeft>
          <MapSwitchers
            isFullscreen={isActiveFs}
            handleFullScreen={isActiveFs ? exitFs : enterFs}
          />
        </TopContainerLeft>
        <TopContainerRight />
      </TopContainer>
      <MapContainer>
        <MapWidget {...mapWidgetProps} />
      </MapContainer>
    </MainContainerStyled>
  );
};
