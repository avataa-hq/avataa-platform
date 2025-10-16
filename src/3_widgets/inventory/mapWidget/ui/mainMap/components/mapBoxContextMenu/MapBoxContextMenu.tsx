import MenuItem from '@mui/material/MenuItem';
import { Box, CircularProgress, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Anchor } from 'mapbox-gl';
import { useTranslate } from '6_shared';
import {
  IContextMenuData,
  ISelectedInventoryObject,
} from '6_shared/models/inventoryMapWidget/types';
import * as SC from './MapBoxContextMenu.styled';

interface IProps<T extends string> {
  position: ISelectedInventoryObject['position'];
  options?: IContextMenuData<T>[];
  onMenuClick?: (menuItem: T, position: ISelectedInventoryObject['position']) => void;
  anchor?: Anchor;
  closeOnMove?: boolean;
  onClose?: () => void;
  isEnabledMenuItem?: (value: T) => boolean;
}

export const MapBoxContextMenu = <T extends string>({
  position,
  options,
  onMenuClick,
  anchor = 'top-left',
  closeOnMove = true,
  onClose,
  isEnabledMenuItem,
}: IProps<T>) => {
  const translate = useTranslate();

  return (
    <SC.MapBoxPopupStyled
      anchor={anchor}
      latitude={position.latitude || 0}
      longitude={position.longitude || 0}
      closeButton={false}
      closeOnMove={closeOnMove}
      onClose={onClose}
    >
      <SC.MapBoxContextMenuStyled>
        <SC.NestedMenu>
          {options?.map((opt) => {
            if (opt.value !== 'exportData' && opt.value !== 'viewDiagram') {
              return (
                <MenuItem
                  key={opt.id}
                  value={opt.value}
                  onClick={() => {
                    onClose?.();
                    onMenuClick?.(opt.value, position);
                  }}
                  disabled={!(isEnabledMenuItem?.(opt.value) ?? true) || opt.disabled}
                >
                  {translate(opt.label as any)}
                </MenuItem>
              );
            }

            return (
              <MenuItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled || opt.isLoading}
                className="parent"
                sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}
              >
                <Typography>{translate(opt.label as any)}</Typography>
                {opt.isLoading && <CircularProgress size={20} />}
                {!opt.isLoading && opt.submenu?.length && <ChevronRightIcon />}
                <Box component="div" className="nested_child">
                  {opt.submenu?.map((exportOpt) => (
                    <SC.NestedElement
                      key={exportOpt.id}
                      onClick={() => {
                        onClose?.();
                        onMenuClick?.(exportOpt.value as T, position);
                      }}
                    >
                      {exportOpt.label}
                    </SC.NestedElement>
                  ))}
                </Box>
              </MenuItem>
            );

            // <MenuItem
            //   key={opt.value}
            //   value={opt.value}
            //   onClick={() => onMenuClick?.(opt.value, position)}
            // >
            //   {/* {opt.value === 'exportData' && <MenuItem>To kml</MenuItem>} */}
            //   {opt.label}
            // </MenuItem>
          })}
        </SC.NestedMenu>
      </SC.MapBoxContextMenuStyled>
    </SC.MapBoxPopupStyled>
  );
};
