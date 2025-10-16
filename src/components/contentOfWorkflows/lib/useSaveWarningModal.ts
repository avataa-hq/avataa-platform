import { useWorkflows } from '6_shared';

export const useSaveWarningModal = () => {
  const { setSaveWarningModalState } = useWorkflows();

  const handleSaveWarningModalOpen = () => {
    setSaveWarningModalState({ isOpen: true });
    return new Promise((resolve, reject) => {
      setSaveWarningModalState({ resolveFn: resolve, rejectFn: reject });
    });
  };

  return handleSaveWarningModalOpen;
};
