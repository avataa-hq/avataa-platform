import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionSummary,
  Card,
  CardProps,
  Typography,
} from '@mui/material';

interface CollapsibleCardProps extends CardProps {
  title?: string;
  defaultExpanded?: boolean;
  ContentSx?: AccordionDetailsProps['sx'];
  testId?: string;
}

export const CollapsibleCard = ({
  title,
  children,
  sx,
  defaultExpanded,
  ContentSx,
  testId = undefined,
  ...props
}: CollapsibleCardProps) => {
  return (
    <Card sx={{ p: 0, overflow: 'visible', ...sx }} {...props}>
      <Accordion
        elevation={0}
        defaultExpanded={defaultExpanded}
        sx={{ borderRadius: 'inherit !important' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            px: '20px',
            '& .MuiAccordionSummary-content': {
              my: '20px',
            },
          }}
          data-testid={testId}
        >
          <Typography variant="h3">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: '0px 20px 20px', ...ContentSx }}>{children}</AccordionDetails>
      </Accordion>
    </Card>
  );
};
