import {
  IAddElementsToGroupBody,
  IElementsMutationRequestParams,
  groupApi,
  useProcessManager,
  useProcessManagerTable,
} from '6_shared';
import { enqueueSnackbar } from 'notistack';

const { useDeleteElementsFromGroupMutation } = groupApi;
export const useDeleteElementsFromGroup = () => {
  const { selectedGroup } = useProcessManager();
  const { selectedRows } = useProcessManagerTable();
  const [deleteFromGroup] = useDeleteElementsFromGroupMutation();

  const showSuccessMessage = () => {
    enqueueSnackbar('Element(s) was successfully removed from the group', { variant: 'success' });
  };

  const showErrorMessage = () => {
    enqueueSnackbar('Something went wrong when removing an element(s) from a group', {
      variant: 'error',
    });
  };
  const showMessageWhenNoGroup = () => {
    enqueueSnackbar('Element(s) is not in a group', { variant: 'warning' });
  };

  const deleteElementsFromGroup = async () => {
    if (!selectedGroup) {
      showMessageWhenNoGroup();
      return;
    }
    const elements: IAddElementsToGroupBody[] = selectedRows.map((i) => ({
      entity_id: Number(i.id),
    }));

    const body: IElementsMutationRequestParams = {
      group_name: selectedGroup,
      body: elements,
    };

    try {
      await deleteFromGroup(body);
      showSuccessMessage();
    } catch (e) {
      showErrorMessage();
    }
  };
  return { deleteElementsFromGroup };
};
