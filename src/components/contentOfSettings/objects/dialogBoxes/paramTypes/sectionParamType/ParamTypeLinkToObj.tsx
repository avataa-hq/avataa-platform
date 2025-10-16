import { useEffect, useState } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {
  useTranslate,
  objectTypesApi,
  InventoryObjectTypesModel,
  useSettingsObject,
} from '6_shared';
import { ConstraintContainer, ErrrorText, InputTitle } from '../../ObjectAndParamTypeModal.styled';

const { useGetObjectTypesQuery } = objectTypesApi;

export const ParamTypeLinkToObj = () => {
  const translate = useTranslate();

  const { paramState, isEditParamModalOpen, setParamState } = useSettingsObject();

  const { data: listOfObjectTypes = [] } = useGetObjectTypesQuery({});
  const [objectLinkValue, setObjectLinkValue] = useState<InventoryObjectTypesModel | null>(null);

  useEffect(() => {
    if (!isEditParamModalOpen) return;

    setObjectLinkValue(paramState?.objLink ?? null);
  }, [isEditParamModalOpen]);

  const onObjectLinkChange = (event: SelectChangeEvent<string>) => {
    const selectedObj = listOfObjectTypes.find((item) => item.name === event.target.value);

    if (selectedObj !== undefined) {
      setObjectLinkValue(selectedObj);

      setParamState({
        ...paramState,
        objLink: selectedObj,
        isErrorObjLink: false,
        errorObjLinkMessage: ' ',
      });
    }
  };

  return (
    <ConstraintContainer>
      <InputTitle>{translate('Constraint')}</InputTitle>
      <Select
        placeholder="select object type"
        sx={{ padding: '8px 39px 8px 0px' }}
        value={objectLinkValue?.name ?? ''}
        onChange={(event) => onObjectLinkChange(event)}
        error={paramState.isErrorObjLink}
      >
        {listOfObjectTypes.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <ErrrorText>{paramState.errorObjLinkMessage}</ErrrorText>
    </ConstraintContainer>
  );
};
