import { searchApiV2 } from '6_shared';
import store from 'store';

export const useWaitForDeletingObjects = () => {
  const waitForDeletingObjects = (objectIds: number[], interval = 1000) => {
    return new Promise<void>((resolve) => {
      const check = () => {
        const state = store.getState();
        const { queries } = state.inventorySearch;

        const stillExists = Object.values(queries).some((query: any) => {
          store.dispatch(searchApiV2.util.invalidateTags([{ type: 'Objects', id: 'V2' }]));
          return (
            query?.endpointName === 'getObjectsByFilters' &&
            query?.data?.objects?.some((obj: any) => objectIds.includes(obj.id))
          );
        });

        if (!stillExists) {
          resolve();
          return;
        }

        setTimeout(check, interval);
      };

      check();
    });
  };

  return { waitForDeletingObjects };
};
