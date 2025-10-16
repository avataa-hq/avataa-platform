import { useEffect, useMemo, useState } from 'react';
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Popover,
  MenuItem as MuiMenuItem,
  TableHead,
  TableCell,
  SxProps,
  alpha,
} from '@mui/material';
import { createEmptyRow } from '2_pages/adminSystemManagement/lib/createEmptyEventRow';
import { TablesResponseType } from '6_shared/api/clickhouse/types';
import { Box, ClickhouseSettings, useTranslate } from '6_shared';
import AddIcon from '@mui/icons-material/Add';
import { EvenstTablerStyled, StyledTableCellHeader } from './Events.styled';
import EventsRow, { IRow } from './EventsRow';

interface IProps {
  сlickhouseTableColumnsData: TablesResponseType | null;
  clickhouseSettingsEvents: any;
  setClickhouseConfig: React.Dispatch<React.SetStateAction<ClickhouseSettings | undefined>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EventsTable = ({
  сlickhouseTableColumnsData,
  clickhouseSettingsEvents,
  setClickhouseConfig,
  setHasChanges,
}: IProps) => {
  const translate = useTranslate();
  const [rows, setRows] = useState<IRow[]>([]);
  const [nestedRows, setNestedRows] = useState<IRow[][]>([[]]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedNestedRowIndex, setSelectedNestedRowIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (clickhouseSettingsEvents && typeof clickhouseSettingsEvents === 'object') {
      const keys = Object.keys(clickhouseSettingsEvents);

      const newRows = Object.keys(clickhouseSettingsEvents).map((key) => ({
        columnName: key,
        data: {
          name: clickhouseSettingsEvents[key]?.name || '',
          weight: clickhouseSettingsEvents[key]?.weight ?? '',
          relaxation_period: clickhouseSettingsEvents[key]?.relaxation_period || '',
          relaxation_function: clickhouseSettingsEvents[key]?.relaxation_function || '',
          aggregation: clickhouseSettingsEvents[key]?.aggregation || '',
          min: clickhouseSettingsEvents[key]?.min || '',
          max: clickhouseSettingsEvents[key]?.max || '',
          decimals: clickhouseSettingsEvents[key]?.decimals || '',
          direction: clickhouseSettingsEvents[key]?.direction || '',
          goal: clickhouseSettingsEvents[key]?.goal || '',
          group: clickhouseSettingsEvents[key]?.group || '',
          description: clickhouseSettingsEvents[key]?.description || '',
          unit: clickhouseSettingsEvents[key]?.unit || '',
          tics: clickhouseSettingsEvents[key]?.tics || '',
        },
      }));

      const newNestedRows: IRow[][] = keys.map(
        (key) => clickhouseSettingsEvents[key]?.nestedKpi || [],
      );

      setRows(newRows);
      setNestedRows(newNestedRows);
    } else {
      setRows([createEmptyRow()]);
      setNestedRows([[]]);
    }
  }, [clickhouseSettingsEvents]);

