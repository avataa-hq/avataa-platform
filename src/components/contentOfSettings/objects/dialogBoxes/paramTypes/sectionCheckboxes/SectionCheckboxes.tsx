import { useSettingsObject, useTranslate } from '6_shared';
import CheckBoxCustom from 'components/UI/checkbox/CheckBoxCustom';
import { FormControlLabel } from '@mui/material';
import { CheckboxesContainer, CheckboxesSection } from '../../ObjectAndParamTypeModal.styled';

const SectionCheckboxes = () => {
  const translate = useTranslate();

  const { paramState, objType, paramType, isEditParamModalOpen, setParamState } =
    useSettingsObject();

  const onMultipleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamState({ ...paramState, multiple: event.target.checked });
  };

  const onRequiredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (objType?.primary.includes(paramType?.id!)) return;

    setParamState({ ...paramState, required: event.target.checked });
  };

  const onSearchableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamState({ ...paramState, searchable: event.target.checked });
  };

  const onAutomationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamState({ ...paramState, automation: event.target.checked });
  };

  const onReturnableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParamState({ ...paramState, returnable: event.target.checked });
  };

  return (
    <CheckboxesSection>
      <CheckboxesContainer>
        <FormControlLabel
          disabled={
            isEditParamModalOpen
              ? true
              : objType?.primary.includes(paramType?.id!) ||
                paramState.type === 'sequence' ||
                paramState.type === 'two-way link'
          }
          sx={{ mb: '10px' }}
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={paramState.multiple || false}
              onChange={(event) => onMultipleChange(event)}
            />
          }
          label={translate('Multiple')}
        />

        <FormControlLabel
          disabled={
            paramState.type === 'prm_link' ||
            paramState.type === 'two-way link' ||
            objType?.primary.includes(paramType?.id!)
          }
          sx={{ mb: '10px' }}
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={paramState.required}
              onChange={(event) => onRequiredChange(event)}
            />
          }
          label={translate('Required')}
        />

        <FormControlLabel
          disabled
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={objType?.primary.includes(paramType?.id!)}
            />
          }
          label={translate('Primary')}
        />
      </CheckboxesContainer>
      <CheckboxesContainer>
        <FormControlLabel
          sx={{ mb: '10px' }}
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={paramState.searchable}
              onChange={(event) => onSearchableChange(event)}
            />
          }
          label={translate('Searchable')}
        />

        <FormControlLabel
          sx={{ mb: '10px' }}
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={paramState.automation}
              onChange={(event) => onAutomationChange(event)}
            />
          }
          label={translate('Automation')}
        />

        <FormControlLabel
          control={
            <CheckBoxCustom
              sx={{ p: '4px', marginX: 1.1 }}
              checked={paramState.returnable}
              onChange={(event) => onReturnableChange(event)}
            />
          }
          label={translate('Returnable')}
        />
      </CheckboxesContainer>
    </CheckboxesSection>
  );
};

export default SectionCheckboxes;
