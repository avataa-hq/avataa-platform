import { CSSProperties } from 'react';
import { Theme } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material';

interface LinkLabelProps {
  IconComponent?: any;
  theme: Theme;
  title: string;
  iconStyle?: SvgIconProps['style'];
  containerStyle?: CSSProperties;
}

export const LinkLabel = ({
  IconComponent,
  theme,
  title,
  iconStyle,
  containerStyle,
}: LinkLabelProps) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '5px',
        boxShadow: theme.shadows[10],
        padding: '5px',
        gap: '5px',
        border: `2px solid ${theme.palette.primary.main}`,
        ...containerStyle,
      }}
    >
      {IconComponent && (
        <div style={{ minWidth: '20px', display: 'flex', alignItems: 'center' }}>
          <IconComponent xmlns="http://www.w3.org/2000/svg" style={iconStyle} />
        </div>
      )}
      <div
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}
      >
        <p style={{ fontSize: '14px', margin: 0, userSelect: 'none' }}>{title}</p>
      </div>
    </div>
  );
};
