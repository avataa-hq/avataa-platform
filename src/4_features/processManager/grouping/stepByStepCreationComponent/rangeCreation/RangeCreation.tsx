import { IInventoryFilterModel } from '6_shared';
import { Autocomplete, TextField, Typography, Checkbox, createFilterOptions } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  BetweenContainer,
  Body,
  BodyLeft,
  BodyRight,
  RangeCreationStyled,
} from './RangeCreation.styled';

const rangesToMinutes = {
  '5 minutes': 5,
  '15 minutes': 15,
  '30 minutes': 30,
  '1 hour': 60,
  '4 hours': 240,
  '12 hours': 720,
  '1 week': 10080,
};

export interface ITprmsListItem {
  label: string;
  id: number;
}

interface IRangeListItem {
  label: string;
  value: number;
}

const rangesItems: IRangeListItem[] = Object.entries(rangesToMinutes).map(([label, value]) => ({
  label,
  value,
}));

interface IProps {
  setRangesList?: (range: Record<string, IInventoryFilterModel[]> | null) => void;

  isActiveRanges?: boolean;
  setIsActiveRanges?: (isActiveRanges: boolean) => void;
  tprmList?: ITprmsListItem[];
}

export const RangeCreation = ({
  setRangesList,

  isActiveRanges,
  setIsActiveRanges,

  tprmList,
}: IProps) => {
  const [rangeTPRM, setRangeTPRM] = useState<ITprmsListItem | null>(null);

  const [value, setValue] = useState<IRangeListItem | null>(null);
  const [periodValue, setPeriodValue] = useState('');

  useEffect(() => {
    const selectedRangeTprmId = rangeTPRM?.id;

    if (selectedRangeTprmId && value != null) {
      setRangesList?.({
        endDate: [
          {
            rule: 'and',
            columnName: String(selectedRangeTprmId),
            filters: [{ operator: 'inPeriod', value: String(value.value) }],
          },
        ],
      });
    }
  }, [rangeTPRM?.id, setRangesList, value]);

  useEffect(() => {
    if (!rangeTPRM && tprmList && tprmList.length && isActiveRanges) {
      setRangeTPRM(tprmList[0]);
    }
  }, [rangeTPRM, tprmList, isActiveRanges]);

  const filter = createFilterOptions<IRangeListItem>();

  const handleInputChange = (event: any, newInputValue: any) => {
    if (/^\d*$/.test(newInputValue)) {
      setPeriodValue(newInputValue);
    }
  };

  return (
    <RangeCreationStyled>
      <BetweenContainer>
        <Checkbox
          checked={isActiveRanges}
          onChange={(_, checked) => {
            setIsActiveRanges?.(checked);
          }}
          sx={({ palette }) => ({ '& svg': { fill: palette.primary.main } })}
        />
        <Typography sx={{ opacity: isActiveRanges ? 1 : 0.5 }}>
          {isActiveRanges ? 'Turn off ranges' : 'Turn on ranges'}
        </Typography>
      </BetweenContainer>
      <Body sx={{ opacity: isActiveRanges ? 1 : 0.5 }}>
        <BodyLeft>
          <Typography>Range parameter</Typography>
          <Autocomplete
            disabled={!isActiveRanges}
            fullWidth
            options={tprmList ?? []}
            value={rangeTPRM}
            onChange={(_, val) => {
              setRangeTPRM(val);
            }}
            renderInput={(props) => <TextField {...props} />}
          />
        </BodyLeft>

        <BodyRight>
          <Typography>Select period</Typography>

          <Autocomplete
            disabled={!isActiveRanges || !rangeTPRM}
            fullWidth
            disableClearable
            onInputChange={handleInputChange}
            options={rangesItems}
            clearOnBlur
            handleHomeEndKeys
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              if (option.value) return String(option.value);
              return option.label;
            }}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            value={value ?? undefined}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setValue({ label: `${newValue} minute`, value: parseInt(newValue, 10) });
              } else if (newValue && newValue.value) {
                setValue({
                  label: `${newValue.value} minute`,
                  value: newValue.value,
                });
              } else {
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (
                params.inputValue !== '' &&
                !options.some((option) => option.label === `${params.inputValue} minute`)
              ) {
                filtered.push({
                  value: +params.inputValue,
                  label: `Set "${params.inputValue}" minute`,
                });
              }

              return filtered;
            }}
            renderInput={(props) => (
              <TextField
                {...props}
                type="number"
                inputProps={{
                  ...props.inputProps,
                  inputMode: 'numeric', // Ожидается ввод цифр на мобильных устройствах
                  pattern: '[0-9]*', // Ограничивает ввод только цифрами
                }}
              />
            )}
          />
        </BodyRight>
      </Body>
    </RangeCreationStyled>
  );
};
