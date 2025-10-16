import { IComment, commentsApi, handleApiAction, useTranslate } from '6_shared';

export const useCreateComment = () => {
  const translate = useTranslate();
  const [createCommentFn] = commentsApi.useCreateCommentMutation();

  const createComment = async (id: number, body: IComment) => {
    await handleApiAction(
      () => createCommentFn({ id, body }).unwrap(),
      translate('New comment added'),
    );
  };

  return { createComment };
};
