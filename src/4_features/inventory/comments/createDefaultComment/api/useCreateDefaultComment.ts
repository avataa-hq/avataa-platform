import { CreateDefaultCommentBody, commentsApi, handleApiAction, useTranslate } from '6_shared';

export const useCreateDefaultComment = () => {
  const translate = useTranslate();
  const [createDefaultCommentFn] = commentsApi.useCreateDefaultCommentMutation();

  const createDefaultComment = async (body: CreateDefaultCommentBody) => {
    await handleApiAction(
      () => createDefaultCommentFn(body).unwrap(),
      translate('Comment created successfully'),
    );
  };

  return { createDefaultComment };
};
