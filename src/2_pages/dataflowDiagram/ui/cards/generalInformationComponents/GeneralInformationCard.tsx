import { CollapsibleCard, Box, useTranslate } from '6_shared';
import { RuleNameInput } from './RuleNameInput';
import { RuleTags } from './RuleTags';

export const GeneralInformationCard = () => {
  const translate = useTranslate();

  return (
    <CollapsibleCard
      title={translate('General information')}
      defaultExpanded
      testId="DataFlow-general-information__collapse-btn"
    >
      <Box display="flex" flexDirection="column" gap="20px">
        <RuleNameInput />
        <RuleTags />
      </Box>
    </CollapsibleCard>
  );
};
