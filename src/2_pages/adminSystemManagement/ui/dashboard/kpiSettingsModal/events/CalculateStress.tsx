import React, { useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ClickhouseSettings } from '6_shared';

interface IProps {
  clickhouseSettings: any;
  setClickhouseConfig: React.Dispatch<React.SetStateAction<ClickhouseSettings | undefined>>;
}

export const CalculateStress = ({ clickhouseSettings, setClickhouseConfig }: IProps) => {
  const [isCalculateStressEnabled, setIsCalculateStressEnabled] = useState(
    clickhouseSettings?.calculate_stress || false,
  );
  const [defaultKpi, setDefaultKpi] = useState(clickhouseSettings?.defaultKpi?.name || '');
  const [sizeKpi, setSizeKpi] = useState(clickhouseSettings?.sizeKpi?.name || '');

  const kpiOptions: { name: string }[] = useMemo(
    () => Object.values(clickhouseSettings?.events || {}),
    [clickhouseSettings?.events],
  );

  const handleDefaultKpiChange = (e: SelectChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    setDefaultKpi(value);
    // @ts-ignore
    setClickhouseConfig((prev) => ({
      ...prev,
      defaultKpi: kpiOptions.find((option) => option.name === value) ?? value,
    }));
  };

  const handleSizeKpiChange = (e: SelectChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    setSizeKpi(value);
    // @ts-ignore
    setClickhouseConfig((prev) => ({
      ...prev,
      sizeKpi: kpiOptions.find((option) => option.name === value) ?? value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsCalculateStressEnabled(checked);
    // @ts-ignore
    setClickhouseConfig((prev) => ({
      ...prev,
      calculate_stress: checked,
    }));
  };

  return (
    <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <Box component="div">
        <FormControl variant="outlined" sx={{ textWrapMode: 'nowrap' }}>
          <FormControlLabel
            control={
              <Checkbox checked={isCalculateStressEnabled} onChange={handleCheckboxChange} />
            }
            label="Calculate Stress"
          />
        </FormControl>
      </Box>

      <FormControl sx={{ width: '50%' }}>
        <InputLabel id="default-kpi-label" sx={{ top: '-5px' }}>
          Default KPI
        </InputLabel>
        <Select
          labelId="default-kpi-label"
          value={defaultKpi}
          onChange={handleDefaultKpiChange}
          label="Default KPI"
        >
          <MenuItem value="">None</MenuItem>
          {kpiOptions?.map((item, i) => (
            <MenuItem value={item.name} key={i}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: '50%' }}>
        <InputLabel id="size-kpi-label" sx={{ top: '-5px' }}>
          Size KPI
        </InputLabel>
        <Select
          labelId="size-kpi-label"
          value={sizeKpi}
          onChange={handleSizeKpiChange}
          label="Size KPI"
        >
          <MenuItem value="">None</MenuItem>
          {kpiOptions?.map((item, i) => (
            <MenuItem value={item.name} key={i}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
