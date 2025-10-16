import { enqueueSnackbar } from 'notistack';
import { filterSetApi, IFilterSetBody } from '6_shared';

const { useUpdateFilterSetByIdMutation } = filterSetApi;
export const useUpdateFilterSet = () => {
  const [update] = useUpdateFilterSetByIdMutation();

  const showSuccessMessage = () =>
    enqueueSnackbar('Filter updated successfully', { variant: 'success' });
  const showErrorMessage = () => enqueueSnackbar('Error updating filter', { variant: 'error' });

  const updateFilterSet = async (body: IFilterSetBody & { filter_id: number }) => {
    try {
      await update(body).unwrap();
      showSuccessMessage();
    } catch (e) {
      showErrorMessage();
    }
  };

  return { updateFilterSet };
};
