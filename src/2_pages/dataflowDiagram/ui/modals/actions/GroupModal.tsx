import { enqueueSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import { GroupForm, GroupFormInputs } from '4_features/ruleManagerDiagram';
import {
  Box,
  Icons,
  Modal,
  useTranslate,
  getErrorMessage,
  dataviewActionApi,
  useDataflowDiagramPage,
  useDataflowDiagram,
} from '6_shared';

const { useGroupActionMutation } = dataviewActionApi;

const formId = 'rule-manager-diagram__group-action-form';

export const GroupModal = () => {
  const translate = useTranslate();

  const { isGroupModalOpen, setIsGroupModalOpen } = useDataflowDiagramPage();

  const { newLinkPromise, pipelineId, addNewLink, removeNewLink } = useDataflowDiagram();

  const [groupAction, { isLoading: isGroupActionLoading }] = useGroupActionMutation();

  const closeModal = () => {
    setIsGroupModalOpen(false);
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  const onSubmit = async (data: GroupFormInputs) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');
      if (!pipelineId) throw new Error('No pipeline id');

      const response = await groupAction({
        pipelineId,
        sourceId: newLinkPromise.value.source.id,
        body: {
          ...data,
          location: {
            x: newLinkPromise.value.target.x,
            y: newLinkPromise.value.target.y,
          },
        },
      }).unwrap();

      addNewLink({
        id: response.id,
        name: response.name,
        rows_count: response.rows_count,
        status: 'waiting',
      });
      enqueueSnackbar(translate('Success'), { variant: 'success' });
      closeModal();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <Modal
      minWidth="700px"
      open={isGroupModalOpen}
      title={
        <Box display="flex" gap="5px">
          <Icons.ObjectGroupIcon />
          <Typography variant="h3" alignSelf="center">
            {translate('Group')}
          </Typography>
        </Box>
      }
      onClose={() => cancel()}
      actions={
        <>
          <Button variant="outlined" onClick={() => cancel()}>
            {translate('Cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={isGroupActionLoading}
            type="submit"
            form={formId}
            name="apply-button"
          >
            {translate('Apply')}
          </LoadingButton>
        </>
      }
    >
      <GroupForm id={formId} onSubmit={onSubmit} />
    </Modal>
  );
};
