import { memo } from 'react';
import { Box, MenuItem, Tooltip, Typography } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { IParams, ParentIDOption } from '5_entites';
import { ParameterComponents } from '5_entites/inventory/ui';
import { SystemDataAttributesAutocomplete } from '5_entites/inventory/attributes/ui/systemDataAttributes/SystemDataAttributesAutocomplete';
import { useTranslate } from '6_shared';
import { IconButtonStyled } from '../components';
import * as SC from '../ParamVersionsResolver.styled';

const commonWrapperStyles = {
  alignItems: 'center',
  gap: '10px',
};

interface IProps {
  editingParams: IParams[];
  editingAttributes: ParentIDOption[];
  handleRemoveParam: (tprmId: number) => void;
  handleRemoveAttribute: (id: number, attrName: string) => void;
  setParentIDOption: (newOption: ParentIDOption | null, attrName?: string) => void;
}

export const ApplyData = memo(
  ({
    editingParams,
    editingAttributes,
    handleRemoveParam,
    handleRemoveAttribute,
    setParentIDOption,
  }: IProps) => {
    const translate = useTranslate();

    return (
      <SC.MiddleContent>
        <SC.Content>
          {editingParams &&
            editingParams.map((param) => (
              <Box component="div" width="100%" key={param.tprm_id}>
                <Typography>{param.name}</Typography>
                <ParameterComponents
                  param={param}
                  isEdited
                  showDeleteButton={false}
                  showExpandButton
                  isParamResolver
                  endButtonSlot={
                    !param.multiple ? (
                      <IconButtonStyled onClick={() => handleRemoveParam(param.tprm_id)}>
                        <KeyboardArrowRight />
                      </IconButtonStyled>
                    ) : (
                      <Tooltip title={translate('Remove')} placement="left">
                        <MenuItem onClick={() => handleRemoveParam(param.tprm_id)}>
                          <KeyboardArrowRight />
                        </MenuItem>
                      </Tooltip>
                    )
                  }
                  customComponentWrapperStyles={commonWrapperStyles}
                  testid={`param-versions-resolver__${param.name}`}
                />
              </Box>
            ))}
        </SC.Content>

        <SC.Content>
          {editingAttributes.length !== 0 &&
            editingAttributes.map((attr) => (
              <SC.ContentItem key={attr.id}>
                <SystemDataAttributesAutocomplete
                  attributeOption={attr}
                  setAttributeOption={setParentIDOption}
                  label={translate(attr.optionName as any) || ''}
                />

                <IconButtonStyled
                  onClick={() => handleRemoveAttribute(attr.id, attr.optionName || '')}
                >
                  <KeyboardArrowRight />
                </IconButtonStyled>
              </SC.ContentItem>
            ))}
        </SC.Content>
      </SC.MiddleContent>
    );
  },
);
