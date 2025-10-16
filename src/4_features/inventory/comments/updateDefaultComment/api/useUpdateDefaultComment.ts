import { UpdateDefaultCommentBody, commentsApi, handleApiAction, useTranslate } from '6_shared';

export const useUpdateDefaultComment = () => {
  const translate = useTranslate();
  const [updateDefaultCommentFn] = commentsApi.useUpdateDefaultCommentMutation();

  const updateDefaultComment = async (body: UpdateDefaultCommentBody) => {
    await handleApiAction(
      () => updateDefaultCommentFn(body).unwrap(),
      translate('Comment updated successfully'),
    );
  };

  return { updateDefaultComment };
};
