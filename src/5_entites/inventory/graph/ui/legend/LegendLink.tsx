import { alpha, useTheme } from '@mui/material';

import { LineSvg, LineType, lineTypes } from '6_shared';
import { ExpandIcon } from '6_shared/ui/icons/ExpandIcon';

import { LegendLinkContainer, LegendLinkIcon } from './GraphLegend.styled';
import { useLinkStyleMap } from '../../builder';

interface LegendLinkProps {
  color?: string;
  graphLinkType?: string;
  icon: string | null;
  geometryType: string | null | 'graph-link';
}

export const LegendLink = ({ geometryType, icon, graphLinkType, color }: LegendLinkProps) => {
  const theme = useTheme();
  const linkStyleMap = useLinkStyleMap();
  const linkStyle = linkStyleMap[graphLinkType ?? 'default'];

  return (
    <LegendLinkContainer>
      {geometryType === 'graph-link' ? (
        <>
          <svg
            viewBox="0 0 70 20"
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          >
            <path
              d="M5,10 H65"
              stroke={alpha(theme.palette.text.primary, 0.4)}
              {...linkStyle}
              strokeDasharray={linkStyle.strokeDasharray?.join(',')}
            />
          </svg>
          {(graphLinkType === 'collapsed' || graphLinkType === 'geometry_line') && (
            <LegendLinkIcon>
              <ExpandIcon sx={{ fontSize: 11, color: theme.palette.primary.contrastText }} />
            </LegendLinkIcon>
          )}
        </>
      ) : (
        <LineSvg
          lineType={geometryType ? lineTypes[icon as LineType] : lineTypes.blank}
          color={color ?? theme.palette.primary.main}
        />
      )}
    </LegendLinkContainer>
  );
};
