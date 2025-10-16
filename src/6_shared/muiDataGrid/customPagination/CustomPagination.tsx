import { KeyboardEvent, useEffect, useState } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Box, useTranslate } from '6_shared';
import { GridPaginationModel } from '@mui/x-data-grid-premium';
import {
  PaginationContainer,
  PaginationBlock,
  PaginationSelect,
  PaginationButton,
  PaginationButtonLeft,
  PaginationButtonRight,
  PaginationInput,
} from './CustomPagination.styled';

interface IProps {
  paginationLimit: number;
  paginationOffset: number;
  changePaginationParam: (value: number, param: keyof GridPaginationModel) => void;
  paginationOptions?: number[];
  totalCount: number;
  navigationDisabled: boolean;
  isPagination: boolean;
}

declare module '@mui/x-data-grid' {
  interface PaginationPropsOverrides extends IProps {}
}

export const CustomPagination = ({
  paginationLimit,
  paginationOffset,
  changePaginationParam,
  paginationOptions,
  totalCount,
  navigationDisabled,
  isPagination,
}: IProps) => {
  const translate = useTranslate();

  const [offsetInputValue, setOffsetInputValue] = useState<number>(paginationOffset);

  const onLimitChange = (event: SelectChangeEvent) => {
    return changePaginationParam(+event.target.value, 'pageSize');
  };

  const onOffsetChange = (value: number) => changePaginationParam(value, 'page');

  useEffect(() => {
    setOffsetInputValue(paginationOffset + 1);
  }, [paginationOffset]);

  const resultsMaxValue =
    paginationLimit * (paginationOffset + 1) > totalCount
      ? totalCount
      : paginationLimit * (paginationOffset + 1);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key, ctrlKey, metaKey } = event;
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'ArrowLeft',
      'ArrowRight',
      'Enter',
      'Backspace',
    ];

    if (!allowedKeys.includes(key) && !ctrlKey && !metaKey) {
      event.preventDefault();
    }

    if (event.key === 'Enter') {
      changePaginationParam(offsetInputValue - 1, 'page');
    }
  };

  useEffect(() => {
    if (offsetInputValue > Math.floor(totalCount / paginationLimit)) {
      changePaginationParam(Math.floor(totalCount / paginationLimit), 'page');
      setOffsetInputValue(Math.floor(totalCount / paginationLimit) + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetInputValue, paginationLimit, totalCount]);

  useEffect(() => {
    if (offsetInputValue < 1) setOffsetInputValue(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetInputValue]);

  if (isPagination)
    return (
      <PaginationContainer>
        <PaginationBlock>
          <PaginationSelect
            value={String(paginationLimit)}
            // @ts-ignore
            onChange={onLimitChange}
            disabled={navigationDisabled}
          >
            {paginationOptions?.map((pageQty) => (
              <MenuItem value={pageQty} key={pageQty}>
                {pageQty}
              </MenuItem>
            ))}
          </PaginationSelect>
          <Box>
            {translate('Results')}: <b>{paginationLimit * paginationOffset + 1}</b> -{' '}
            <b>{resultsMaxValue} </b> of <b>{totalCount}</b>
          </Box>
        </PaginationBlock>
        <PaginationBlock>
          <PaginationButtonLeft
            color="primary"
            onClick={() => onOffsetChange(0)}
            disabled={navigationDisabled || paginationOffset === 0}
          >
            <FirstPageIcon />
          </PaginationButtonLeft>
          <PaginationButton
            color="primary"
            onClick={() => onOffsetChange(paginationOffset - 1)}
            disabled={navigationDisabled || paginationOffset === 0}
          >
            <KeyboardArrowLeftIcon />
          </PaginationButton>
          <PaginationInput
            InputProps={{ sx: { borderRadius: 0 }, disableUnderline: true }}
            variant="standard"
            type="number"
            value={offsetInputValue}
            onFocus={(event) => {
              event.target.select();
            }}
            onChange={(event) => {
              const enteredValue = event.target.value;
              const numericValue = parseInt(enteredValue, 10);
              if (!Number.isNaN(numericValue)) {
                setOffsetInputValue(numericValue);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={navigationDisabled}
          />
          <PaginationButton
            color="primary"
            onClick={() => onOffsetChange(paginationOffset + 1)}
            disabled={navigationDisabled || totalCount <= (paginationOffset + 1) * paginationLimit}
          >
            <KeyboardArrowRightIcon />
          </PaginationButton>
          <PaginationButtonRight
            color="primary"
            disabled={navigationDisabled || totalCount <= (paginationOffset + 1) * paginationLimit}
            onClick={() => onOffsetChange(Math.floor(totalCount / paginationLimit))}
          >
            <LastPageIcon />
          </PaginationButtonRight>
        </PaginationBlock>
      </PaginationContainer>
    );

  return null;
};
