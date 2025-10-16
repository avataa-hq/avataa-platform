import { IComment, commentsApi } from '6_shared';

export const useUpdateComment = () => {
  const [updateCommentFn] = commentsApi.useUpdateCommentMutation();

  const updateComment = async (id: number, body: IComment) => {
    await updateCommentFn({ id, body }).unwrap();
  };

  return { updateComment };
};
