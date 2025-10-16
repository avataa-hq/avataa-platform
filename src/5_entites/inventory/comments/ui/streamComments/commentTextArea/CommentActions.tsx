import { Button } from '@mui/material';

export const CommentAction = ({ onClick }: { onClick: (clickType: 'cancel' | 'save') => void }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '5px',
      }}
    >
      <Button sx={{ height: '35px' }} variant="outlined.icon" onClick={() => onClick('save')}>
        Send
      </Button>
      <Button
        sx={({ palette }) => ({ height: '35px', background: palette.error.main })}
        variant="outlined.icon"
        onClick={() => onClick('cancel')}
      >
        Cancel
      </Button>
    </div>
  );
};
