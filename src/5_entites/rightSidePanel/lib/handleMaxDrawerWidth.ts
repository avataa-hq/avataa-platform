interface IProps {
  selectedTab: string;
  isSideBarOpen: boolean;
  isLeftSidebarOpen: boolean;
}

export const handleMaxDrawerWidth = ({ selectedTab, isSideBarOpen, isLeftSidebarOpen }: IProps) => {
  const windowInnerWidth = window.innerWidth;
  const sidebarOpenWidth = 240;
  const sidebarCloseWidth = 64;
  const leftSidebarOpenWidth = 350;
  const leftDiagramsSidebarOpenWidth = 294;
  const leftSidebarCloseWidth = 20;
  const additionalWidth = 50;

  const maxWidthMap: Record<string, Record<string, number>> = {
    default: {
      'true-true': windowInnerWidth - sidebarOpenWidth - leftSidebarOpenWidth - additionalWidth,
      'true-false': windowInnerWidth - sidebarOpenWidth - additionalWidth,
      'false-true': windowInnerWidth - sidebarCloseWidth - leftSidebarOpenWidth - additionalWidth,
      'false-false': windowInnerWidth - sidebarCloseWidth - additionalWidth,
    },
    map: {
      'true-true': windowInnerWidth - sidebarOpenWidth - leftSidebarOpenWidth,
      'true-false': windowInnerWidth - sidebarOpenWidth - leftSidebarCloseWidth,
      'false-true': windowInnerWidth - sidebarCloseWidth - leftSidebarOpenWidth,
      'false-false': windowInnerWidth - sidebarCloseWidth - leftSidebarCloseWidth,
    },
    diagrams: {
      'true-true': windowInnerWidth - sidebarOpenWidth - leftDiagramsSidebarOpenWidth,
      'true-false': windowInnerWidth - sidebarOpenWidth - leftSidebarCloseWidth,
      'false-true': windowInnerWidth - sidebarCloseWidth - leftDiagramsSidebarOpenWidth,
      'false-false': windowInnerWidth - sidebarCloseWidth - leftSidebarCloseWidth,
    },
  };

  let maxWidth;

  if (selectedTab === 'map' || selectedTab === 'diagrams') {
    maxWidth = maxWidthMap[selectedTab][`${isSideBarOpen}-${isLeftSidebarOpen}`];
  } else {
    maxWidth = maxWidthMap.default[`${isSideBarOpen}-${isLeftSidebarOpen}`];
  }

  return maxWidth;
};
