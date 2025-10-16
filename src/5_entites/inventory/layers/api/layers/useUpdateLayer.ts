import { handleApiAction, IUpdateLayerBody, layersMsApi, useTranslate } from '6_shared';

export const useUpdateLayer = () => {
  const translate = useTranslate();

  const { useUpdateLayerMutation } = layersMsApi.layers;

  const [updateLayerFn] = useUpdateLayerMutation();

  const updateLayer = async (body: IUpdateLayerBody) => {
    const res = await handleApiAction(
      () => updateLayerFn(body).unwrap(),
      translate('Layer updated successfully'),
    );
    return res;
  };

  return { updateLayer };
};
