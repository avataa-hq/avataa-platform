import { commentsApi } from '6_shared';

export const useDeleteComment = () => {
  const [deleteCommentFn] = commentsApi.useDeleteCommentMutation();

  const deleteComment = async (id: number) => {
    await deleteCommentFn(id).unwrap();
  };

  return { deleteComment };
};
