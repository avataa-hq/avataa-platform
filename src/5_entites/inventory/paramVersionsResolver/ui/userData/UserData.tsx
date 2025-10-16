import { memo, useState } from 'react';
import { KeyboardArrowLeft, KeyboardArrowDown } from '@mui/icons-material';
import { type ParentIDOption, transformValue } from '5_entites';
import { SystemDataAttribute } from '5_entites/inventory/attributes/ui/systemDataAttributes/SystemDataAttribute';
import {
  type UpdateParameterValuesBody,
  type InventoryParameterTypesModel,
  useTranslate,
  useTimezoneAdjustment,
} from '6_shared';
import { IconButtonStyled } from '../components';
import * as SC from '../ParamVersionsResolver.styled';

interface IProps {
  paramTypeNamesData: Record<string, string> | undefined;
  paramTypesConfig: Record<number, InventoryParameterTypesModel> | null;
  updateParams: UpdateParameterValuesBody[];
  objectAttributes: ParentIDOption[];
  handleAddParam: (tprmId: number) => void;
  handleAddAttribute: (id: number) => void;
}

export const UserData = memo(
  ({
    paramTypeNamesData,
    paramTypesConfig,
    updateParams,
    objectAttributes,
    handleAddParam,
    handleAddAttribute,
  }: IProps) => {
    const translate = useTranslate();
    const { disableTimezoneAdjustment } = useTimezoneAdjustment();

    const [yourDataExpanded, setYourDataExpanded] = useState<Record<number, boolean>>({});

    return (
      <SC.RightContent>
        <SC.Content>
          {paramTypeNamesData &&
            paramTypesConfig &&
            updateParams &&
            Object.values(updateParams)
              .sort((a, b) => a.tprm_id - b.tprm_id)
              .map(({ tprm_id, new_value }) => (
                <SC.ContentItem key={tprm_id}>
                  <IconButtonStyled onClick={() => handleAddParam(tprm_id)}>
                    <KeyboardArrowLeft />
                  </IconButtonStyled>
                  <SC.TypographyStyled>{paramTypeNamesData[tprm_id]}</SC.TypographyStyled>
                  <SC.TypographyStyled variant="body2">
                    {transformValue({
                      value: new_value,
                      valType: paramTypesConfig[tprm_id].val_type,
                      disableTimezoneAdjustment,
                      crop: !yourDataExpanded[tprm_id],
                    })}
                  </SC.TypographyStyled>

                  <SC.ButtonContainer>
                    {['str', 'int', 'float'].includes(paramTypesConfig[tprm_id].val_type) &&
                      transformValue({
                        value: new_value,
                        valType: paramTypesConfig[tprm_id].val_type,
                        disableTimezoneAdjustment,
                      }).length > 50 && (
                        <IconButtonStyled
                          onClick={() =>
                            setYourDataExpanded((prev) => ({
                              ...prev,
                              [tprm_id]: !prev[tprm_id],
                            }))
                          }
                          customSx={{
                            rotate: `${yourDataExpanded[tprm_id] ? 180 : 0}deg`,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <KeyboardArrowDown />
                        </IconButtonStyled>
                      )}
                  </SC.ButtonContainer>
                </SC.ContentItem>
              ))}
        </SC.Content>

        {objectAttributes.length !== 0 && (
          <SC.Content>
            <SC.TypographyStyled>{translate('System data')}</SC.TypographyStyled>

            {objectAttributes.map((objectAttribute) => (
              <SC.ContentItem key={objectAttribute.id}>
                <IconButtonStyled onClick={() => handleAddAttribute(objectAttribute.id)}>
                  <KeyboardArrowLeft />
                </IconButtonStyled>

                <SystemDataAttribute
                  name={translate(objectAttribute.optionName as any) || ''}
                  value={objectAttribute.name}
                  isLink={false}
                />
              </SC.ContentItem>
            ))}
          </SC.Content>
        )}
      </SC.RightContent>
    );
  },
);
