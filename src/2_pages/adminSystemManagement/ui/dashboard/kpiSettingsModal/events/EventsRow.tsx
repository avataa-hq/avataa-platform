import {
  Box,
  Autocomplete,
  Button,
  IconButton,
  MenuItem,
  Popover,
  Select,
  TableRow,
  TextField,
  useTheme,
  Tooltip,
} from '@mui/material';
import { Visibility, Add, PlayArrow } from '@mui/icons-material';
import { AGGREGATION_TYPES } from '6_shared/api/clickhouse/constants';
import { TablesResponseType } from '6_shared/api/clickhouse/types';
import { useMemo, useState } from 'react';
import { StyledTableCell } from './Events.styled';
import { FormulaChart } from './FormulaChart';

interface IProps {
  row: IRow;
  rows: IRow[];
  filteredKpiColumns: TablesResponseType;
  index: number;
  nestedIndex?: number;
  handleRowContextMenu: (event: React.MouseEvent, index: number, nestedIndex?: number) => void;
  setRows?: (value: React.SetStateAction<IRow[]>) => void;
  setNestedRows?: (value: React.SetStateAction<IRow[][]>) => void;
  handleAddNestedRow?: (newIndex: number) => void;
}

type FieldType =
  | 'name'
  | 'weight'
  | 'relaxation_period'
  | 'relaxation_function'
  | 'aggregation'
  | 'min'
  | 'max'
  | 'decimals'
  | 'direction'
  | 'goal'
  | 'group'
  | 'description'
  | 'unit'
  | 'tics';

export interface IRow {
  columnName: string;
  data: {
    name: string;
    weight: string | number;
    relaxation_period: string;
    relaxation_function: string;
    aggregation: string;
    min: string;
    max: string;
    decimals: string;
    direction: string;
    goal: string;
    group: string;
    description: string;
    unit: string;
    nestedKpi?: IRow[];
    tics?: string;
  };
}

