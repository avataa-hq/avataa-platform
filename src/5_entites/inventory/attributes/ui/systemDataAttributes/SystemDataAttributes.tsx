import { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { AccordionDetails, Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  ExpandMore,
  FormatIndentDecrease as FormatIndentDecreaseIcon,
  FormatIndentIncrease as FormatIndentIncreaseIcon,
} from '@mui/icons-material';
import {
  ActionTypes,
  IInventoryObjectModel,
  InventoryObjectTypesModel,
  ObjectByFilters,
  useTranslate,
} from '6_shared';
import { ISystemDataAttributesUpdateBody, type ParentIDOption } from '5_entites';
import { formatObjectName } from '5_entites/inventory/lib';
import { AccordionStyled, AccordionSummaryContent } from '../Attributes.styled';
import { useLinkClicks } from '../../../lib/table/useLinkClicks';
import { SystemDataAttribute } from './SystemDataAttribute';
import { SystemDataAttributesAutocomplete } from './SystemDataAttributesAutocomplete';
import * as SC from '../Attributes.styled';

interface IProps {
  isSystemDataExpanded: boolean;
  setIsSystemDataExpanded: (arg: boolean) => void;
  isAllExpanded: boolean;
  handleExpandAll: () => void;
  objectAttributes: ObjectByFilters;
  isEdited: boolean;
  inventoryObjectTypeData: InventoryObjectTypesModel | undefined;
  inventoryObjectData: IInventoryObjectModel | undefined;
  onApplyChanges?: () => Promise<void>;
  onCloseChanges?: () => void;
  onEditClick?: () => void;
  setSystemDataAttributesUpdateBody?: (body: ISystemDataAttributesUpdateBody | null) => void;
  newDrawerWidth?: number;
  setParamsResolverParentIdOptions?: (options: Record<string, ParentIDOption> | null) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const SystemDataAttributes = ({
  isSystemDataExpanded,
  setIsSystemDataExpanded,
  isAllExpanded,
  handleExpandAll,
  objectAttributes,
  isEdited,
  inventoryObjectTypeData,
  inventoryObjectData,
  onApplyChanges,
  onCloseChanges,
  onEditClick,
  setSystemDataAttributesUpdateBody,
  setParamsResolverParentIdOptions,
  newDrawerWidth = 320,
  permissions,
}: IProps) => {
  const {
    p_id,
    parent_name,
    point_a_id,
    point_a_name,
    point_b_id,
    point_b_name,
    id,
    creation_date,
    modification_date,
    version,
    name,
    label,
  } = objectAttributes;

  const translate = useTranslate();
  const { formState } = useFormContext();

  const [parentIDOption, setParentIDOption] = useState<ParentIDOption | null>(
    p_id && parent_name && inventoryObjectData?.p_id === p_id
      ? {
          id: p_id,
          name: parent_name,
        }
      : null,
  );
  const [pointAOption, setPointAOption] = useState<ParentIDOption | null>(
    point_a_id && point_a_name && inventoryObjectData?.point_a_id === point_a_id
      ? {
          id: point_a_id,
          name: point_a_name,
        }
      : null,
  );
  const [pointBOption, setPointBOption] = useState<ParentIDOption | null>(
    point_b_id && point_b_name && inventoryObjectData?.point_b_id === point_b_id
      ? {
          id: point_b_id,
          name: point_b_name,
        }
      : null,
  );

  const tmoParentId = useMemo(() => {
    return inventoryObjectTypeData?.p_id ?? null;
  }, [inventoryObjectTypeData?.p_id]);

  const pointsConstraintByTmo = useMemo(
    () => inventoryObjectTypeData?.points_constraint_by_tmo ?? [],
    [inventoryObjectTypeData],
  );

  useEffect(() => {
    const updatedOptions: Record<string, ParentIDOption> = {};

    if (parentIDOption) {
      updatedOptions.p_id = {
        ...parentIDOption,
        optionName: 'Parent Name',
      };
    }

    if (pointAOption) {
      updatedOptions.point_a_id = {
        ...pointAOption,
        optionName: 'Point A',
      };
    }

    if (pointBOption) {
      updatedOptions.point_b_id = {
        ...pointBOption,
        optionName: 'Point B',
      };
    }

    if (Object.keys(updatedOptions).length !== 0) {
      setParamsResolverParentIdOptions?.(updatedOptions);
    }
  }, [parentIDOption, pointAOption, pointBOption]);

  useEffect(() => {
    if (isEdited && p_id && parent_name != null) {
      setParentIDOption({
        id: p_id,
        name: formatObjectName(parent_name),
      });
    }
  }, [isEdited, p_id, parent_name]);

  useEffect(() => {
    if (isEdited && point_a_id && point_a_name != null) {
      setPointAOption({
        id: point_a_id,
        name: formatObjectName(point_a_name),
      });
    }
  }, [isEdited, point_a_id, point_a_name]);

  useEffect(() => {
    if (isEdited && point_b_id && point_b_name != null) {
      setPointBOption({
        id: point_b_id,
        name: formatObjectName(point_b_name),
      });
    }
  }, [isEdited, point_b_id, point_b_name]);

  useEffect(() => {
    if (
      inventoryObjectData &&
      (parentIDOption?.id !== p_id ||
        pointAOption?.id !== point_a_id ||
        pointBOption?.id !== point_b_id)
    ) {
      setSystemDataAttributesUpdateBody?.({
        id: inventoryObjectData.id,
        version: inventoryObjectData.version,
        p_id: parentIDOption?.id ?? null,
        point_a_id: pointAOption?.id ?? null,
        point_b_id: pointBOption?.id ?? null,
      });
    }
  }, [
    id,
    p_id,
    parentIDOption?.id,
    pointAOption,
    pointBOption,
    point_a_id,
    point_b_id,
    setSystemDataAttributesUpdateBody,
    version,
    inventoryObjectData,
  ]);

  const { openObjectInDetails } = useLinkClicks({});

  const onLinkClick = (objId: number | null) => {
    if (!objId) return;
    openObjectInDetails(objId);
  };

  return (
    <AccordionStyled expanded={isSystemDataExpanded}>
      <SC.AccordionSummaryStyled
        expandIcon={<ExpandMore onClick={() => setIsSystemDataExpanded(!isSystemDataExpanded)} />}
      >
        <AccordionSummaryContent>
          <Tooltip
            title={translate('System data').length > 11 ? translate('System data') : ''}
            placement="top"
          >
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '90px',
                whiteSpace: 'nowrap',
              }}
            >
              {translate('System data')}
            </Typography>
          </Tooltip>

          <Box component="div">
            {!isEdited && (
              <Box component="div" display="flex" alignItems="center">
                <SC.IconButtonStyled
                  disabled={!(permissions?.update ?? true)}
                  onClick={onEditClick}
                >
                  <SC.EditIconStyled />
                </SC.IconButtonStyled>
                <IconButton onClick={handleExpandAll}>
                  {isAllExpanded ? <FormatIndentDecreaseIcon /> : <FormatIndentIncreaseIcon />}
                </IconButton>
              </Box>
            )}

            {isEdited && (
              <Box component="div" display="flex">
                <SC.ApplyButtonStyled
                  onClick={onApplyChanges}
                  disabled={Object.keys(formState.errors).length > 0}
                >
                  <SC.ApplyIconStyled />
                </SC.ApplyButtonStyled>
                <IconButton onClick={onCloseChanges}>
                  <SC.CancelChangesIconStyled />
                </IconButton>
              </Box>
            )}
          </Box>
        </AccordionSummaryContent>
      </SC.AccordionSummaryStyled>
      <AccordionDetails>
        <Box
          component="div"
          sx={{
            display: newDrawerWidth > 698 ? 'grid' : 'flex',
            flexDirection: 'column',
            gap: '20px',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          {!isEdited && (
            <>
              <SystemDataAttribute
                name={translate('Parent Name')}
                value={parent_name}
                onClick={() => onLinkClick(p_id)}
                isLink={!!parent_name}
              />
              <SystemDataAttribute
                name={translate('Point A')}
                value={point_a_name}
                onClick={() => onLinkClick(point_a_id)}
                isLink={!!point_a_name}
              />
              <SystemDataAttribute
                name={translate('Point B')}
                value={point_b_name}
                onClick={() => onLinkClick(point_b_id)}
                isLink={!!point_b_name}
              />
            </>
          )}
          {isEdited && (
            <Box
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <SystemDataAttributesAutocomplete
                attributeOption={parentIDOption}
                setAttributeOption={setParentIDOption}
                label={translate('Parent Name')}
                tmoParentId={tmoParentId}
              />
              <SystemDataAttributesAutocomplete
                attributeOption={pointAOption}
                setAttributeOption={setPointAOption}
                label={translate('Point A')}
                pointsConstraintByTmo={pointsConstraintByTmo}
              />
              <SystemDataAttributesAutocomplete
                attributeOption={pointBOption}
                setAttributeOption={setPointBOption}
                label={translate('Point B')}
                pointsConstraintByTmo={pointsConstraintByTmo}
              />
            </Box>
          )}
          <SystemDataAttribute name={translate('Name')} value={name} />
          <SystemDataAttribute name={translate('Label')} value={label} />
          <SystemDataAttribute
            name={translate('Object ID')}
            value={id}
            onClick={() => onLinkClick(id)}
            isLink={!!id}
          />
          <SystemDataAttribute name={translate('Creation Date')} value={creation_date} />
          <SystemDataAttribute name={translate('Modification Date')} value={modification_date} />
        </Box>
      </AccordionDetails>
    </AccordionStyled>
  );
};
