import { Divider, Tooltip, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Fragment } from 'react';
import { IArcTooltip } from '../types';
import { createFormatter, truncateString } from '../../../lib';
import { useTranslate } from '../../../localization';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  width: 500px;
`;

const TargetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Cell = styled.div`
  display: flex;
  padding: 0 20px;
`;

const truncateLength = 40;

interface IProps {
  content: IArcTooltip;

  onContainerMouseEnter?: () => void;
  onContainerMouseLeave?: () => void;
}

export const ArcTooltipSimple = ({
  content,
  onContainerMouseEnter,
  onContainerMouseLeave,
}: IProps) => {
  const { mainValue } = content;
  const translate = useTranslate();
  const { format } = createFormatter(mainValue.valueDecimals ?? 2);

  return (
    <ContentContainer onMouseEnter={onContainerMouseEnter} onMouseLeave={onContainerMouseLeave}>
      <Row
        style={{
          justifyContent: 'center',
          gap: '10%',
          padding: '10px 0',
        }}
      >
        <Typography>{mainValue.label ?? '-'}</Typography>
        <Typography variant="body2">
          {format(mainValue.value)} {mainValue.unit ?? ''}
        </Typography>
      </Row>

      <Row
        style={{
          justifyContent: 'center',
          gap: '10%',
          padding: '10px 0',
        }}
      >
        <Typography>{translate('Description')}:</Typography>
        <Tooltip
          title={(mainValue.description || '').length > truncateLength ? mainValue.description : ''}
          placement="top"
        >
          <Typography variant="body2">
            {mainValue.description ? truncateString(mainValue.description, truncateLength) : '-'}
          </Typography>
        </Tooltip>
      </Row>
      {mainValue.marks && mainValue.marks.length > 0 && <Divider />}

      {mainValue.marks && mainValue.marks.length > 0 && (
        <>
          <Row>
            <Cell style={{ flex: 1 }}>
              <Typography variant="body1">{translate('Target')} :</Typography>
            </Cell>
            <Cell style={{ flex: 1, maxHeight: 200, overflowY: 'auto' }}>
              <Typography fontStyle="italic" variant="subtitle2">
                {mainValue.marks?.[0]?.description}
              </Typography>
            </Cell>
          </Row>
          <Divider />
        </>
      )}

      <TargetsContainer>
        {mainValue.marks?.map((target, idx) => (
          <Fragment key={`${target.value}-${idx}`}>
            <Row>
              <Cell style={{ flex: 1 }}>
                <Typography variant="subtitle2">{target.label}</Typography>
              </Cell>

              <Cell style={{ flex: 1 }}>
                <div style={{ padding: '5px' }}>
                  <div
                    style={{ background: target.color, width: 30, height: 10, borderRadius: '10%' }}
                  />
                </div>
              </Cell>
            </Row>
            <Divider />
          </Fragment>
        ))}
      </TargetsContainer>
    </ContentContainer>
  );
};
