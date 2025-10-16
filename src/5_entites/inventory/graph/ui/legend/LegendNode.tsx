import { Typography } from '@mui/material';
import {
  LegendNodeContainer,
  LegendNodeExternalCircle,
  LegendNodeInnerCircle,
  LegendNodeLabelContainer,
  LegendNodeWrapper,
} from './GraphLegend.styled';

interface LegendNodeProps {
  name?: string;
  icon?: React.ReactNode;
  color?: string;
}

const MAX_NAME_LENGTH = 15;

export const LegendNode = ({ icon, name, color }: LegendNodeProps) => {
  return (
    <LegendNodeWrapper>
      <LegendNodeContainer>
        <LegendNodeExternalCircle color={color}>
          <LegendNodeInnerCircle color={color}>{icon}</LegendNodeInnerCircle>
        </LegendNodeExternalCircle>
        <LegendNodeLabelContainer>
          <Typography fontSize={9} lineHeight="11px">
            {(name?.length ?? 0) > MAX_NAME_LENGTH
              ? `${name?.slice(0, MAX_NAME_LENGTH).trim()}...`
              : name}
          </Typography>
        </LegendNodeLabelContainer>
      </LegendNodeContainer>
    </LegendNodeWrapper>
  );
};
