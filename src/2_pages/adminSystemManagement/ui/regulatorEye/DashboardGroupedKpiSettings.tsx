import { useEffect, useState } from 'react';
import {
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import { ModuleSettingsType, objectStateApi, useTranslate } from '6_shared';
import { kpiResponse, GranularityResponse } from '6_shared/api/objectState/types';
import { TableRowComponent } from './TableRowComponent';

interface GroupedData {
  [key: string]: Record<string, string>;
}

export const DashboardGroupedKpiSettings = ({
  parentGroupName,
  groupName,
  strings,
  defaultModuleName,
  form,
  editModuleData,
  editRow,
  setEditRow,
  moduleSettings,
}: {
  parentGroupName: string;
  groupName: string;
  strings: Record<string, string>;
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editModuleData: ({ defaultModuleName, groupName, key, newValue }: EditModuleDataType) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleSettings: ModuleSettingsType;
}) => {
  const { useGetAllKpisQuery, useGetAllGranularitiesQuery } = objectStateApi;

  const translate = useTranslate();
  const regex = /^([a-zA-Z\s]+?)(\d+)/;

  const groupedData: GroupedData = Object.entries(strings).reduce(
    (acc: GroupedData, [key, value]) => {
      // const matches = key.match(/([a-zA-Z\s]+)(\d+)/);
      const matches = key.match(regex);
      if (matches) {
        const kpiGroupName = `${matches[1].trim()} ${matches[2]}`;
        if (!acc[kpiGroupName]) {
          acc[kpiGroupName] = {};
        }
        acc[kpiGroupName][key] = value;
      }
      return acc;
    },
    {},
  );

  const { control } = form;

  const [kpiValues, setKpiValues] = useState<kpiResponse[]>([]);
  const { data: allKpis } = useGetAllKpisQuery();

  useEffect(() => {
    if (!allKpis) return;
    setKpiValues(allKpis);
  }, [allKpis]);

  const [granularityValues, setGranularityValues] = useState<GranularityResponse[]>([]);
  const { data: allGranularities } = useGetAllGranularitiesQuery();

  useEffect(() => {
    if (!allGranularities) return;
    setGranularityValues(allGranularities);
  }, [allGranularities]);

  const headerCells = [
    { sx: { minWidth: 200 }, value: 'KPI type' },
    { sx: { minWidth: 200 }, value: 'KPI name' },
    { sx: { width: 150 }, value: 'min' },
    { sx: { width: 150 }, value: 'max' },
    { sx: { minWidth: 200 }, value: 'granularity' },
    { sx: { width: 150 }, value: 'decimals' },
    { sx: { width: 150 }, value: 'direction' },
  ];

  return (
    <Paper sx={{ padding: '1rem' }}>
      <ListItemText primary={translate(groupName as any)} />
      <TableContainer>
        <Table size="small">
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
            {Object.entries(groupedData).map(([kpiGroupName, kpiGroup]) => {
              return (
                <TableRowComponent
                  parentGroupName={parentGroupName}
                  kpiGroupName={kpiGroupName}
                  kpiGroup={kpiGroup}
                  key={kpiGroupName}
                  control={control}
                  defaultModuleName={defaultModuleName}
                  groupName={groupName}
                  moduleSettings={moduleSettings}
                  kpiValues={kpiValues}
                  granularityValues={granularityValues}
                  editRow={
                    editRow &&
                    editRow.some((row) =>
                      row.module_name.startsWith(`${defaultModuleName}/${groupName}/`),
                    )
                      ? editRow
                      : null
                  }
                  setEditRow={setEditRow}
                  editModuleData={editModuleData}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
