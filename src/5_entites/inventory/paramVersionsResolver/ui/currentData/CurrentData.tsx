import { useState } from 'react';
import { Box } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { transformValue } from '5_entites/inventory/lib';
import { SystemDataAttribute } from '5_entites/inventory/attributes/ui/systemDataAttributes/SystemDataAttribute';
import {
  useParamsResolver,
  useTimezoneAdjustment,
  useTranslate,
  type IInventoryObjectParamsModel,
  type InventoryParameterTypesModel,
  type ObjectByFilters,
} from '6_shared';
import { IconButtonStyled } from '../components';
import * as SC from '../ParamVersionsResolver.styled';

interface IProps {
  paramTypeNamesData: Record<string, string> | undefined;
  paramTypesConfig: Record<number, InventoryParameterTypesModel> | null;
  inventoryObjectParams: Record<number, IInventoryObjectParamsModel> | null;
  objectByFilters: ObjectByFilters | undefined;
}

export const CurrentData = ({
  paramTypeNamesData,
  paramTypesConfig,
  inventoryObjectParams,
  objectByFilters,
}: IProps) => {
  const translate = useTranslate();
  const { disableTimezoneAdjustment } = useTimezoneAdjustment();

  const { updateObjectBody, parentIdOptions } = useParamsResolver();

  const [currentDataExpanded, setCurrentDataExpanded] = useState<Record<number, boolean>>({});

  return (
    <SC.LeftContent>
      <SC.Content>
        {paramTypeNamesData &&
          paramTypesConfig &&
          inventoryObjectParams &&
          Object.values(inventoryObjectParams).map(({ tprm_id, value }) => (
            <SC.ContentItem key={tprm_id}>
              <SC.TypographyStyled>{paramTypeNamesData[tprm_id]}</SC.TypographyStyled>

              <SC.TypographyStyled variant="body2">
                {transformValue({
                  value,
                  valType: paramTypesConfig[tprm_id].val_type,
                  disableTimezoneAdjustment,
                  crop: !currentDataExpanded[tprm_id],
                })}
              </SC.TypographyStyled>

              <SC.ButtonContainer>
                {['str', 'int', 'float'].includes(paramTypesConfig[tprm_id].val_type) &&
                  transformValue({
                    value,
                    valType: paramTypesConfig[tprm_id].val_type,
                    disableTimezoneAdjustment,
                  }).length > 50 && (
                    <IconButtonStyled
                      onClick={() =>
                        setCurrentDataExpanded((prev) => ({
                          ...prev,
                          [tprm_id]: !prev[tprm_id],
                        }))
                      }
                      customSx={{
                        rotate: `${currentDataExpanded[tprm_id] ? 180 : 0}deg`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <KeyboardArrowDown />
                    </IconButtonStyled>
                  )}
              </SC.ButtonContainer>
            </SC.ContentItem>
          ))}

        {parentIdOptions && objectByFilters && updateObjectBody && (
          <SC.Content>
            <SC.TypographyStyled>{translate('System data')}</SC.TypographyStyled>

            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                gap: '20px',
              }}
            >
              {parentIdOptions.p_id && (
                <SystemDataAttribute
                  name={translate('Parent Name')}
                  value={objectByFilters.parent_name}
                  isLink={false}
                />
              )}
              {parentIdOptions.point_a_id && (
                <SystemDataAttribute
                  name={translate('Point A')}
                  value={objectByFilters.point_a_name}
                  isLink={false}
                />
              )}
              {parentIdOptions.point_b_id && (
                <SystemDataAttribute
                  name={translate('Point B')}
                  value={objectByFilters.point_b_name}
                  isLink={false}
                />
              )}
            </Box>
          </SC.Content>
        )}
      </SC.Content>
    </SC.LeftContent>
  );
};
