import { INestedFilterForwardRef } from '6_shared';

export const isValidFilterFormState = async (filterRef: INestedFilterForwardRef | null) => {
  if (filterRef) {
    await filterRef.onApply?.();
    const filterFormState = await filterRef.getFormState?.();

    if (!filterFormState) return true;

    if (filterFormState.errors && Object.keys(filterFormState.errors).length === 0) {
      return true;
    }

    return filterFormState.isValid;
  }

  return true;
};
