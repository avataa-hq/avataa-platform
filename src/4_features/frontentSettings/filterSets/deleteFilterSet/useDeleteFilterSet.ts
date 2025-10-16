import { enqueueSnackbar } from 'notistack';
import { filterSetApi } from '6_shared';

const { useDeleteFilterSetByIdMutation } = filterSetApi;
export const useDeleteFilterSet = () => {
  const [deleteFilter] = useDeleteFilterSetByIdMutation();

  const showSuccessMessage = () =>
    enqueueSnackbar('Filter removed successfully', { variant: 'success' });
  const showErrorMessage = () =>
    enqueueSnackbar('Error when removing filter', { variant: 'error' });

  const deleteFilterSet = async (filterId: number) => {
    try {
      await deleteFilter(filterId).unwrap();
      showSuccessMessage();
    } catch (e) {
      showErrorMessage();
    }
  };

  return { deleteFilterSet };
};
