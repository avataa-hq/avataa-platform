import { useState } from 'react';
import { SidebarLayout, useTranslate } from '6_shared';
import { ItemTreeListItem } from '6_shared/ui/itemTreeList/ui/ItemTreeListItem';
import { AuditOptionsType, auditPageOptions } from '5_entites';
import { AuditPageContainer, MainViewContainer } from './AuditPage.styled';
import { ConfigurationAudit } from './configurationAudit/ConfigurationAudit';
import { DataAudit } from './dataAudit/DataAudit';
import { SessionAudit } from './sessionAudit';

export const AuditPage = () => {
  const translate = useTranslate();
  const { Sidebar } = SidebarLayout;

  const [selectedAudit, setSelectedAudit] = useState<AuditOptionsType>('Configuration audit');

  const onSelectedAuditChange = (item: AuditOptionsType) => {
    setSelectedAudit(item);
  };

  return (
    <AuditPageContainer>
      <SidebarLayout>
        <Sidebar collapsible>
          <div style={{ alignItems: 'start' }}>
            {auditPageOptions.map((item) => (
              <ItemTreeListItem
                key={item}
                onClick={() => setSelectedAudit(item)}
                selected={item === selectedAudit}
                // @ts-ignore
                name={translate(item)}
              />
            ))}
          </div>
        </Sidebar>
        <MainViewContainer>
          {selectedAudit === 'Configuration audit' && <ConfigurationAudit />}
          {selectedAudit === 'Data audit' && <DataAudit />}
          {selectedAudit === 'Session audit' && (
            <SessionAudit onSelectedAuditChange={onSelectedAuditChange} />
          )}
        </MainViewContainer>
      </SidebarLayout>
    </AuditPageContainer>
  );
};
