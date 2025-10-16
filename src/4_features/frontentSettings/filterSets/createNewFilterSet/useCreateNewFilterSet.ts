import { enqueueSnackbar } from 'notistack';
import { filterSetApi, IFilterSetBody, IFilterSetModel } from '6_shared';

const { useCreateFilterSetMutation } = filterSetApi;
export const useCreateNewFilterSet = () => {
  const [create] = useCreateFilterSetMutation();

  const showSuccessMessage = () =>
    enqueueSnackbar('The filter has been successfully created', { variant: 'success' });
  const showErrorMessage = () => enqueueSnackbar('Error creating filter', { variant: 'error' });

  const createFilterSet = async (body: IFilterSetBody): Promise<IFilterSetModel | null> => {
    try {
      const newFilterSet = await create(body).unwrap();
      showSuccessMessage();
      return newFilterSet;
    } catch (e) {
      showErrorMessage();
      return null;
    }
  };

  return { createFilterSet };
};
