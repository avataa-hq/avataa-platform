import { useState } from 'react';
import { TextField } from '@mui/material';

import { ConfigType, SidebarLayout, useConfig, useTranslate } from '6_shared';
import { ItemTreeListItem } from '6_shared/ui/itemTreeList/ui/ItemTreeListItem';
import { useGetAdminContentList } from 'shared/lib';
import {
  SystemManagementContainer,
  MainViewContainer,
  MainViewList,
} from './SystemManagement.styled';
import { ModuleSettings } from './ui/ModuleSettings';

const settingsOptions = ['Platform settings', 'Solutions settings', 'Module settings'];

interface ApiItem {
  label: string;
  defaultValue: string;
}

const getPlatformAPI = (config: ConfigType): ApiItem[] => {
  return [
    { label: 'Inventory API', defaultValue: config._apiBase8000 },
    { label: 'Geodata API', defaultValue: config._apiBase8001 },
    { label: 'Geodata V2 API', defaultValue: config._apiBase8001v2 },
    { label: 'Hierarchy API', defaultValue: config._apiBase8100 },
    { label: 'Documents API', defaultValue: config._apiBase8101 },
    { label: 'Dataflow API', defaultValue: config._apiBase8003 },
    { label: 'Planning API', defaultValue: config._apiBase8004 },
    { label: 'Frontend Settings API', defaultValue: config._apiBase8004FrontendSettings },
    { label: 'Project API', defaultValue: config._apiBase8005 },
    // { label: 'Search API', defaultValue: config._apiBase8007 },
    { label: 'Building API', defaultValue: config._apiBaseBuilding },
    { label: 'Dataflow V2 API', defaultValue: config._apiBaseDataflowV2 },
    { label: 'Dataflow V3 API', defaultValue: config._dataflowV3ApiBase },
    { label: 'Dataview API', defaultValue: config._dataviewApiBase },
    { label: 'Power BI API', defaultValue: config._externalDashboardsApiBase },
    { label: 'Coments API', defaultValue: config._commentsApiBase },
    { label: 'Capacity API', defaultValue: config._capacityApiBase },
  ];
};

export const SystemManagement = () => {
  const translate = useTranslate();
  const { Sidebar } = SidebarLayout;

  const { config } = useConfig();

  const solutionsList = useGetAdminContentList().filter((item) => item.p_id === 'solutions');

  const [selectedSettings, setSelectedSettings] = useState<string>('');

  const platformAPI = getPlatformAPI(config);

  return (
    <SystemManagementContainer>
      <SidebarLayout>
        <Sidebar collapsible>
          <div style={{ alignItems: 'start' }}>
            {settingsOptions.map((item) => (
              <ItemTreeListItem
                key={item}
                onClick={() => setSelectedSettings(item)}
                selected={item === selectedSettings}
                // icon={<Person />}
                // @ts-ignore
                name={translate(item)}
              />
            ))}
          </div>
        </Sidebar>
        <MainViewContainer>
          {selectedSettings === 'Module settings' && <ModuleSettings />}
          {selectedSettings === 'Platform settings' && (
            <>
              <MainViewList>
                {platformAPI.map(({ label, defaultValue }) => (
                  <TextField key={label} label={label} defaultValue={defaultValue} />
                ))}
              </MainViewList>
              {/* <Box component="div">
                <Button sx={{ float: 'right', mt: 2 }} variant="contained" onClick={onClick}>
                  Save
                </Button>
              </Box> */}
            </>
          )}
          {selectedSettings === 'Solutions settings' && (
            <>
              <MainViewList>
                {solutionsList.map(({ id, title, link }) => (
                  <TextField key={id} label={title} defaultValue={link} />
                ))}
              </MainViewList>
              {/* <Box component="div">
                <Button sx={{ float: 'right', mt: 2 }} variant="contained" onClick={onClick}>
                  Save
                </Button>
              </Box> */}
            </>
          )}
        </MainViewContainer>
      </SidebarLayout>
    </SystemManagementContainer>
  );
};
