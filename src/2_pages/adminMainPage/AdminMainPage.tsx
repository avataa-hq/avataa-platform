import { CardGridLayout, ImageCard, IModule, useAppNavigate, useTranslate } from '6_shared';

import { AdminMainPageContainer } from './AdminMainPage.styled';
import { moduleCardData } from './mockData';
import { useGroupedAccessableModules } from './lib/useGroupedAccessableModules';

export const AdminMainPage = () => {
  const navigate = useAppNavigate();
  const translate = useTranslate();
  const groupedAccessableModules = useGroupedAccessableModules();

  const handleCardClick = (appModule: IModule) => {
    navigate(appModule.id);
  };

  return (
    <AdminMainPageContainer>
      {groupedAccessableModules.map((modulesGroup, index) => (
        <CardGridLayout key={index}>
          {modulesGroup.map((appModule, i) => (
            <ImageCard
              key={appModule.id}
              // @ts-ignore
              title={translate(appModule.label)}
              // description={moduleCardData[appModule.id].description}
              imageUrl={moduleCardData[appModule.id]?.imageUrl}
              onClick={() => handleCardClick(appModule)}
              index={i}
            />
          ))}
        </CardGridLayout>
      ))}
    </AdminMainPageContainer>
  );
};
