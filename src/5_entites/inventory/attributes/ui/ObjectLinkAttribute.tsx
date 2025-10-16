import { enqueueSnackbar } from 'notistack';
import { Box, Typography } from '@mui/material';
import TurnSlightLeftIcon from '@mui/icons-material/TurnSlightLeft';
import { parametersApi, useAppNavigate, useAssociatedObjects, useObjectDetails } from '6_shared';
import { INewObjectParams } from '5_entites';
import { MainModuleListE } from 'config/mainModulesConfig';
import { AttributeValue } from './Attributes.styled';

interface ObjectLinkAttributeProps {
  param: INewObjectParams['params'][number];
}

const { useLazyGetParameterQuery } = parametersApi;

export const ObjectLinkAttribute = ({ param }: ObjectLinkAttributeProps) => {
  const navigate = useAppNavigate();

  const {
    setSelectedTmo,
    setTprmNameWhenOpen,
    setComposedSelectedTmo,
    setIsOpenAssociatedTableModal,
    pushToObjectHistory,
  } = useAssociatedObjects();

  const { pushObjectIdToStack } = useObjectDetails();

  const [getParameter] = useLazyGetParameterQuery();

  const handleObjectLinkClick = async (
    parameter: INewObjectParams['params'][number],
    moLinkIndex: number,
  ) => {
    try {
      const { data } = await getParameter({
        object_id: parameter.mo_id,
        param_type_id: parameter.tprm_id,
      });
      if (!data) throw new Error('Parameter not found');

      const moLinkId = Array.isArray(data.value) ? data.value[moLinkIndex] : data.value;

      navigate(MainModuleListE.objectDetails);
      if (moLinkId) pushObjectIdToStack(moLinkId as number);
    } catch (error) {
      console.error(error);
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const onOutgoingLinkedObjectsWidgetOpen = () => {
    if (param.constraint) {
      setSelectedTmo(+param.constraint);
      setComposedSelectedTmo({ tmoId: param.constraint, tprmName: param.name });
      setTprmNameWhenOpen(param.name);
    }
    pushToObjectHistory({ id: param.mo_id, popupType: 'related' });

    setIsOpenAssociatedTableModal({ isOpen: true, type: 'related', initialId: param.mo_id });
  };

  return (
    <Box component="div" key={param.tprm_id} sx={{ position: 'relative' }}>
      <Typography>{param.name}</Typography>
      {(param.multiple && Array.isArray(param.value) ? param.value : [param.value]).map(
        (moLink, moLinkIndex) => (
          <AttributeValue
            key={moLink}
            onClick={() => handleObjectLinkClick(param, moLinkIndex)}
            color="primary"
            expanded={param.expanded}
            isLink
          >
            {moLink}
          </AttributeValue>
        ),
      )}
      <TurnSlightLeftIcon
        onClick={onOutgoingLinkedObjectsWidgetOpen}
        sx={{ position: 'absolute', top: 0, left: '-20px', cursor: 'pointer' }}
      />
    </Box>
  );
};
