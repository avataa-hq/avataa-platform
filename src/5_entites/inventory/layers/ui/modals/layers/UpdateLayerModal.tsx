import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { IFolderModel, Modal, useTranslate, IUpdateLayerBody, useLayersSlice } from '6_shared';
import { useUpdateLayer } from '5_entites/inventory/layers/api';

type Inputs = {
  parentId: IFolderModel;
};

interface IProps {
  foldersData?: IFolderModel[];
}

export const UpdateLayerModal = ({ foldersData }: IProps) => {
  const translate = useTranslate();
  const { isEditLayerModalOpen, selectedLayersItem, setIsEditLayerModalOpen } = useLayersSlice();

  const { updateLayer } = useUpdateLayer();

  const defaultValues = useMemo(() => {
    return {
      parentId: foldersData?.find((folder) => folder.id === selectedLayersItem?.folder_id),
    };
  }, [foldersData, selectedLayersItem]);

  const { control, handleSubmit, reset } = useForm<Inputs>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFolderModalClose = () => {
    setIsEditLayerModalOpen(false);
    reset();
  };

  const onSubmit = async (data: Inputs) => {
    if (!selectedLayersItem) return;

    const updateLayerBody: IUpdateLayerBody = {
      layer_id: selectedLayersItem.id,
      body: {
        folder_id: data.parentId?.id ?? null,
      },
    };

    if (data.parentId === undefined || selectedLayersItem.folder_id === data.parentId?.id) {
      handleFolderModalClose();
      return;
    }

    await updateLayer(updateLayerBody);

    handleFolderModalClose();
  };

  return (
    <Modal
      title={translate('Update layer')}
      width="320px"
      open={isEditLayerModalOpen}
      onClose={handleFolderModalClose}
      actions={
        <Button form="update-layer-form" type="submit">
          {translate('Update')}
        </Button>
      }
    >
      <Box component="div" sx={{ marginTop: '20px' }}>
        <form id="update-layer-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="parentId"
            control={control}
            render={({ field: { onChange, value, ...props } }) => (
              <Autocomplete
                {...props}
                options={foldersData ?? []}
                value={foldersData?.find((folder) => folder?.id === value?.id) || null}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label={translate('Select parent folder')} />
                )}
                onChange={(_, newValue) => onChange(newValue)}
                fullWidth
              />
            )}
          />
        </form>
      </Box>
    </Modal>
  );
};
