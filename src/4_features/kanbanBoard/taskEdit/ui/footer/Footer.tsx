import { Button, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { CustomPalette } from 'theme/types';
import { FooterButtonsContainer, FooterContentContainer, FooterStyled } from './Footer.styled';

const activityList = [
  { label: 'Attachment', value: 'attachment' },
  { label: 'Comments', value: 'comments' },
  { label: 'History', value: 'history' },
];

export interface IFooterProps {
  commentsComponent?: ReactNode;
  attachmentComponent?: ReactNode;
  historyComponent?: ReactNode;
  actionsSlot?: ReactNode;
}

export const Footer = ({
  attachmentComponent,
  commentsComponent,
  historyComponent,
  actionsSlot,
}: IFooterProps) => {
  const [activeTab, setActiveTab] = useState('attachment');

  return (
    <FooterStyled>
      <FooterButtonsContainer
        onClick={(event) => {
          // @ts-ignore
          if (event.target.id === 'footer-btn') {
            // @ts-ignore
            setActiveTab(event.target.value);
          }
        }}
      >
        <Typography sx={{ opacity: 0.5 }} variant="subtitle1">
          Show:
        </Typography>
        {activityList.map((item) => (
          <Button
            key={item.value}
            value={item.value}
            id="footer-btn"
            variant="outlined.icon"
            sx={({ palette }: { palette: CustomPalette }) => ({
              background: activeTab === item.value ? palette.primary.light : 'none',
              height: 30,
            })}
          >
            {item.label}
          </Button>
        ))}
      </FooterButtonsContainer>
      <FooterContentContainer>
        {activeTab === 'attachment' && attachmentComponent}
        {activeTab === 'comments' && commentsComponent}
        {activeTab === 'history' && historyComponent}
      </FooterContentContainer>
      {actionsSlot}
    </FooterStyled>
  );
};
