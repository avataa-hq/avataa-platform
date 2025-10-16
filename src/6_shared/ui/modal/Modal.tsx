import { PropsWithChildren, ReactNode } from 'react';

import { Typography, Box, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { SxProps } from '@mui/system';

import { ModalFooter } from './ModalFooter';
import {
  ModalWrapper,
  ModalContainer,
  ModalCloseButton,
  ModalBackButton,
  ModalContent,
} from './Modal.styled';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  actions?: React.ReactNode;
  ModalContentSx?: SxProps;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  tabValue?: string;
  tabsContent?: TabItem[];
  setTabValue?: React.Dispatch<React.SetStateAction<string>>;
  hideBackdrop?: boolean;
  withBackButton?: boolean;
  handleBack?: () => void;
  disablePortal?: boolean;
}

export const Modal = ({
  open,
  onClose,
  title,
  actions,
  children,
  ModalContentSx,
  width,
  height,
  minWidth,
  tabValue,
  tabsContent,
  setTabValue,
  hideBackdrop,
  withBackButton,
  handleBack,
  disablePortal = false,
}: PropsWithChildren<ModalProps>) => {
  const renderTitle = (titleToRender: string | ReactNode) => {
    if (typeof titleToRender === 'string')
      return (
        <Typography variant="h3" align="left">
          {titleToRender}
        </Typography>
      );

    return titleToRender;
  };

  const renderModalContent = (
    titleToRender: string | ReactNode,
    tabVal: string | undefined,
    tabsArr: TabItem[] | undefined,
    setTab: React.Dispatch<React.SetStateAction<string>> | undefined,
  ) => {
    if (tabVal && tabsArr && setTab) {
      const tabList = [...tabsArr.map((item) => item.label)];

      if (titleToRender && typeof titleToRender === 'string') {
        tabList.unshift(titleToRender);
      }

      return (
        <ModalContainer sx={{ width: width ?? 'min-content', height, minWidth }}>
          <TabContext value={tabVal}>
            <TabList onChange={(event: React.SyntheticEvent, newValue: string) => setTab(newValue)}>
              {tabList.map((label, index) => (
                <Tab key={index} label={label} value={(index + 1).toString()} />
              ))}
            </TabList>
            <TabPanel value="1">{children}</TabPanel>
            {tabsArr.map((tab, index) => (
              <TabPanel key={index} value={(index + 2).toString()} sx={{ display: 'flex' }}>
                <ModalContent
                  sx={{
                    marginBottom: '20px',
                    paddingRight: '10px',
                    overflow: 'auto',
                    height: '100%',
                    ...ModalContentSx,
                  }}
                >
                  {tab.content}
                </ModalContent>
              </TabPanel>
            ))}
          </TabContext>
          {actions && <ModalFooter>{actions}</ModalFooter>}
          {withBackButton && (
            <ModalBackButton data-testid="modal__back-btn" onClick={() => handleBack?.()}>
              <ArrowBackIcon />
            </ModalBackButton>
          )}
          <ModalCloseButton data-testid="modal__close-btn" onClick={() => onClose?.()}>
            <CloseIcon />
          </ModalCloseButton>
        </ModalContainer>
      );
    }

    return (
      <ModalContainer sx={{ width: width ?? 'min-content', height, minWidth }}>
        {title && (
          <Box component="div" mr="20px">
            {renderTitle(title)}
          </Box>
        )}

        <ModalContent sx={{ paddingRight: '10px', overflow: 'auto', ...ModalContentSx }}>
          {children}
        </ModalContent>
        {actions && <ModalFooter>{actions}</ModalFooter>}
        {withBackButton && (
          <ModalBackButton data-testid="modal__back-btn" onClick={() => handleBack?.()}>
            <ArrowBackIcon />
          </ModalBackButton>
        )}
        <ModalCloseButton data-testid="modal__close-btn" onClick={() => onClose?.()}>
          <CloseIcon />
        </ModalCloseButton>
      </ModalContainer>
    );
  };

  return (
    <ModalWrapper
      disablePortal={disablePortal}
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
    >
      {renderModalContent(title, tabValue, tabsContent, setTabValue)}
    </ModalWrapper>
  );
};
