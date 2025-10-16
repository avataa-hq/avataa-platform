import styled from '@emotion/styled';

const TimelineDivider = styled.div`
  position: absolute;
  top: 0;
  width: 1px;
  background: ${({ theme }) => theme.palette.neutralVariant.outline};
`;

interface IProps {
  dividersList: number[];
}

export const GantChartDividers = ({ dividersList }: IProps) => {
  return dividersList.map((divider) => (
    <TimelineDivider key={divider} style={{ left: divider, height: '-webkit-fill-available' }} />
  ));
};
