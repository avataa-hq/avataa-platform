import { Theme } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';
import { PipelineSourceStatus } from '6_shared/api/dataview/types';

import { getBubbleSvgIconStyle } from 'theme/utils';

interface DiagramNodeProps {
  IconComponent: any;
  iconColor?: SvgIconProps['color'];
  theme: Theme;
  title: string;
  subtitle: string;
  status: PipelineSourceStatus | 'draft';
  badgeValue?: string | number;
  badgeColor?: string;
  type?: string;
}

const statusColors: { [key in PipelineSourceStatus]?: keyof Theme['palette']['common'] } = {
  waiting: 'lightDodgerBlue',
  deleted: 'amaranthRed',
};

export const DiagramNode = ({
  IconComponent,
  iconColor = 'primary',
  theme,
  title,
  subtitle,
  badgeValue,
  badgeColor = '#696B70',
  status,
  type,
}: DiagramNodeProps) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px',
        boxShadow: theme.shadows[10],
        padding: '10px',
        gap: '10px',
        ...(status !== 'draft' &&
          statusColors[status] !== undefined && {
            // @ts-ignore - There is a check for undefined
            border: `3px solid ${theme.palette.common[statusColors[status]]}`,
          }),
      }}
    >
      {type === 'branch' && (
        <div
          style={{
            backgroundColor: badgeColor,
            borderRadius: '50px',
            padding: '0 5px',
            position: 'absolute',
            width: 'fit-content',
            margin: '0 auto',
            left: '50%',
            top: '0',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: theme.palette.getContrastText(badgeColor),
              userSelect: 'none',
            }}
          >
            {title}
          </p>
        </div>
      )}
      <div style={{ minWidth: '40px', display: 'flex', alignItems: 'center' }}>
        <IconComponent
          xmlns="http://www.w3.org/2000/svg"
          style={{
            borderRadius: '50%',
            padding: '5px',
            aspectRatio: 1,
            ...getBubbleSvgIconStyle(theme, { color: iconColor }).style,
          }}
        />
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <p
            style={{
              fontSize: '12px',
              margin: 0,
              color: theme.palette.text.secondary,
              userSelect: 'none',
            }}
          >
            {subtitle}
          </p>
          {badgeValue !== undefined && (
            <div
              style={{
                alignSelf: 'start',
                backgroundColor: badgeColor,
                borderRadius: '50px',
                padding: '0 5px',
                boxShadow: theme.shadows[10],
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: theme.palette.getContrastText(badgeColor),
                  userSelect: 'none',
                }}
              >
                {badgeValue}
              </p>
            </div>
          )}
        </div>
        {type !== 'branch' && (
          <p style={{ fontSize: '14px', margin: 0, userSelect: 'none' }}>{title}</p>
        )}
      </div>
    </div>
  );
};
