import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { createFormatter } from '../../lib';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  background: #020f2a;
  border-radius: 10px;
  padding: 10px;
  min-width: 200 px;
`;
const Row = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const Cell = styled.div`
  color: white;
`;

export const TooltipContent = <T extends Record<string, any> = Record<string, any>>({
  object,
}: {
  object?: T;
}) => {
  return (
    <Container>
      <Typography align="center" color="primary" variant="h1">
        {object?.name}
      </Typography>

      {Object.entries(object?.eventValues ?? {}).length === 0 && (
        <Row>
          <Typography color="inherit" variant="body1">
            No event data
          </Typography>
        </Row>
      )}

      {Object.entries(object?.eventValues ?? {}).map(([key, value]) => (
        <Row key={key}>
          <Cell>
            <Typography color="inherit" variant="body2">
              {key}:
            </Typography>
          </Cell>
          <Cell>
            <Typography color="inherit" variant="body1">
              {/* @ts-ignore */}
              {createFormatter(value?.valueDecimals ?? 2).format(value?.value)} {value?.unit}
            </Typography>
          </Cell>
        </Row>
      ))}
    </Container>
  );
};
