import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Paper, Table, TableBody, TableContainer, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { Color, PaletteSettings, useColorsConfigure } from '6_shared';
import { ColorRow } from './colorRow';

interface SettingsTableProps {
  valType?: string | undefined;
  palette?: PaletteSettings;
  updatePalette?: (updateFn: (prev: PaletteSettings) => PaletteSettings) => void;
}

const SettingsTable = ({ valType, palette, updatePalette }: SettingsTableProps) => {
  const theme = useTheme();

  const { isEditColors, setNewColorsArray } = useColorsConfigure();

  const [editedName, setEditedName] = useState('');
  const [editedNameIndex, setEditedNameIndex] = useState(null);

  useEffect(() => {
    if ((valType === 'boolean' || valType === 'bool') && !isEditColors) {
      const firstBooleanCollorValue = {
        name: 'Tier 1',
        id: '1',
        hex: '#FF0000',
        booleanValue: true,
      };
      const secondBooleanCollorValue = {
        name: 'Tier 2',
        id: '2',
        hex: '#66CC33',
        booleanValue: false,
      };
      setNewColorsArray([firstBooleanCollorValue, secondBooleanCollorValue]);
    }
  }, [isEditColors, valType]);

  const isNameUnique = (nameToCheck: string, currentIndex: number) => {
    return (palette?.ranges?.colors as Color[]).every((color, index) => {
      if (index === currentIndex) return true;
      return color.name.toUpperCase() !== nameToCheck.toUpperCase();
    });
  };

  const handleNameClick = (index: any) => {
    setEditedName(palette?.ranges?.colors?.[index].name);
    setEditedNameIndex(index);
  };

  const handleNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleNameBlur = () => {
    if (editedNameIndex !== null && editedName.trim() !== '') {
      if (isNameUnique(editedName, editedNameIndex)) {
        const updatedPalette = {
          ...palette,
          ranges: {
            ...palette?.ranges,
            colors: palette?.ranges?.colors.map((color: any, index: any) => {
              if (index === editedNameIndex) {
                return { ...color, name: editedName };
              }
              return color;
            }),
          },
        };

        updatePalette?.(() => updatedPalette);
      } else {
        enqueueSnackbar('Names must be unique', { variant: 'error' });
      }
      setEditedNameIndex(null);
    }
  };

  const handleBooleanValueClick = () => {
    const newColors = [...(palette?.ranges?.colors ?? [])];

    for (let i = 0; i <= newColors.length - 1; i++) {
      newColors[i] = {
        ...newColors[i],
        booleanValue: !newColors[i].booleanValue,
      };
    }

    setNewColorsArray(newColors);
  };

  const defaultColor: string = useMemo(() => {
    if (valType !== 'string' && valType !== 'str') return '';
    return palette?.ranges?.defaultColor ?? theme.palette.primary.main;
  }, [palette, valType, theme.palette.primary.main]);

  const defaultLineWidth: number = useMemo(() => {
    return palette?.ranges?.defaultLineWidth ?? 8;
  }, [palette]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          {palette?.ranges?.colors?.map((item: Color, index: number) => (
            <ColorRow
              item={item}
              index={index}
              editedNameIndex={editedNameIndex}
              editedName={editedName}
              valType={valType}
              palette={palette}
              handleNameChange={handleNameChange}
              handleNameBlur={handleNameBlur}
              handleNameClick={handleNameClick}
              updatePalette={updatePalette}
              handleBooleanValueClick={handleBooleanValueClick}
            />
          ))}
          {defaultColor && (
            <ColorRow
              item={{
                name: 'Default Color',
                id: 'default',
                hex: defaultColor,
                lineWidth: defaultLineWidth,
              }}
              index={999}
              valType={valType}
              palette={palette}
              updatePalette={updatePalette}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SettingsTable;
