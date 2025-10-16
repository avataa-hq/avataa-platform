import { handleApiAction, inventoryDocumentsApi } from '6_shared';

export const useCopyAttachments = () => {
  const { useCopyAttachmentsMutation } = inventoryDocumentsApi;

  const [copyAttachmentsFn, { isLoading: isLoadingCopyAttachments }] = useCopyAttachmentsMutation();
  const copyAttachments = async ({
    from_mo_id,
    to_mo_id,
  }: {
    from_mo_id: number;
    to_mo_id: number;
  }) => {
    const res = await handleApiAction(
      () => copyAttachmentsFn({ from_mo_id, to_mo_id }).unwrap(),
      'Attachments copied successfully',
    );

    return res;
  };

  return { copyAttachments, isLoadingCopyAttachments };
};
