import { SyntheticEvent } from 'react';
import { TextField } from '@mui/material';
import { useTranslate, parameterTypesApi, useSettingsObject } from '6_shared';
import {
  ConstraintContainer,
  InputAutocomplete,
  InputTitle,
} from '../../ObjectAndParamTypeModal.styled';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

export const ParamTypeSequence = () => {
  const translate = useTranslate();

  const { paramState, objType, setParamState } = useSettingsObject();

  const { data: listOfFilterInternalParameters } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    { skip: !objType },
  );

  const onInternalParameterChange = (newValue: unknown) => {
    const selectedParam = listOfFilterInternalParameters?.find((item) => item.name === newValue);
    setParamState({ ...paramState, sequenceConstraint: selectedParam });
  };

  return (
    <ConstraintContainer marginBottom="20px">
      <InputTitle>{translate('Constraint')}</InputTitle>
      <InputAutocomplete
        size="small"
        options={listOfFilterInternalParameters?.map((item) => item.name) ?? []}
        value={paramState?.sequenceConstraint?.name ?? ''}
        onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
          onInternalParameterChange(value)
        }
        renderInput={(elements: any) => (
          <TextField
            {...elements}
            error={paramState.isErrorParamLink}
            helperText={paramState.errorParamLinkMessage}
          />
        )}
        autoSelect
      />
    </ConstraintContainer>
  );
};
