import { SyntheticEvent } from 'react';
import { TextField } from '@mui/material';
import { useTranslate, objectTypesApi, useSettingsObject } from '6_shared';
import {
  ConstraintContainer,
  InputAutocomplete,
  InputTitle,
} from '../../ObjectAndParamTypeModal.styled';

const { useGetObjectTypesQuery } = objectTypesApi;

export const ParamTypeTwoWayMoLink = () => {
  const translate = useTranslate();

  const { paramState, objType, setParamState } = useSettingsObject();

  const { data: listOfObjectTypes = [] } = useGetObjectTypesQuery({});

  const onParamTypeTmoWayMoLinkChange = (newValue: unknown) => {
    const selectedParam = listOfObjectTypes?.find((item) => item.name === newValue);
    setParamState({ ...paramState, tmoWayMoLink: selectedParam });
  };

  return (
    <ConstraintContainer marginBottom="20px">
      <InputTitle>{translate('Constraint')}</InputTitle>
      <InputAutocomplete
        size="small"
        options={
          listOfObjectTypes && objType
            ? listOfObjectTypes.filter((item) => item.id !== objType.id).map((item) => item.name)
            : []
        }
        value={paramState?.tmoWayMoLink?.name ?? ''}
        onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
          onParamTypeTmoWayMoLinkChange(value)
        }
        renderInput={(elements: any) => (
          <TextField
            {...elements}
            error={paramState.isErrorTwoWayMoLink}
            helperText={paramState.errorTwoWayMoLinkMessage}
          />
        )}
        autoSelect
      />
    </ConstraintContainer>
  );
};
