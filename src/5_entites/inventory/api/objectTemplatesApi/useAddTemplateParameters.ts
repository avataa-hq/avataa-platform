import {
  handleApiAction,
  IAddTemplateParametersBody,
  objectTemplatesApi,
  useTranslate,
} from '6_shared';

export const useAddTemplateParameters = () => {
  const translate = useTranslate();

  const { useAddTemplateParametersMutation } = objectTemplatesApi;

  const [addTemplateParameters] = useAddTemplateParametersMutation();

  const addTemplateParametersFn = async (body: IAddTemplateParametersBody) => {
    const res = await handleApiAction(
      () => addTemplateParameters(body).unwrap(),
      translate('Template parameters added successfully'),
    );
    return res;
  };

  return { addTemplateParametersFn };
};
