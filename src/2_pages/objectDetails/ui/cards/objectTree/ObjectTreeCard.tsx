import { CardContent, CardHeader } from '@mui/material';

import { IInventoryObjectModel, useTranslate } from '6_shared';

import { ObjectDetailsCard } from '../ObjectDetailsCard';
import { ObjectTree } from './ObjectTree2';

interface ObjectTreeCardProps {
  object: IInventoryObjectModel | undefined;
}

export const ObjectTreeCard = ({ object }: ObjectTreeCardProps) => {
  const translate = useTranslate();

  return (
    <ObjectDetailsCard>
      <CardHeader title={translate('Object tree')} />
      <CardContent>
        <ObjectTree object={object} />
      </CardContent>
    </ObjectDetailsCard>
  );
};
