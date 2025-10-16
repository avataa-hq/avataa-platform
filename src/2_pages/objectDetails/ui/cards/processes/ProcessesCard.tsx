import { CardContent, CardHeader } from '@mui/material';

import { useTabs, useTranslate } from '6_shared';
import { useGetInventoryObjectData } from '5_entites';

import { ObjectDetailsCard } from '../ObjectDetailsCard';
import { IconButtonStyled } from '../../commonComponents';
import { useProcessData } from './lib/useProcessData';
import { ProcessDiagram } from './ProcessDiagram';

interface ProcessesCardProps {
  objectId: number;
}

export const ProcessesCard = ({ objectId }: ProcessesCardProps) => {
  const translate = useTranslate();

  const { setSelectedTab } = useTabs();

  const { inventoryObjectData } = useGetInventoryObjectData({ objectId });

  const { bpmnXMLDiagram, isProcessDataLoading, currentProcessElement } = useProcessData({
    inventoryObjectData,
    objectId,
  });

  if (!isProcessDataLoading && !bpmnXMLDiagram) return null;

  return (
    <ObjectDetailsCard sx={{ gridColumn: '1 / -1' }} isLoading={isProcessDataLoading}>
      <CardHeader
        action={<IconButtonStyled onClick={() => setSelectedTab('processManager')} />}
        title={translate('Processes')}
      />
      <CardContent sx={{ overflow: 'auto' }}>
        <ProcessDiagram
          bpmnXMLDiagram={bpmnXMLDiagram}
          currentProcessElement={currentProcessElement}
        />
      </CardContent>
    </ObjectDetailsCard>
  );
};
