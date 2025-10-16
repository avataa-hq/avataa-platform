import { Button, Drawer, Typography, useTheme } from '@mui/material';
import { SeverityProcessModelData } from '6_shared';
import { useState } from 'react';

interface IProps {
  warningRows: SeverityProcessModelData[];
  onWarningProcessClick?: (process: SeverityProcessModelData) => void;
}

export const WarningObjectsList = ({ warningRows, onWarningProcessClick }: IProps) => {
  const { palette } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onProcessClick = (process: SeverityProcessModelData) => {
    setIsDrawerOpen(false);
    onWarningProcessClick?.(process);
  };

  return (
    <>
      <div style={{ position: 'absolute', bottom: '7%', right: '1%', zIndex: 10 }}>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          style={{
            cursor: 'pointer',
            borderRadius: '50%',
            backgroundColor: palette.neutral.surfaceContainerHigh,
            padding: '15px',
            boxShadow: '-6px 3px 5px -7px rgb(0, 0, 0, 0.5)',
            width: '40px',
            height: '40px',
            outline: 'none',
            border: 'none',

            aspectRatio: '1/1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: palette.text.primary,
          }}
        >
          <Typography>{warningRows.length}</Typography>
        </button>
      </div>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div
          style={{
            width: '300px',
            height: '100%',
            padding: '20px',
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          {warningRows.map((row, idx) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
            <Button
              type="button"
              onClick={() => onProcessClick(row)}
              key={`${row.id}-${idx}`}
              style={{
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                // borderBottom: `1px solid ${palette.neutralVariant.outline}`,
                border: `1px solid ${palette.neutralVariant.outline}`,
                borderRadius: '10px',
                padding: '10px',
              }}
            >
              <Typography color="primary" variant="body2">
                {row.name || 'No name'}
              </Typography>
              <Typography color="warning.main" variant="subtitle1">
                Severity: {row.severityValue}
              </Typography>

              {row.isNew && (
                <Typography
                  variant="caption"
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '10px',
                  }}
                >
                  new
                </Typography>
              )}
            </Button>
          ))}
        </div>
      </Drawer>
    </>
  );
};
