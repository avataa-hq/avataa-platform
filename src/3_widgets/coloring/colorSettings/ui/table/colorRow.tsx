import { ChangeEvent, useMemo } from 'react';
import { Delete, CheckCircleRounded, DoNotDisturbOnRounded } from '@mui/icons-material';
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  Slider,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Color,
  IColorRangeModel,
  PaletteSettings,
  useColorsConfigure,
  useTabs,
  useTranslate,
} from '6_shared';
import {
  onAddColor,
  onChangeRowColor,
  onChangeRowLineWidth,
  onChangeRowValue,
  onRemoveColor,
  onToggleSongWarningCheck,
} from '3_widgets/coloring/helper/valueColorModifiers';
// import { handleMouseRowEnter, handleMouseRowLeave } from '3_widgets/coloring/helper/mouseHandlers';
import AddIcon from '@mui/icons-material/Add';
// import { TableRowStyled } from '../../ColorSettings.styled';

interface IProps {
  item: Color;
  index: number;
  editedNameIndex?: number | null;
  editedName?: string;
  valType: string | undefined;
  palette?: Partial<IColorRangeModel>;
  handleNameChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleNameBlur?: () => void;
  handleNameClick?: (index: number) => void;
  updatePalette?: (updateFn: (prev: PaletteSettings) => PaletteSettings) => void;
  handleBooleanValueClick?: () => void;
}

