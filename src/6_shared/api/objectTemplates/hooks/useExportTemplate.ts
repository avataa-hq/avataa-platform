import { handleApiAction } from '6_shared/lib';
import { objectTemplatesApi } from '../objectTemplatesApi';
import { IExportTemplateBody } from '../types';

export const useExportTemplate = () => {
  const { useExportTemplateMutation } = objectTemplatesApi;

  const [exportTemplate] = useExportTemplateMutation();

  const exportTemplateFn = async (body: IExportTemplateBody) => {
    const res = await handleApiAction(() => exportTemplate(body).unwrap());
    return res;
  };

  return { exportTemplateFn };
};
