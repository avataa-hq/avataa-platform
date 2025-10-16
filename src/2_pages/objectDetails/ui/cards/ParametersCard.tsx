import { CardContent, CardHeader } from '@mui/material';
import { Attributes } from '5_entites';
import { ActionTypes, useParamsResolver, useTranslate } from '6_shared';
import { ObjectDetailsCard } from './ObjectDetailsCard';

interface ParametersCardProps {
  objectId: number;
  permissions?: Record<ActionTypes, boolean>;
}

export const ParametersCard = ({ objectId, permissions }: ParametersCardProps) => {
  const translate = useTranslate();

  const { setIsParamsResolverOpen, setUpdateParamsBody, setUpdateObjectBody, setParentIdOptions } =
    useParamsResolver();

  return (
    <ObjectDetailsCard>
      <CardHeader
        sx={{ marginBottom: 1 }}
        // action={<IconButtonStyled />}
        title={translate('Parameters')}
      />
      <CardContent>
        <Attributes
          objectId={objectId}
          newDrawerWidth={320}
          setParamsResolverOpen={setIsParamsResolverOpen}
          setParamsResolverUpdateBody={setUpdateParamsBody}
          setParamsResolverUpdateObjectBody={setUpdateObjectBody}
          setParamsResolverParentIdOptions={setParentIdOptions}
          permissions={permissions}
        />
      </CardContent>
    </ObjectDetailsCard>
  );
};
