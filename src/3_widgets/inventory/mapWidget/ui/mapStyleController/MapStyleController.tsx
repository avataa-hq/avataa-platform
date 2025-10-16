import { Autocomplete, TextField } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import { useEffect, useState } from 'react';
import { Button, useTranslate } from '6_shared';
import { MapStyleType } from '6_shared/models/inventoryMapWidget/types';
import { mapStyles } from '6_shared/models/inventoryMapWidget/constants';

interface IProps {
  selectedStyle: MapStyleType;
  onChangeMapStyle: (selectedStyle: MapStyleType) => void;
  handleCloseContextMenu: () => void;
  mapType?: '2d' | '3d';
}
export const MapStyleController = ({
  onChangeMapStyle,
  selectedStyle,
  handleCloseContextMenu,
  mapType = '2d',
}: IProps) => {
  const translate = useTranslate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onChangeMapStyle(translate('Default') as MapStyleType);
  }, [mapType, onChangeMapStyle]);

  return (
    <>
      <Button
        active={isOpen}
        onClick={() => {
          setIsOpen((o) => !o);
          handleCloseContextMenu();
        }}
      >
        <LayersIcon color={isOpen ? 'primary' : 'inherit'} />
      </Button>
      {isOpen && (
        <Autocomplete
          disablePortal
          disableClearable
          onOpen={() => handleCloseContextMenu()}
          value={selectedStyle}
          options={mapStyles[mapType].map((item) => translate(item.label))}
          renderInput={(params) => (
            <TextField
              {...params}
              label={translate('Select map style')}
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              sx={{ caretColor: 'transparent' }}
            />
          )}
          onChange={(e, val) => {
            if (val) onChangeMapStyle(val as MapStyleType);
          }}
          sx={{
            width: '200px',
            borderRadius: '10px',
            backgroundColor: ({ palette }) => palette.neutralVariant.outline,
            '.MuiInputBase-root': {
              height: '40px',
            },
          }}
        />
      )}
    </>
  );
};
