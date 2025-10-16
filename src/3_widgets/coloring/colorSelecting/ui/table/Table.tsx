import { Dispatch, useEffect, useState } from 'react';
import {
  Table as ColorTable,
  IconButton,
  Radio,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

import {
  IColorRangeModel,
  ActionTypes,
  ContextMenu,
  LoadingContainer,
  LoadingAvataa,
  useColorsConfigure,
  TprmData,
} from '6_shared';

import { TableWraper } from './Table.styled';
import { useActions } from '../../lib/useActions';

interface IProps {
  colorRanges?: IColorRangeModel[];
  userSub?: string;
  isAdmin: boolean;
  setIsOpenDeleteModal: (value: boolean) => void;
  setIsOpenDeleteForbiddenModal: (value: [boolean, string]) => void;
  isOnlyPrivateColors: boolean;
  tprms?: TprmData[] | TprmData;
  setIsAuthor: (value: boolean) => void;
  permissions?: Record<ActionTypes, boolean>;
  palettes?: IColorRangeModel[];
  selectedTab: string;
  handleApplyColors?: ({ tmoId, paletteId }: { tmoId: string; paletteId: number }) => void;
  setIsOpenCreateConfirmationModal?: Dispatch<React.SetStateAction<boolean>>;
  setIsOpenDeleteConfirmationModal?: Dispatch<React.SetStateAction<boolean>>;
  palettesLoaded?: boolean;
  disablePortal?: boolean;
}

export const Table = ({
  colorRanges,
  userSub,
  isAdmin,
  setIsOpenDeleteModal,
  setIsOpenDeleteForbiddenModal,
  isOnlyPrivateColors,
  tprms,
  selectedTab,
  setIsAuthor,
  permissions,
  palettes,
  handleApplyColors,
  setIsOpenCreateConfirmationModal,
  setIsOpenDeleteConfirmationModal,
  palettesLoaded = true,
  disablePortal,
}: IProps) => {
  const { selectedColor, setColorPaletteName, setSelectedColor } = useColorsConfigure();

  const [listOfColors, setListOfColors] = useState<IColorRangeModel[] | null>(null);

  const [anchorElContextMenu, setAnchorElContextMenu] = useState<null | HTMLElement>(null);
  const [contextMenuRow, setContextMenuRow] = useState<IColorRangeModel>();

  const { onOpenAsNew } = useActions({
    selectedTab,
    palettes,
    handleApplyColors,
    setIsOpenCreateConfirmationModal,
    setIsOpenDeleteConfirmationModal,
    row: contextMenuRow,
    tprms,
  });

  useEffect(() => {
    if (!colorRanges || !selectedColor) return;
    const colorSelected = colorRanges.find((item) => item.id === selectedColor.id);

    if (!colorSelected) return;
    setSelectedColor(colorSelected);
  }, [colorRanges, selectedColor]);

  useEffect(() => {
    if (colorRanges) {
      if (isOnlyPrivateColors) {
        const onlyPrivateColorsList = colorRanges.filter((item) => !item.public);
        setListOfColors(onlyPrivateColorsList);
      } else {
        setListOfColors(colorRanges);
      }
    }
  }, [colorRanges, isOnlyPrivateColors]);

  const onRowClick = (row: { id: number }) => {
    if (colorRanges) {
      const colorSelected = colorRanges.find((item) => item.id === row.id);
      if (colorSelected) {
        setSelectedColor(colorSelected);
        setColorPaletteName(colorSelected.name);
      }
    }
  };

  const onRadioChange = (colorId: number) => {
    if (colorRanges) {
      const colorSelected: IColorRangeModel | undefined = colorRanges.find(
        (item) => item.id === colorId,
      );

      if (colorSelected) {
        setSelectedColor(colorSelected);
        setColorPaletteName(colorSelected.name);
      }
    }
  };

  const onDeleteClick = ({
    isDefault,
    isPublic,
    created_by_sub,
  }: {
    isDefault: boolean;
    isPublic: boolean;
    created_by_sub: string;
  }) => {
    if (isDefault && isPublic) {
      setIsOpenDeleteForbiddenModal([true, 'public default']);
    } else if (created_by_sub !== userSub) {
      setIsOpenDeleteForbiddenModal([true, 'other user']);
    } else {
      setIsOpenDeleteModal(true);
    }
  };

  // Start :: Handling permission to mutate the palette
  useEffect(() => {
    if (selectedColor) {
      setIsAuthor(userSub === selectedColor.created_by_sub || isAdmin);
    }
  }, [userSub, selectedColor, setIsAuthor, isAdmin]);
  // End :: Handling permission to mutate the palette

  const handleClickContextMenu = (event: any, row: any) => {
    setContextMenuRow(row);
    event.preventDefault();
    event.stopPropagation();
    setAnchorElContextMenu(event.currentTarget);
  };

  const onPopupMenuItemClick = (item: string) => {
    if (item === 'Copy as New') {
      onOpenAsNew();
    }
    setAnchorElContextMenu(null);
  };

  const onClosePopup = () => {
    setAnchorElContextMenu(null);
  };

  if (!palettesLoaded) {
    return (
      <LoadingContainer blackout={0}>
        <LoadingAvataa />
      </LoadingContainer>
    );
  }

  return (
    <TableWraper>
      <TableContainer>
        <ColorTable size="medium">
          <TableBody>
            {listOfColors?.length ? (
              listOfColors.map((row) => (
                <TableRow
                  hover
                  onClick={() => onRowClick(row)}
                  key={row.id}
                  sx={{ cursor: 'pointer' }}
                  onContextMenu={(event: any) => {
                    event?.preventDefault();
                    handleClickContextMenu(event, row);
                  }}
                >
                  <TableCell padding="checkbox">
                    <Radio
                      checked={selectedColor?.id === row.id}
                      onChange={() => onRadioChange(row.id)}
                      value={row.name}
                      name="radio-button"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell padding="none">{row.name}</TableCell>
                  <TableCell align="right">{row.created_by}</TableCell>
                  <TableCell align="right">{row.public ? 'public' : 'private'}</TableCell>
                  <TableCell align="right">{row.default ? 'default' : ' '}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      disabled={!(permissions?.view ?? true)}
                      onClick={() =>
                        onDeleteClick({
                          isDefault: row.default ?? false,
                          isPublic: row.public ?? false,
                          created_by_sub: row.created_by_sub ?? '',
                        })
                      }
                    >
                      <DeleteForever />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No colouring settings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ColorTable>
      </TableContainer>
      <ContextMenu
        isOpen={!!anchorElContextMenu}
        menuItems={['Copy as New']}
        onContextMenuItemClick={onPopupMenuItemClick}
        anchorEl={anchorElContextMenu}
        setAnchorEl={setAnchorElContextMenu}
        onClose={onClosePopup}
        placement="bottom"
        disablePortal={disablePortal}
      />
    </TableWraper>
  );
};