  const handleAddRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const handleRowContextMenu = (event: React.MouseEvent, index: number, nestedIndex?: number) => {
    setSelectedNestedRowIndex(nestedIndex ?? null);
    setSelectedRowIndex(index);

    if (rows.length === 1) return;

    event.preventDefault();
    setSelectedRowIndex(index);
    setMenuPosition({ top: event.clientY, left: event.clientX });
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleDeleteRow = () => {
    if (selectedNestedRowIndex != null && selectedRowIndex !== null) {
      const updatedNestedRows = [...nestedRows];
      updatedNestedRows[selectedRowIndex] = updatedNestedRows[selectedRowIndex].filter(
        (_, index) => index !== selectedNestedRowIndex,
      );
      setNestedRows(updatedNestedRows);
    }

    if (selectedNestedRowIndex == null && selectedRowIndex !== null && rows.length > 1) {
      const updatedRows = rows.filter((_, index) => index !== selectedRowIndex);
      setRows(updatedRows);
    }

    setAnchorEl(null);
    setSelectedNestedRowIndex(null);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleSaveChanges = () => {
    const formattedConfig = rows.reduce<{ [key: string]: IRow['data'] }>((acc, row, index) => {
      if (row.columnName) {
        acc[row.columnName] = {
          ...row.data,
          nestedKpi: nestedRows?.[index],
        };
      }
      return acc;
    }, {});

    // @ts-ignore
    setClickhouseConfig((prevConfig) => {
      if (!prevConfig) {
        return { events: formattedConfig };
      }

      return { ...prevConfig, events: formattedConfig };
    });

    setHasChanges(true);
  };

  const isSaveDisabled = rows.some(
    (row) =>
      !row.columnName ||
      !row.data.name ||
      row.data.weight === '' ||
      !row.data.relaxation_period ||
      !row.data.relaxation_function,
  );

  const headerNames: { value: string; sx?: SxProps }[] = useMemo(
    () => [
      { value: '', sx: { width: 20 } },
      { value: 'Column Name', sx: { minWidth: 200 } },
      { value: 'Name', sx: { minWidth: 200 } },
      { value: 'Weight', sx: { minWidth: 80 } },
      { value: 'Relaxation Period' },
      { value: 'Relaxation Function' },
      { value: 'Aggregation' },
      { value: 'min' },
      { value: 'max' },
      { value: 'decimals' },
      { value: 'direction' },
      // { value: 'Granularity' },
      { value: 'Group', sx: { minWidth: 150 } },
      { value: 'Description', sx: { minWidth: 200 } },
      { value: 'Unit' },
      { value: 'Goal', sx: { minWidth: 150 } },
    ],
    [],
  );

  const nestedHeaderNames = useMemo(
    () => headerNames.slice(1).filter((item) => item.value !== 'Group'),
    [headerNames],
  );

  const handleAddNestedRow = (newIndex: number) => {
    setNestedRows((prevRows) => {
      const newNestedRow = createEmptyRow();

      const newRows = prevRows.map((group, i) =>
        i === newIndex ? [...group, newNestedRow] : group,
      );

      if (!prevRows[newIndex]) {
        newRows[newIndex] = [newNestedRow];
      }

      return newRows;
    });
  };

  const filteredKpiColumns: TablesResponseType = useMemo(() => {
    const excludedNestedKpiNames =
      nestedRows?.flatMap((group) => group.map((item) => item.columnName)) ?? [];
    const excludedKpiNames = rows.map((item) => item.columnName);
    const allExcludedNames = [...excludedKpiNames, ...excludedNestedKpiNames];
    const availableColumns = сlickhouseTableColumnsData?.filter(
      (item) => !allExcludedNames.includes(item.name),
    );

    return availableColumns ?? [];
  }, [rows, сlickhouseTableColumnsData, nestedRows]);

  return (
    <EvenstTablerStyled>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headerNames.map((cell, i) => (
                <StyledTableCellHeader key={i} sx={cell.sx}>
                  {cell.value}
                </StyledTableCellHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <>
                  <EventsRow
                    key={index}
                    row={row}
                    rows={rows}
                    filteredKpiColumns={filteredKpiColumns}
                    index={index}
                    handleRowContextMenu={handleRowContextMenu}
                    setRows={setRows}
                    handleAddNestedRow={handleAddNestedRow}
                  />

                  {nestedRows?.[index]?.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={headerNames.length - 1}
                        sx={{
                          paddingBottom: 0,
                          paddingTop: 0,
                        }}
                      >
                        <Box component="div">
                          <Table
                            sx={{
                              marginLeft: 2,
                              // @ts-ignore
                              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            }}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                {nestedHeaderNames.map((cell, idx) => (
                                  <StyledTableCellHeader
                                    key={idx}
                                    sx={{ ...cell.sx, fontSize: '12px' }}
                                    // sx={{ minWidth: '120px', fontSize: '12px' }}
                                  >
                                    {cell.value}
                                  </StyledTableCellHeader>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {nestedRows[index].map((nestedRow, nestedIndex) => (
                                <EventsRow
                                  key={nestedIndex}
                                  row={nestedRow}
                                  rows={nestedRows[index]}
                                  filteredKpiColumns={filteredKpiColumns}
                                  index={index}
                                  nestedIndex={nestedIndex}
                                  handleRowContextMenu={handleRowContextMenu}
                                  setNestedRows={setNestedRows}
                                />
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Popover
        open={Boolean(anchorEl)}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: menuPosition.top,
          left: menuPosition.left,
        }}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            position: 'absolute',
            zIndex: 1300,
          },
        }}
      >
        <MuiMenuItem onClick={handleDeleteRow}>Delete</MuiMenuItem>
      </Popover>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginTop: 2,
          width: '100%',
          mb: '20px',
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={handleAddRow}
            color="primary"
            sx={{ marginLeft: '40px', '&:disabled': { color: 'grey', opacity: 0.4 } }}
            disabled={!filteredKpiColumns?.length}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Button variant="contained" onClick={handleSaveChanges} disabled={isSaveDisabled}>
          {translate('Save')}
        </Button>
      </Box>
    </EvenstTablerStyled>
  );
};
