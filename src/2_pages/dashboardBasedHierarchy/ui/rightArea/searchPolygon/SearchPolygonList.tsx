import { MouseEvent, useMemo } from 'react';
import { Typography } from '@mui/material';
import { InventoryAndHierarchyObjectTogether, useTranslate } from '6_shared';
import { SearchPolygonListStyled, Header, Body, ListItem } from './SearchPolygonList.styled';

interface IProps {
  isExpanded: boolean;
  objectsList: InventoryAndHierarchyObjectTogether[] | undefined;
  onListItemClick: (
    e: MouseEvent<HTMLDivElement>,
    item: InventoryAndHierarchyObjectTogether,
  ) => void;
  searchValue: string;
  isFetchingObjectsList?: boolean;
}

export const SearchPolygonList = ({
  isExpanded,
  objectsList,
  onListItemClick,
  searchValue,
  isFetchingObjectsList,
}: IProps) => {
  const translate = useTranslate();
  const renderObjectsList = useMemo(() => {
    const separator = '♥';

    return objectsList?.map((item) => {
      const regex = new RegExp(searchValue, 'gi');
      const highlightedName = item.name.replace(
        regex,
        (match) => `${separator}${match}${separator}`,
      );
      const highlightedLabel =
        item.label?.replace(regex, (match) => `${separator}${match}${separator}`) ?? '';

      const splitName = highlightedName.split(separator);
      const splitLabel = highlightedLabel.split(separator);

      return (
        <ListItem key={item.name} onClick={(e) => onListItemClick(e, item)}>
          <Typography>
            {splitName[0] || ''}
            {splitName[1] && <span className="gs_highlight">{splitName[1]}</span>}
            {splitName[2] || ''}
          </Typography>

          <Typography variant="subtitle1">
            {splitLabel[0] || ''}
            {splitLabel[1] && <span className="gs_highlight">{splitLabel[1]}</span>}
            {splitLabel[2] || ''}
          </Typography>
        </ListItem>
      );
    });
  }, [objectsList, onListItemClick, searchValue]);

  const noResultsMessage = useMemo(() => {
    if (objectsList?.length === 0) {
      return translate('No search results');
    }
    if (isFetchingObjectsList) {
      return translate('Loading');
    }
    return null;
  }, [isFetchingObjectsList, objectsList?.length, translate]);

  return (
    <SearchPolygonListStyled state={isExpanded ? 'expanded' : 'collapsed'}>
      {noResultsMessage && (
        <Header>
          <Typography sx={{ opacity: 0.7 }} align="center">
            {noResultsMessage}
          </Typography>
        </Header>
      )}
      {!isFetchingObjectsList && <Body>{renderObjectsList}</Body>}
    </SearchPolygonListStyled>
  );
};
