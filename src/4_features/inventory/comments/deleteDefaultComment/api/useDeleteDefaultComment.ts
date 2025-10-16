import { commentsApi, handleApiAction, useTranslate } from '6_shared';

export const useDeleteDefaultComment = () => {
  const translate = useTranslate();
  const [deleteDefaultCommentFn] = commentsApi.useDeleteDefaultCommentMutation();

  const deleteDefaultComment = async (id: number) => {
    await handleApiAction(
      () => deleteDefaultCommentFn(id).unwrap(),
      translate('Comment deleted successfully'),
    );
  };

  return { deleteDefaultComment };
};
