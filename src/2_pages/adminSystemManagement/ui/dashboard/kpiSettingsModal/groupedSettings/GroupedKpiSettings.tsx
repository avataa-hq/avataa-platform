import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Control, FieldValues } from 'react-hook-form';
import { EditDashboardKpiData } from '2_pages/adminSystemManagement/model';
import { EventType, ModuleSettingsType, objectStateApi, useTranslate } from '6_shared';
import { GranularityResponse } from '6_shared/api/objectState/types';
import { AddRounded } from '@mui/icons-material';
import type { KpiDetails } from './ExistingKpiSettings';
import { TableRowComponent } from './TableRowComponent';

export type EventValue = {
  id: string;
  name: string;
  label: string;
  val_type: string;
  granularity: string;
};

export const emptyKpi = {
  ID: '',
  min: '',
  max: '',
  'Granularity ID': '',
  decimals: '2',
  direction: 'up',
};

interface IProps {
  groupName: string;
  tmoName: string;
  strings: Record<string, KpiDetails>;
  defaultModuleName: string;
  hierarchyId: string;
  tmoId: string;
  lvlId: string;
  subgroup: string;
  control: Control<FieldValues, any>;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  type: 'main' | 'additional';
  events: { [key: string]: EventType };
}

export const GroupedKpiSettings = ({
  groupName,
  tmoName,
  strings,
  defaultModuleName,
  hierarchyId,
  tmoId,
  lvlId,
  subgroup,
  control,
  editDashboardKpiData,
  editRow,
  setEditRow,
  type,
  events,
}: IProps) => {
  const { useGetAllGranularitiesQuery } = objectStateApi;

  const translate = useTranslate();

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const addNewKpi = useCallback(() => {
    editDashboardKpiData({
      module: defaultModuleName,
      hierarchyId,
      tmoName,
      subgroup,
      groupId: `${tmoId}-${lvlId}`,
      kpiConsecutiveValue: `KPI ${Object.keys(strings).length + 1}`,
      emptyKpi,
      action: 'add',
    });
  }, [
    editDashboardKpiData,
    defaultModuleName,
    hierarchyId,
    lvlId,
    subgroup,
    tmoId,
    tmoName,
    strings,
  ]);

  const handleExpandRow = useCallback(
    (key: string, action: string) => {
      setExpandedRows((prevExpandedRows) => ({
        ...prevExpandedRows,
        [key]: !prevExpandedRows[key],
      }));

      if (!strings[`${key} additional`] && action !== 'delete') {
        editDashboardKpiData({
          module: defaultModuleName,
          hierarchyId,
          tmoName,
          subgroup,
          groupId: `${tmoId}-${lvlId}`,
          kpiConsecutiveValue: `${key} additional`,
          emptyKpi,
          action: 'add',
        });
      }
    },
    [
      defaultModuleName,
      editDashboardKpiData,
      hierarchyId,
      lvlId,
      strings,
      subgroup,
      tmoId,
      tmoName,
    ],
  );

  const filteredKpis = useMemo(() => {
    return Object.fromEntries(
      Object.entries(strings).filter(([key]) => !/additional$/i.test(key.trim())),
    );
  }, [strings]);

  const values = useMemo((): Record<string, KpiDetails> => {
    if (type === 'additional') return filteredKpis;
    const kpiKeys = Object.keys(filteredKpis);

    if (kpiKeys.length >= 3) {
      return filteredKpis;
    }
    const emptyKpis = Array.from({ length: 3 - kpiKeys.length }, (_, index) => ({
      [`KPI ${kpiKeys.length + index + 1}`]: { ...emptyKpi },
    }));

    return { ...filteredKpis, ...Object.assign({}, ...emptyKpis) };
  }, [filteredKpis, type]);

  const eventKeys = useMemo(() => {
    if (!events) return [];
    return Object.entries(events).map(([evKey, evData]) => ({
      id: evKey,
      name: evData.name,
      label: evKey,
      val_type: 'number',
      granularity: evData.granularity || '',
    }));
  }, [events]);

  const [granularityValues, setGranularityValues] = useState<GranularityResponse[]>([]);
  const { data: allGranularities } = useGetAllGranularitiesQuery();

  useEffect(() => {
    if (!allGranularities) return;
    setGranularityValues(allGranularities);
  }, [allGranularities]);

  const headerCells: {
    sx: { width?: number; minWidth?: number; textAlignLast?: string };
    value: string;
  }[] = [
    { sx: { minWidth: 35 }, value: '' },
    { sx: { minWidth: 200 }, value: 'event' },
    { sx: { width: 150, textAlignLast: 'center' }, value: 'min' },
    { sx: { width: 150, textAlignLast: 'center' }, value: 'max' },
    // { sx: { minWidth: 200 }, value: 'granularity' },
    { sx: { minWidth: 200 }, value: 'aggregation' },
    { sx: { width: 150, textAlignLast: 'center' }, value: 'decimals' },
    { sx: { width: 150, textAlignLast: 'center' }, value: 'direction' },
    { sx: { width: 50 }, value: '' },
  ];

  const additionalKpis = useMemo(() => {
    return Object.fromEntries(
      Object.entries(strings).filter(([key]) => /additional$/i.test(key.trim())),
    );
  }, [strings]);

  return (
    <Paper sx={{ padding: '1rem' }}>
      <ListItemText primary={translate(groupName as any)} />
      <TableContainer>
        <Table size="small">
          {Object.entries(values).length ? (
            <TableHead>
              <TableRow>
                {(type === 'main' ? headerCells : headerCells.slice(1)).map((cell) => (
                  <TableCell key={cell.value} sx={cell.sx}>
                    {cell.value}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {Object.entries(values).map(([kpiGroupName, kpiGroup]) => {
              const additionalKey = `${kpiGroupName} additional`;
              const additionalKpiGroup = additionalKpis[additionalKey];

              return (
                <>
                  <TableRowComponent
                    type={type}
                    kpiGroupName={kpiGroupName}
                    kpiGroup={kpiGroup as Record<string, string>}
                    key={`${lvlId}-${kpiGroupName}`}
                    hierarchyId={hierarchyId}
                    tmoId={tmoId}
                    lvlId={lvlId}
                    tmoName={tmoName}
                    subgroup={subgroup}
                    control={control}
                    defaultModuleName={defaultModuleName}
                    groupName={`${tmoId}-${lvlId}-%${groupName}`}
                    kpiValues={eventKeys}
                    granularityValues={granularityValues}
                    editRow={
                      editRow?.[0]?.module_name?.startsWith(
                        `${defaultModuleName}/${tmoId}-${lvlId}-${groupName}/`,
                      )
                        ? editRow
                        : null
                    }
                    setEditRow={setEditRow}
                    editDashboardKpiData={editDashboardKpiData}
                    handleExpandRow={handleExpandRow}
                    expandedRows={expandedRows}
                    additionalKpiGroup={JSON.stringify(additionalKpiGroup)}
                  />

                  {type === 'main' && additionalKpiGroup && (
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse
                          in={expandedRows?.[`${kpiGroupName}`]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                {headerCells.map((cell) => (
                                  <TableCell key={cell.value} sx={cell.sx}>
                                    {cell.value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRowComponent
                                type={type}
                                kpiGroupName={additionalKey}
                                kpiGroup={additionalKpiGroup as Record<string, string>}
                                key={`${lvlId}-${additionalKey}`}
                                hierarchyId={hierarchyId}
                                tmoId={tmoId}
                                lvlId={lvlId}
                                tmoName={tmoName}
                                subgroup={subgroup}
                                control={control}
                                defaultModuleName={defaultModuleName}
                                groupName={`${tmoId}-${lvlId}-%${groupName}`}
                                kpiValues={eventKeys.filter((item) => item.label !== kpiGroup.ID)}
                                granularityValues={granularityValues}
                                editRow={
                                  editRow?.[0]?.module_name?.startsWith(
                                    `${defaultModuleName}/${tmoId}-${lvlId}-${groupName}/`,
                                  )
                                    ? editRow
                                    : null
                                }
                                setEditRow={setEditRow}
                                editDashboardKpiData={editDashboardKpiData}
                              />
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {(type === 'additional' || type === 'main') && (
        <Box
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconButton onClick={addNewKpi}>
            <AddRounded />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};
