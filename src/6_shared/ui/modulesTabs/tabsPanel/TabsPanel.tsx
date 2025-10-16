import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { IModule } from '../../../types';
import {
  TabLabel,
  TabsContainer,
  TabsContainerSlot,
  TabsListStyled,
  TabStyled,
} from './TabsPanel.styled';

const Label = <ModuleId extends string>({
  module,
  onCloseTab,
  nonClosable,
}: {
  module: IModule<ModuleId>;
  onCloseTab?: (tab: string) => void;
  nonClosable?: boolean;
}) => {
  return (
    <TabLabel>
      <Typography>{module.label ?? 'No title'}</Typography>
      {!nonClosable && (
        <CloseIcon
          fontSize="small"
          onClick={(event) => {
            event.stopPropagation();
            onCloseTab?.(module.id);
          }}
        />
      )}
    </TabLabel>
  );
};

interface ITabProps<ModuleId extends string> {
  modules?: IModule<ModuleId>[];
  setActiveTab: (tab: IModule<ModuleId>) => void;
  onCloseTab?: (tab: IModule<ModuleId>) => void;
  rightSlot?: ReactNode;
}

export const TabsPanel = <ModuleId extends string>({
  setActiveTab,
  modules,
  onCloseTab,
  rightSlot,
}: ITabProps<ModuleId>) => {
  return (
    <TabsContainer>
      <TabsListStyled variant="scrollable">
        {modules?.map((tab) => (
          <TabStyled
            key={tab.id}
            value={tab.id}
            label={
              <Label
                nonClosable={tab.nonClosable}
                module={tab}
                onCloseTab={() => onCloseTab?.(tab)}
              />
            }
            onClick={() => setActiveTab?.(tab)}
          />
        ))}
      </TabsListStyled>
      <TabsContainerSlot>{rightSlot}</TabsContainerSlot>
    </TabsContainer>
  );
};
