import { FolderOpen, MoreHoriz } from '@mui/icons-material';
import { IconButton, LinearProgress, Typography, Menu, MenuItem } from '@mui/material';

import { Box, InventoryObjectTypesModel, useTranslate } from '6_shared';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { ParentsItem } from './parentsItem/ParentsItem';
import { BreadcrumbsStyled, ParentsStyled } from './Parents.styled';
import { LoadingStyled } from '../treeHierarchy/TreeHierarchy.styled';

type Item = HierarchyObject | InventoryObjectTypesModel;

interface IProps<T extends Item> {
  parentItems?: T[];
  errorMessage?: string;
  getParentRightSideElements?: (item: T) => React.ReactNode;
  anchorElHierarchyPath?: HTMLElement | null;
  isBreadcrumbsFetching?: boolean;
  isBreadcrumbsError?: boolean;
  onClickHierarchyPath: (event: any) => void;
  onParentClick: (parent: T) => void;
  setAnchorElHierarchyPath: (value: React.SetStateAction<HTMLElement | null>) => void;
}

export const Parents = <T extends Item>({
  parentItems,
  errorMessage,
  getParentRightSideElements,
  anchorElHierarchyPath,
  isBreadcrumbsFetching,
  isBreadcrumbsError,
  onClickHierarchyPath,
  onParentClick,
  setAnchorElHierarchyPath,
}: IProps<T>) => {
  const translate = useTranslate();

  return (
    <ParentsStyled parentslength={parentItems?.length || 0}>
      {parentItems && parentItems.length > 4 && (
        <>
          <BreadcrumbsStyled>
            <IconButton onClick={onClickHierarchyPath}>
              <MoreHoriz />
            </IconButton>
          </BreadcrumbsStyled>
          <Menu
            anchorEl={anchorElHierarchyPath}
            open={!!anchorElHierarchyPath}
            onClose={() => setAnchorElHierarchyPath(null)}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          >
            {parentItems?.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  onParentClick(item);
                  setAnchorElHierarchyPath(null);
                }}
              >
                <FolderOpen />
                <Box sx={{ padding: '0 20px' }}>
                  {'key' in item
                    ? (item as HierarchyObject).key
                    : (item as InventoryObjectTypesModel).name}
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      {(isBreadcrumbsError || errorMessage) && (
        <Box className="error">
          <Typography>
            {errorMessage ?? translate('Something went wrong, please try once more')}
          </Typography>
        </Box>
      )}

      {!isBreadcrumbsError && (
        <Box className="parents__container">
          {isBreadcrumbsFetching && (
            <LoadingStyled>
              <Typography textAlign="center">{translate('Loading')}...</Typography>
              <LinearProgress />
            </LoadingStyled>
          )}
          {parentItems?.slice(-4).map((item, i) => (
            <ParentsItem
              key={item.id}
              item={item}
              onParentClick={onParentClick}
              ml={i * 10}
              getParentRightSideElements={getParentRightSideElements}
            />
          ))}
        </Box>
      )}
    </ParentsStyled>
  );
};
