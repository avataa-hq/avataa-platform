import { SyntheticEvent } from 'react';
import { TextField } from '@mui/material';
import { useTranslate, parameterTypesApi, objectTypesApi, useSettingsObject } from '6_shared';
import {
  ConstraintContainer,
  HorContainer,
  InputAutocomplete,
  InputTitle,
  ParamLinkFilterContainer,
} from '../../ObjectAndParamTypeModal.styled';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
const { useGetObjectTypesQuery } = objectTypesApi;

export const ParamTypeLinkToParam = () => {
  const translate = useTranslate();

  const { paramState, setParamState, objType } = useSettingsObject();

  const { data: listOfObjectTypes = [] } = useGetObjectTypesQuery({});
  const { data: listOfParamTypes = [] } = useGetObjectTypeParamTypesQuery(
    { id: paramState.objLink?.id! },
    {
      skip: !paramState.objLink?.id,
    },
  );
  const { data: listOfFilterInternalParameters } = useGetObjectTypeParamTypesQuery(
    { id: objType?.id! },
    { skip: !objType },
  );

  const onObjectLinkChange = (newValue: unknown) => {
    const selectedObj = listOfObjectTypes.find((item) => item.name === newValue);

    setParamState({
      ...paramState,
      objLink: selectedObj,
      paramLink: null,
      internalPrmLinkFilter: null,
      externalPrmLinkFilter: null,
      isErrorObjLink: false,
      errorObjLinkMessage: ' ',
    });
  };

  const onParameterLinkChange = (newValue: unknown) => {
    const selectedParam = listOfParamTypes?.find((item) => item.name === newValue);

    setParamState({
      ...paramState,
      paramLink: selectedParam,
      internalPrmLinkFilter: null,
      externalPrmLinkFilter: null,
      isErrorParamLink: false,
      errorParamLinkMessage: ' ',
    });
  };

  const onInternalParameterChange = (newValue: unknown) => {
    const selectedParam = listOfFilterInternalParameters?.find((item) => item.name === newValue);
    setParamState({ ...paramState, internalPrmLinkFilter: selectedParam });
  };

  const onExternalParameterChange = (newValue: unknown) => {
    const selectedParam = listOfParamTypes?.find((item) => item.name === newValue);
    setParamState({ ...paramState, externalPrmLinkFilter: selectedParam });
  };

  return (
    <ConstraintContainer marginBottom="20px">
      <InputTitle>{translate('Constraint')}</InputTitle>
      <InputAutocomplete
        size="small"
        options={listOfObjectTypes
          .filter((item) => item.id !== objType?.id)
          .map((item) => item.name)}
        value={paramState?.objLink?.name ?? ''}
        onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
          onObjectLinkChange(value)
        }
        renderInput={(elements: any) => (
          <TextField
            {...elements}
            error={paramState.isErrorObjLink}
            helperText={paramState.errorObjLinkMessage}
          />
        )}
        autoSelect
      />
      <InputAutocomplete
        size="small"
        options={listOfParamTypes?.map((item) => item.name)}
        value={paramState?.paramLink?.name ?? ''}
        onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
          onParameterLinkChange(value)
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

      {paramState?.paramLink && paramState?.objLink && (
        <ParamLinkFilterContainer>
          <InputTitle>{translate('Parameter link filter')}</InputTitle>
          <HorContainer>
            <InputTitle width="100px">{translate('Internal')}:</InputTitle>
            <InputAutocomplete
              // sx={{ marginBottom: '20px' }}
              size="small"
              options={listOfFilterInternalParameters!
                ?.filter((item) => item.val_type === 'prm_link')
                .map((item) => item.name)}
              value={paramState.internalPrmLinkFilter?.name ?? ''}
              onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
                onInternalParameterChange(value)
              }
              renderInput={(elements) => (
                <TextField
                  {...elements}
                  error={paramState.isErrorInternal}
                  helperText={paramState.errorInternalMessage}
                />
              )}
              autoSelect
            />
          </HorContainer>
          <HorContainer>
            <InputTitle width="100px">{translate('External')}:</InputTitle>
            <InputAutocomplete
              size="small"
              options={listOfParamTypes
                ?.filter((item) => item.val_type === 'prm_link')
                .map((item) => item.name)}
              value={paramState.externalPrmLinkFilter?.name ?? ''}
              onChange={(event: SyntheticEvent<Element, Event>, value: unknown): void =>
                onExternalParameterChange(value)
              }
              renderInput={(elements) => (
                <TextField
                  {...elements}
                  error={paramState.isErrorExternal}
                  helperText={paramState.errorExternalMessage}
                />
              )}
              autoSelect
            />
          </HorContainer>
        </ParamLinkFilterContainer>
      )}
    </ConstraintContainer>
  );
};
