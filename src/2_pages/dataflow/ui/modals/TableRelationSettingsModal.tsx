import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, Button } from '@mui/material';
import { Modal, Table, TabsWrapper, useDataflowPage, useTranslate } from '6_shared';
import { tableData } from '../mockData';

type Tabs = 'conditionsSettings' | 'dataPreview';

export const TableRelationSettingsModal = () => {
  const translate = useTranslate();
  const { isTableRelationSettingsModalopen, setTableRelationSettingsModalOpen } = useDataflowPage();

  const [selectedTab, setSelectedTab] = useState<Tabs>('conditionsSettings');

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, value: any) => {
    setSelectedTab(value);
  };

  return (
    <Modal
      title={translate('Table relation settings')}
      open={isTableRelationSettingsModalopen}
      width="900px"
      height="500px"
      onClose={() => setTableRelationSettingsModalOpen(false)}
      ModalContentSx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      actions={
        <>
          <Button variant="outlined" onClick={() => setTableRelationSettingsModalOpen(false)}>
            {translate('Cancel')}
          </Button>
          <Button variant="contained">{translate('Save')}</Button>
        </>
      }
    >
      <TabsWrapper>
        <TabContext value={selectedTab}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label={translate('Conditions settings')} value="conditionsSettings" />
            <Tab label={translate('Data preview')} value="dataPreview" />
          </TabList>
          <TabPanel value="conditionsSettings" />
          <TabPanel value="dataPreview">
            <Table tableData={tableData} exceptions={['id']} />
          </TabPanel>
        </TabContext>
      </TabsWrapper>
    </Modal>
  );
};
