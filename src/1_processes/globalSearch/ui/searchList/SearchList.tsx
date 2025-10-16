import { MouseEvent, useMemo } from 'react';
import { Typography } from '@mui/material';
import { IInventorySearchObjectModel, LoadingAvataa, useTranslate } from '6_shared';
import {
  SearchListStyled,
  Header,
  Body,
  Footer,
  LoadingContainer,
  ListItem,
} from './SearchList.styled';

interface IProps {
  isExpanded: boolean;
  isLoading?: boolean;

  objectsList: IInventorySearchObjectModel[];
  selectedListItem: IInventorySearchObjectModel | null;

  onListItemClick: (e: MouseEvent<HTMLDivElement>, item: IInventorySearchObjectModel) => void;

  searchValue: string;
}
export const SearchList = ({
  isExpanded,
  isLoading,
  objectsList,
  selectedListItem,
  onListItemClick,
  searchValue,
}: IProps) => {
  const translate = useTranslate();

  const renderObjectsList = useMemo(() => {
    const separator = '♥';

    return objectsList.map((item) => {
      const regex = new RegExp(searchValue, 'gi');
      const highlightedName = item.name.replace(
        regex,
        (match) => `${separator}${match}${separator}`,
      );

      const splitName = highlightedName.split(separator);

      return (
        <ListItem
          active={selectedListItem && selectedListItem.id === item.id ? 'true' : 'false'}
          key={item.id}
          onClick={(e) => onListItemClick(e, item)}
        >
          <Typography>
            {splitName[0]}
            {splitName[1] && <span className="gs_highlight">{splitName[1]}</span>}
            {splitName[2]}
          </Typography>
          {item.tmo_name && <Typography variant="subtitle1">{item.tmo_name}</Typography>}
        </ListItem>
      );
    });
  }, [objectsList, onListItemClick, selectedListItem, searchValue]);

  return (
    <SearchListStyled state={isExpanded ? 'expanded' : 'collapsed'}>
      {objectsList.length === 0 && !isLoading && (
        <Header>
          <Typography sx={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}>
            {translate('No search results')}
          </Typography>
        </Header>
      )}
      <Body>
        {isLoading && (
          <LoadingContainer>
            <LoadingAvataa />
          </LoadingContainer>
        )}
        {renderObjectsList}
      </Body>
      <Footer />
    </SearchListStyled>
  );
};
