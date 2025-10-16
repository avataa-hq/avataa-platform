import styled from '@emotion/styled';
import { Divider, Typography } from '@mui/material';
import { IColoredLineData } from './types';
import { createFormatter } from '../../lib';
import { useTranslate } from '../../localization';

const TooltipContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  gap: 5px;
  padding: 20px;
  opacity: 0.8;
  z-index: 1000;
  min-width: 200px;
`;

const TooltipRow = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: center;
`;

interface ITooltipProps {
  data: IColoredLineData;
}

export const Tooltip = ({ data }: ITooltipProps) => {
  const { format } = createFormatter(data.valueDecimals ?? 10);
  const translate = useTranslate();
  return (
    <TooltipContentStyled>
      <TooltipRow>
        <Typography>{translate('Fact value')}:</Typography>
        <Typography>{format(data.value != null ? +data.value : 0)}</Typography>
      </TooltipRow>
      {data.expectedValue != null && !isNaN(data.expectedValue) && (
        <TooltipRow>
          <Typography>{translate('Expected value')}:</Typography>
          <Typography>{format(data.expectedValue)}</Typography>
        </TooltipRow>
      )}

      <TooltipRow>
        <Typography>{translate('Current date')}:</Typography>
        <Typography>{data.date}</Typography>
      </TooltipRow>

      {data.prevPeriodDate && (
        <TooltipRow>
          <Typography>{translate('Comparison date')}:</Typography>
          <Typography>{data.prevPeriodDate}</Typography>
        </TooltipRow>
      )}

      <Divider />

      <TooltipRow>
        <Typography>{translate('Target value')}:</Typography>
        <Typography>{data.comparisonZeroPoint}</Typography>
      </TooltipRow>
    </TooltipContentStyled>
  );
};
