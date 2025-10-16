import { handleApiAction, ICreateLayerBody, layersMsApi, useTranslate } from '6_shared';

export const useCreateLayer = () => {
  const translate = useTranslate();

  const { useCreateLayerMutation } = layersMsApi.layers;

  const [createLayerFn] = useCreateLayerMutation();

  const createLayer = async (body: ICreateLayerBody) => {
    const res = await handleApiAction(
      () => createLayerFn(body).unwrap(),
      translate('Layer created successfully'),
    );
    return res;
  };

  return { createLayer };
};