const EventsRow = ({
  row,
  rows,
  filteredKpiColumns,
  index,
  nestedIndex,
  handleRowContextMenu,
  setRows,
  setNestedRows,
  handleAddNestedRow,
}: IProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [settingFields, setSettingFields] = useState<SettingsField[]>(
  //   row?.data?.tics ? JSON.parse(row?.data?.tics) : [],
  // );

  const filteredKpiColumnsWitwCurrent = useMemo(() => {
    const currentName = row.columnName;
    return [...filteredKpiColumns, { name: currentName }];
  }, [filteredKpiColumns, row.columnName]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isEyeVisible = useMemo(() => {
    const isValidNumber = (value: string | number) =>
      Number(value) > 0 && !Number.isNaN(Number(value));

    const isValidFraction = (value: string) => {
      const [numerator, denominator] = value.split('/').map(Number);
      return numerator > 0 && denominator > 0;
    };

    const isValidPeriod = (value: string) => /^\d+d$/.test(value);

    return (
      row.columnName &&
      row.data.name &&
      isValidNumber(row.data.weight) &&
      isValidPeriod(row.data.relaxation_period) &&
      isValidFraction(row.data.relaxation_function)
    );
  }, [
    row.columnName,
    row.data.name,
    row.data.weight,
    row.data.relaxation_period,
    row.data.relaxation_function,
  ]);

  const handleRowChange = (field: FieldType, value: string | number) => {
    const updatedRows = [...rows];

    if (nestedIndex == null) {
      updatedRows[index].data[field] = String(value);

      if (field === 'relaxation_period') {
        const periodValue = String(value).replace('d', '');
        if (periodValue && !periodValue.endsWith('d')) {
          updatedRows[index].data[field] = `${periodValue}d`;
        }
      }

      setRows?.(updatedRows);
    }

    if (nestedIndex != null) {
      const updatedRow = {
        ...updatedRows[nestedIndex],
        data: {
          ...updatedRows[nestedIndex].data,
          [field]: String(value),
        },
      };

      if (field === 'relaxation_period') {
        const periodValue = String(value).replace('d', '');
        if (periodValue && !periodValue.endsWith('d')) {
          updatedRow.data[field] = `${periodValue}d`;
        }
      }

      updatedRows[nestedIndex] = updatedRow;

      setNestedRows?.((prev) =>
        prev.map((group, groupIdx) => (groupIdx === index ? updatedRows : group)),
      );
    }
  };

  const handleBlurRelaxationPeriod = () => {
    const updatedRows = [...rows];
    const relaxationPeriod = updatedRows[index].data.relaxation_period;

    if (relaxationPeriod && !relaxationPeriod.endsWith('d')) {
      updatedRows[index].data.relaxation_period = `${relaxationPeriod}d`;
    }

    setRows?.(updatedRows);
  };

  const commonTextFieldProps = {
    fullWidth: true,
    variant: 'standard' as const,
    InputProps: {
      disableUnderline: true,
      sx: { fontSize: '14px', padding: 0 },
    },
  };

  // const onAddSettingField = () => {
  //   setSettingFields((prev) => [...prev, { description: '', granularity: '' }]);
  // };

  // const onDeleteSettingField = (newIndex: number) => {
  //   setSettingFields((prev) => prev.filter((_, i) => i !== newIndex));
  // };

  // const onSaveSettingsClick = () => {
  //   handleRowChange('tics', JSON.stringify(settingFields));
  //   setIsModalOpen(false);
  // };

  // const handleOpenSettingsModal = () => {
  //   setIsModalOpen(true);
  // };

  const isNoAvailableKpi = useMemo(
    () =>
      filteredKpiColumnsWitwCurrent?.length === 1 &&
      filteredKpiColumnsWitwCurrent?.[0]?.name === row?.columnName,
    [filteredKpiColumnsWitwCurrent, row?.columnName],
  );

  return (
    <TableRow key={index} onContextMenu={(e: any) => handleRowContextMenu(e, index, nestedIndex)}>
      {nestedIndex == null && (
        <Tooltip title={isNoAvailableKpi ? 'No available KPI' : ''} placement="top">
          <StyledTableCell>
            <IconButton
              onClick={() => handleAddNestedRow?.(index)}
              size="small"
              disabled={isNoAvailableKpi}
            >
              <Add />
            </IconButton>
          </StyledTableCell>
        </Tooltip>
      )}
      <StyledTableCell>
        <Select
          value={row.columnName}
          onChange={(e) => {
            setRows?.((prev) =>
              prev.map((r, i) =>
                i === index ? { ...r, columnName: e.target.value as string } : r,
              ),
            );
            setNestedRows?.((prev) =>
              prev.map((nestedRow, groupIdx) =>
                groupIdx === index
                  ? nestedRow.map((r, i) =>
                      i === nestedIndex ? { ...r, columnName: e.target.value as string } : r,
                    )
                  : nestedRow,
              ),
            );
          }}
          displayEmpty
          fullWidth
          variant="standard"
          sx={{ fontSize: '14px', padding: 0, backgroundColor: 'inherit' }}
        >
          <MenuItem value="" disabled>
            Select column
          </MenuItem>
          {filteredKpiColumnsWitwCurrent?.map((item, i) => (
            <MenuItem value={item.name} key={i}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </StyledTableCell>
      <StyledTableCell>
        <Box
          component="div"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <TextField
            {...commonTextFieldProps}
            value={row.data.name}
            onChange={(e) => handleRowChange('name', e.target.value)}
            placeholder="Enter name"
          />
          <IconButton
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            sx={{
              marginLeft: '8px',
              padding: '4px',
              visibility: isEyeVisible ? 'visible' : 'hidden',
            }}
          >
            <Visibility />
          </IconButton>
        </Box>
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          type="number"
          value={row.data.weight}
          onChange={(e) => handleRowChange('weight', e.target.value)}
          placeholder="Enter weight"
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.relaxation_period}
          onChange={(e) => handleRowChange('relaxation_period', e.target.value)}
          onBlur={() => handleBlurRelaxationPeriod()}
          placeholder="Enter period (e.g., 7d)"
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.relaxation_function}
          onChange={(e) => handleRowChange('relaxation_function', e.target.value)}
          placeholder="Enter function (e.g., 1/2)"
        />
      </StyledTableCell>
      <StyledTableCell>
        <Autocomplete
          options={AGGREGATION_TYPES}
          disableClearable
          value={row.data.aggregation}
          onChange={(e, value) => {
            handleRowChange('aggregation', value);
          }}
          renderInput={(params) => <TextField {...params} variant="standard" />}
        />
      </StyledTableCell>

      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.min}
          onChange={(e) => handleRowChange('min', e.target.value)}
          placeholder="Enter min"
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.max}
          onChange={(e) => handleRowChange('max', e.target.value)}
          placeholder="Enter max"
        />
      </StyledTableCell>
      <StyledTableCell>
        <Tooltip title="Value must be between 0 and 6" placement="top">
          <TextField
            {...commonTextFieldProps}
            value={row.data.decimals}
            onChange={(e) => {
              const { value } = e.target;
              const numericValue = Number(value);
              if (value === '' || (numericValue >= 0 && numericValue <= 6)) {
                handleRowChange('decimals', value);
              }
            }}
            error={
              row.data.decimals !== '' &&
              (Number(row.data.decimals) < 0 || Number(row.data.decimals) > 6)
            }
            helperText={
              row.data.decimals !== '' &&
              (Number(row.data.decimals) < 0 || Number(row.data.decimals) > 6)
                ? 'Value must be between 0 and 10'
                : ''
            }
            placeholder="Enter decimals"
            inputProps={{
              type: 'number',
              min: 0,
              max: 6,
            }}
          />
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell>
        <Button
          value={row.data.direction}
          onClick={() => {
            const value = row.data.direction === 'up' ? 'down' : 'up';
            handleRowChange('direction', value);
          }}
          sx={{ backgroundColor: `${theme.palette.neutral.surface}` }}
        >
          <PlayArrow
            sx={{
              color: `${theme.palette.primary.main}`,
              rotate: row.data.direction === 'up' ? '270deg' : '90deg',
            }}
          />
        </Button>
      </StyledTableCell>

      {/* <StyledTableCell>
        <Autocomplete
          options={GRANULARITY_OPTIONS}
          disableClearable
          value={row.data.granularity}
          onChange={(e, value) => {
            handleRowChange('granularity', value);
          }}
          renderInput={(params) => <TextField {...params} variant="standard" />}
        />
      </StyledTableCell> */}
      {nestedIndex == null && (
        <StyledTableCell>
          <TextField
            {...commonTextFieldProps}
            value={row.data.group}
            onChange={(e) => handleRowChange('group', e.target.value)}
            placeholder="Enter group"
          />
        </StyledTableCell>
      )}
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.description}
          onChange={(e) => handleRowChange('description', e.target.value)}
          placeholder="Enter description"
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.unit}
          onChange={(e) => handleRowChange('unit', e.target.value)}
          placeholder="Enter unit"
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...commonTextFieldProps}
          value={row.data.goal}
          onChange={(e) => handleRowChange('goal', e.target.value)}
          placeholder="Enter goal"
        />
      </StyledTableCell>
      {/* <StyledTableCell>
        <IconButton onClick={handleOpenSettingsModal}>
          <Settings />
        </IconButton>
      </StyledTableCell> */}

      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 600,
            height: 350,
            padding: 2,
          },
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <FormulaChart row={row} />
      </Popover>

      {/* <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Tics Configuration</Typography>
            <Tooltip title="Color settings">
              <IconButton
                sx={{ width: '40px', height: '40px' }}
                onClick={() => toggleIsOpenColorSelecting({ module: selectedAdminTab })}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        }
        width={600}
        actions={
          <>
            <Button onClick={() => setIsModalOpen(false)}>{translate('Cancel')}</Button>
            <Button variant="contained" onClick={() => onSaveSettingsClick()}>
              {translate('Save')}
            </Button>
          </>
        }
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {settingFields.map((item, idx) => (
            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} key={idx}>
              <Box component="div">
                <Typography variant="body2">{translate('Description')}</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ minWidth: 120 }}
                  onChange={(e) => {
                    setSettingFields((prevState) => {
                      const newState = [...prevState];
                      newState[idx] = { ...newState[idx], description: e.target.value };
                      return newState;
                    });
                  }}
                  value={item.description}
                />
              </Box>
              <Box component="div">
                <Typography variant="body2">{translate('Granularity')}</Typography>
                <Autocomplete
                  options={['year']}
                  disableClearable
                  value={item.granularity || 'year'}
                  onChange={(e, value) => {
                    setSettingFields((prevState) => {
                      const newState = [...prevState];
                      newState[idx] = { ...newState[idx], granularity: value };
                      return newState;
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ minWidth: 120 }}
                />
              </Box>

              <Box component="div">
                <Typography variant="body2" sx={{ opacity: 0 }}>
                  Delete
                </Typography>
                <IconButton onClick={() => onDeleteSettingField(idx)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
          <IconButton onClick={onAddSettingField}>
            <AddRounded />
          </IconButton>
        </Box>
      </Modal> */}
    </TableRow>
  );
};

export default EventsRow;
