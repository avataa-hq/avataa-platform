import { useState } from 'react';
import { ItemType } from '6_shared';
import { Panel, PanelTitle, PanelContainer, PanelListContainer } from '../MainView.styled';
import { ManagementContainer } from './ManagementContainer';
import { ShowBelongingList } from './showBelongingList/ShowBelongingList';

interface IProps {
  panelTitle: string;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  onAssign: () => void;
  list?: ItemType[];
  inheritedList?: ItemType[];
  onDeleteClick?: (item: ItemType) => void;
}

export const TablePanel = ({
  panelTitle,
  searchValue,
  setSearchValue,
  onAssign,
  list,
  inheritedList,
  onDeleteClick,
}: IProps) => {
  const [showInherited, setShowInherited] = useState(false);

  const onShowInherited = () => setShowInherited(!showInherited);

  return (
    <Panel>
      <PanelTitle>{panelTitle}</PanelTitle>
      <PanelContainer>
        <ManagementContainer
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onAssign={onAssign}
          withInheritance={!!inheritedList}
          showInherited={showInherited}
          onShowInherited={onShowInherited}
        />
        <PanelListContainer>
          <ShowBelongingList
            list={list}
            inheritedList={inheritedList}
            onDeleteClick={onDeleteClick}
            showInherited={showInherited}
          />
        </PanelListContainer>
      </PanelContainer>
    </Panel>
  );
};
