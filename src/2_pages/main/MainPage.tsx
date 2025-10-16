import { CardGridLayout, ImageCard, IModule, useAppNavigate } from '6_shared';
import { MainPageContainer } from './MainPage.styled';
import { moduleCardData } from './mockData';
import { useGroupedAccessibleModules } from './lib/useGroupedAccessibleModules';

const MainPage = () => {
  const groupedAccessibleModules = useGroupedAccessibleModules();

  const navigate = useAppNavigate();

  const handleCardClick = (appModule: IModule) => {
    navigate(appModule.id);
  };

  return (
    <MainPageContainer>
      {groupedAccessibleModules.map((modulesGroup, index) => (
        <CardGridLayout key={index}>
          {modulesGroup.map((appModule, i) => (
            <ImageCard
              key={appModule.id}
              title={appModule.label}
              // description={moduleCardData[appModule.id].description}
              imageUrl={moduleCardData[appModule.id]?.imageUrl}
              onClick={() => handleCardClick(appModule)}
              index={i}
            />
          ))}
        </CardGridLayout>
      ))}
    </MainPageContainer>
  );
};

export default MainPage;
