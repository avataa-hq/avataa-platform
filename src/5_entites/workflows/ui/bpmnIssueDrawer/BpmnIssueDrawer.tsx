import { useTranslate } from '6_shared';
import { Box, Divider, Drawer, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { IBpmnIssue } from '5_entites/workflows/model';

interface IProps {
  isIssueDrawerOpen: boolean;
  setIsIssueDrawerOpen: (value: boolean) => void;
  zeebeVersion: string;
  bpmnIssues: IBpmnIssue[];
  handleIssueClick: (issueId: string) => void;
}

export const BpmnIssueDrawer = ({
  isIssueDrawerOpen,
  setIsIssueDrawerOpen,
  zeebeVersion,
  bpmnIssues,
  handleIssueClick,
}: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  return (
    <Drawer
      anchor="bottom"
      open={isIssueDrawerOpen}
      onClose={() => setIsIssueDrawerOpen(false)}
      hideBackdrop
      variant="persistent"
      PaperProps={{
        sx: {
          position: 'absolute',
          background: theme.palette.background.default,
        },
      }}
    >
      <Box component="div" sx={{ height: '300px', overflow: 'hidden', padding: '10px' }}>
        <Box
          component="div"
          sx={{ display: 'flex', justifyContent: 'space-between', height: '10%' }}
        >
          <Typography>{translate('Issues')}</Typography>
          {zeebeVersion && <Typography>Zeebe {zeebeVersion}</Typography>}
          <IconButton size="small" onClick={() => setIsIssueDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="div"
          sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '90%' }}
        >
          {bpmnIssues.map((issue, index) => (
            <Box
              component="div"
              key={issue.id}
              sx={{
                display: 'flex',
                gap: '10px',
                padding: '5px',
                borderTop: index === 0 ? `1px solid ${theme.palette.neutralVariant.icon}` : 'none',
                borderBottom: `1px solid ${theme.palette.neutralVariant.icon}`,
                borderRight: `1px solid ${theme.palette.neutralVariant.icon}`,
                borderLeft: `1px solid ${theme.palette.neutralVariant.icon}`,
                cursor: 'pointer',
                '&:hover': { background: theme.palette.info.main },
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => handleIssueClick(issue.id)}
            >
              {issue.category === 'error' && <ErrorIcon color="error" fontSize="small" />}
              {issue.category === 'warn' && <WarningIcon color="warning" fontSize="small" />}
              <Typography sx={{ width: '30%' }}>{issue.id}</Typography>
              <Divider orientation="vertical" flexItem />
              <Typography>{issue.message}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};
