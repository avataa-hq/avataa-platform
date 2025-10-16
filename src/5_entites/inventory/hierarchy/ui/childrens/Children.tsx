import { Typography } from '@mui/material';

import { ActionTypes, InventoryObjectTypesModel, LoadingAvataa, useTranslate } from '6_shared';
import { HierarchyObject } from '6_shared/api/hierarchy/types';

import { ChildrenStyled } from './Children.styled';
import { ChildrenItem } from './childrenItem/ChildrenItem';
import { LoadingStyled } from '../treeHierarchy/TreeHierarchy.styled';

type Item = HierarchyObject | InventoryObjectTypesModel;

interface IProps<T extends Item> {
  isChildrenFetching?: boolean;
  isChildrenError?: boolean;
  selectedChildren?: number | null | string;
  childrenItems?: T[];
  errorMessage?: string;

  getChildRightSideElements?: (item: T) => React.ReactNode;
  getChildLeftSideElements?: (item: T) => React.ReactNode;

  onChildrenClick: (event: React.MouseEvent<HTMLElement>, item: T) => void;
  handleClickContextMenu?: (event: any, item: T) => void;
  onFavoriteClick?: (id: number) => void;
  onEditClick?: (item: InventoryObjectTypesModel) => void;
  onDeleteClick?: () => void;

  anchor?: string;
  showChildrenCount?: boolean;
  favorites?: number[];
  showFavorite?: boolean;
  isObjectSettings?: boolean;

  permissions?: Record<ActionTypes, boolean>;
}

export const Children = <T extends Item>({
  isChildrenFetching,
  isChildrenError,
  selectedChildren,
  childrenItems,
  errorMessage,
  getChildRightSideElements,
  getChildLeftSideElements,
  onChildrenClick,
  onEditClick,
  onDeleteClick,
  handleClickContextMenu,
  showChildrenCount,
  anchor,
  onFavoriteClick,
  favorites,
  showFavorite,
  isObjectSettings,
  permissions,
}: IProps<T>) => {
  const translate = useTranslate();

  return (
    <ChildrenStyled>
      {(isChildrenError || errorMessage) && (
        <LoadingStyled>
          <Typography textAlign="center">
            {errorMessage ?? translate('Something went wrong, please try once more')}
          </Typography>
        </LoadingStyled>
      )}

      {!isChildrenError && !errorMessage && (
        <>
          {isChildrenFetching && (
            <LoadingStyled>
              <LoadingAvataa />
            </LoadingStyled>
          )}
          {childrenItems?.map((item) => (
            <ChildrenItem
              itemId={`${item.id}${anchor}`}
              key={item.id}
              item={item}
              selectedChildren={selectedChildren}
              getChildLeftSideElements={getChildLeftSideElements}
              getChildRightSideElements={getChildRightSideElements}
              onChildrenClick={onChildrenClick}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              handleClickContextMenu={handleClickContextMenu}
              showChildrenCount={showChildrenCount}
              onFavoriteClick={onFavoriteClick}
              favorite={favorites && favorites.includes(+item.id)}
              showFavorite={showFavorite}
              isObjectSettings={isObjectSettings}
              permissions={permissions}
            />
          ))}
        </>
      )}
    </ChildrenStyled>
  );
};
