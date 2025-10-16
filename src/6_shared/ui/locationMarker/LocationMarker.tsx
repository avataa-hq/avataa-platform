import { RoomRounded } from '@mui/icons-material';
import { alpha } from '@mui/system';

// This component is written using only plain HTML and CSS. This makes it to work after passing it to renderToString() function.
export const LocationMarker = ({
  IconComponent = RoomRounded,
  title,
  subtitle,
  color = '#3261FF',
  textColor = '#111729',
  labelBackgroundColor = '#fff',
}: {
  IconComponent?: any;
  title?: string;
  subtitle?: string;
  color?: string;
  textColor?: string;
  labelBackgroundColor?: string;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div>
        <div
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: alpha(color, 0.2),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3px',
            }}
          >
            {IconComponent && (
              <IconComponent style={{ fill: '#fff', width: '100%', height: '100%' }} />
            )}
          </div>
        </div>
      </div>
      {(title || subtitle) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '5px 10px',
            backgroundColor: labelBackgroundColor,
            borderRadius: '10px',
            boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.05)',
          }}
        >
          <span
            style={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: textColor,
              userSelect: 'none',
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                textAlign: 'center',
                fontWeight: '400',
                color: textColor,
                userSelect: 'none',
                fontSize: '11px',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