export const ColorRow = ({
  item,
  index,
  editedNameIndex,
  editedName,
  valType,
  palette,
  handleNameChange,
  handleNameBlur,
  handleNameClick,
  updatePalette,
  handleBooleanValueClick,
}: IProps) => {
  const translate = useTranslate();

  const { currentTmoType } = useColorsConfigure();
  const { selectedTab } = useTabs();

  // const [hoveredRow, setHoveredRow] = useState<boolean[]>(
  //   Array(selectedPalette?.[selectedTab]?.ranges?.colors?.length).fill(false),
  // );

  const values = useMemo(() => {
    return palette?.ranges?.values;
  }, [palette]);

  const valueTypeIsLine = useMemo(() => {
    return currentTmoType[selectedTab] === 'line';
  }, [currentTmoType, selectedTab]);

  const colorPickerWidth = useMemo(() => {
    return item.lineWidth ?? 8;
  }, [item]);

  return (
    <>
      <TableRow key={index}>
        <TableCell>
          <input
            name="warning signal"
            type="checkbox"
            defaultChecked={item.warningSignal}
            onChange={() => {
              onToggleSongWarningCheck({
                index,
                colors: palette?.ranges?.colors,
                updatePalette,
              });
            }}
          />
        </TableCell>
        <TableCell style={{ width: '30%' }} align="left">
          {editedNameIndex === index ? (
            <Input
              type="text"
              value={editedName}
              onChange={handleNameChange}
              onBlur={() => handleNameBlur?.()}
            />
          ) : (
            <Typography variant="subtitle2" onClick={() => handleNameClick?.(index)}>
              {item.name}
            </Typography>
          )}
        </TableCell>
        {valueTypeIsLine && (
          <TableCell style={{ width: '20%' }} align="center">
            <Input
              value={item?.lineWidth || 8}
              disableUnderline
              fullWidth
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              size="small"
              onChange={(event) =>
                onChangeRowLineWidth({
                  value: event.target.value,
                  index,
                  colors: palette?.ranges?.colors,
                  updatePalette,
                })
              }
              inputProps={{
                step: 1,
                min: 1,
                max: 50,
                type: 'number',
                'aria-labelledby': 'line-width-input',
              }}
            />
            <Slider
              value={item?.lineWidth || 8}
              min={1}
              max={50}
              step={1}
              onChange={(event: any) =>
                onChangeRowLineWidth({
                  value: event.target.value,
                  index,
                  colors: palette?.ranges?.colors,
                  updatePalette,
                })
              }
              aria-labelledby="line-width-slider"
            />
          </TableCell>
        )}
        <TableCell style={{ width: '20%' }} align="center">
          <Input
            size="medium"
            disableUnderline
            type="color"
            value={item.hex}
            onChange={(event) =>
              onChangeRowColor({
                value: event.target.value,
                index,
                colors: palette?.ranges?.colors,
                updatePalette,
              })
            }
            inputProps={{
              style: {
                border: 0,
                padding: 0,
                width: valueTypeIsLine ? '4rem' : '2rem',
                height: valueTypeIsLine ? `${colorPickerWidth / 16 + 0.2}rem` : '1.3rem',
              },
            }}
          />
        </TableCell>
        {valType === 'bool' ||
          (valType === 'boolean' && (
            <TableCell style={{ width: '20%' }} align="center">
              <Tooltip
                title={`${translate('Will be used for parameters with value')} = "${
                  item.booleanValue ? translate('true') : translate('false')
                }"`}
                placement="top"
              >
                <Button
                  sx={{
                    minWidth: '130px',
                    color: item.hex,
                    background: `${item.hex}1A`,
                    border: 'none',
                    '&:hover': {
                      background: `${item.hex}33`,
                      border: 'none',
                    },
                  }}
                  variant="outlined"
                  startIcon={
                    item.booleanValue ? (
                      <CheckCircleRounded sx={{ color: `${item.hex} !important` }} />
                    ) : (
                      <DoNotDisturbOnRounded sx={{ color: `${item.hex} !important` }} />
                    )
                  }
                  onClick={handleBooleanValueClick}
                >
                  {item.name}
                </Button>
              </Tooltip>
            </TableCell>
          ))}

        {(valType === 'number' || valType === 'float' || valType === 'int') && (
          <>
            <TableCell style={{ width: '20%' }} align="left">
              {index === 0 ? (
                <Typography variant="subtitle2">{translate('Less than')}</Typography>
              ) : (
                <Input
                  disableUnderline={
                    values &&
                    (values[index - 2] === undefined ||
                      Number(values[index - 1]) > Number(values[index - 2])) &&
                    (values[index] === undefined ||
                      Number(values[index - 1]) < Number(values[index]))
                  }
                  error
                  fullWidth
                  value={values ? values[index - 1] : 20}
                  size="small"
                  onChange={(event) => {
                    onChangeRowValue({
                      value: event.target.value,
                      index,
                      values: palette?.ranges?.values,
                      colors: palette?.ranges?.colors,
                      updatePalette,
                    });
                  }}
                  inputProps={{
                    step: 0.1,
                    min: index === 0 ? values[index] : values[index - 2],
                    max: values[index],
                    'aria-labelledby': 'input-slider',
                  }}
                />
              )}
            </TableCell>
            <TableCell style={{ width: '20%' }} align="left">
              {index + 1 === palette?.ranges?.colors?.length ? (
                <Typography variant="subtitle2">{translate('And more')}</Typography>
              ) : (
                <Input
                  disableUnderline={
                    values &&
                    (values[index + 1] === undefined ||
                      Number(values[index]) < Number(values[index + 1])) &&
                    (values[index - 1] === undefined ||
                      Number(values[index]) > Number(values[index - 1]))
                  }
                  fullWidth
                  value={values ? values[index] : 80}
                  size="small"
                  error
                  onChange={(event) => {
                    onChangeRowValue({
                      value: event.target.value,
                      index: index + 1,
                      values: palette?.ranges?.values,
                      colors: palette?.ranges?.colors,
                      updatePalette,
                    });
                  }}
                  inputProps={{
                    step: 0.1,
                    min: values[index],
                    max: index === values.length - 2 ? values[index - 1] : values[index + 1],
                    'aria-labelledby': 'input-slider',
                  }}
                />
              )}
            </TableCell>
          </>
        )}
        <TableCell>
          {index === 0 ||
          index === (palette?.ranges?.colors?.length ?? 0) - 1 ||
          index === 999 ? null : (
            <IconButton
              onClick={() =>
                onRemoveColor({
                  index,
                  colors: palette?.ranges?.colors,
                  values: palette?.ranges?.values,
                  updatePalette,
                })
              }
              aria-label="delete"
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </TableCell>

        {index === (palette?.ranges?.colors?.length ?? 0) - 1 ||
        index === 999 ||
        valType === 'bool' ||
        valType === 'boolean' ? null : (
          <TableCell>
            <IconButton
              onClick={() => {
                onAddColor({
                  index,
                  colors: palette?.ranges?.colors,
                  values: palette?.ranges?.values,
                  updatePalette,
                });
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {/* {hoveredRow[index] && */}
      {/*  index !== (palette?.ranges?.colors.length ?? 0) - 1 && */}
      {/*  index !== 999 && */}
      {/*  valType !== 'bool' && */}
      {/*  valType !== 'boolean' && ( */}
      {/*    <TableRowStyled */}
      {/*      onMouseEnter={() => handleMouseRowEnter({ setHoveredRow, index })} */}
      {/*      onMouseLeave={() => handleMouseRowLeave({ setHoveredRow, index })} */}
      {/*      onClick={() => */}
      {/*        onAddColor({ */}
      {/*          index, */}
      {/*          colors: palette?.ranges?.colors, */}
      {/*          values: palette?.ranges?.values, */}
      {/*          updatePalette, */}
      {/*        }) */}
      {/*      } */}
      {/*    > */}
      {/*      <TableCell colSpan={5} align="left"> */}
      {/*        <Typography */}
      {/*          variant="subtitle2" */}
      {/*          display="flex" */}
      {/*          alignItems="center" */}
      {/*          justifyContent="center" */}
      {/*        > */}
      {/*          <Add fontSize="small" color="primary" /> */}
      {/*          {translate('Add a Tier')} */}
      {/*        </Typography> */}
      {/*      </TableCell> */}
      {/*    </TableRowStyled> */}
      {/*  )} */}
    </>
  );
};
