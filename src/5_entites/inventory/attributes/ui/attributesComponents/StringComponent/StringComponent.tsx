import { useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';
import { Typography, useTheme } from '@mui/material';
import { CustomTooltip, DeleteButton, ICreateTooltipTextProps, IParams, Wrapper } from '5_entites';
import { InputWithIcon, usePatternConverts, useTranslate } from '6_shared';
import * as SC from './StringComponent.styled';

interface IProps {
  param: IParams;
  isEdited: boolean;
  onDeleteClick?: (paramTypeId: number) => void;
  createTooltipText?: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  isParamResolver?: boolean;
  customWrapperStyles?: React.CSSProperties;
  showExpandButton?: boolean;
  testid?: string;
}

export const StringComponent = ({
  param,
  isEdited,
  onDeleteClick,
  createTooltipText,
  showDeleteButton = true,
  endButtonSlot,
  isParamResolver,
  customWrapperStyles,
  showExpandButton = false,
  testid,
}: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();
  const { control, setError, unregister, clearErrors } = useFormContext();
  const { patternConverts } = usePatternConverts();

  const [expanded, setExpanded] = useState(false);

  const parsedIntConstraint = useMemo(() => {
    if (!param.constraint || param.val_type !== 'int') return {};
    const [min, max] = param.constraint.split(':').map(Number);
    return { min, max };
  }, [param.constraint, param.val_type]);

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    let { value } = e.target;

    if (['int'].includes(param.val_type)) {
      value = value.replace(/^0+(?=\d)/, '');
    }

    field.onChange({ ...e, target: { ...e.target, value } });

    // field.onChange(e);

    // const { value } = e.target;

    if (value.trim() === '') {
      if (!isParamResolver && !param.value) {
        clearErrors(param.tprm_id.toString());
        unregister(param.tprm_id.toString());
        return;
      }

      if (isParamResolver || param.value) {
        setError(param.tprm_id.toString(), {
          type: 'required',
          message: translate('This field is required'),
        });
      }
    }

    if (param.val_type === 'int' && !/^-?\d+$/.test(value)) {
      setError(param.tprm_id.toString(), {
        type: 'required',
        message: translate('Please enter a valid number'),
      });
    }

    if (param.val_type === 'float' && !/^-?[0-9]*(\.[0-9]+)?$/.test(value)) {
      setError(param.tprm_id.toString(), {
        type: 'pattern',
        message: translate('Please enter a valid float'),
      });
    }

    if (param.val_type === 'sequence' && !/^[1-9]\d*$/.test(value)) {
      setError(param.tprm_id.toString(), {
        type: 'pattern',
        message: translate('Please enter a positive integer'),
      });
    }
  };

  const tooltipText = useMemo(() => {
    return (
      createTooltipText?.({
        paramValType: param.val_type,
        paramConstraint: param.constraint,
      }) ?? ''
    );
  }, [createTooltipText, param.val_type, param.constraint]);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <CustomTooltip tooltipText={tooltipText}>
      <Controller
        control={control}
        name={param.tprm_id.toString()}
        defaultValue={param.value ?? ''}
        rules={{
          required: param.required || param.primary ? translate('This field is required') : false,
          pattern: patternConverts(param.val_type),
          min: {
            value: parsedIntConstraint.min ?? -Infinity,
            message: `${translate('Minimum value is')}: ${parsedIntConstraint.min}`,
          },
          max: {
            value: parsedIntConstraint.max ?? Infinity,
            message: `${translate('Maximum value is')}: ${parsedIntConstraint.max}`,
          },
          // validate: {
          //   noEmptySpaces: (value) =>
          //     value?.toString().trim() !== '' ||
          //     translate('This field cannot be empty or contain only spaces'),
          // },
        }}
        render={({ field, fieldState }) => (
          <>
            <Wrapper
              sx={{
                paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
              }}
              style={{ ...customWrapperStyles }}
            >
              <InputWithIcon
                multiline
                // eslint-disable-next-line no-nested-ternary
                rows={showExpandButton ? (expanded ? undefined : 1) : undefined}
                height="auto"
                value={param.value ?? ''}
                widthPercent
                disabled={!isEdited}
                data-testid={testid}
                placeHolderText="Value"
                customStyles={{
                  border: !isEdited ? 'none' : `1px solid ${theme.palette.neutralVariant.outline}`,
                  minHeight: '37px',
                  padding: '0 10px',
                }}
                customSX={{
                  '&.MuiInputBase-root.Mui-disabled': {
                    color: !isEdited ? theme.palette.text.primary : 'currentcolor',
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: 'currentcolor',
                    },
                  },
                }}
                inputProps={{
                  ...field,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    onFieldChange(e, field);
                  },
                }}
              />
              {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
              {endButtonSlot}
            </Wrapper>

            {fieldState.error && (
              <Typography fontSize={10} color="error">
                {fieldState.error.message}
              </Typography>
            )}

            {showExpandButton && param.value.length > 50 && !fieldState.error && (
              <SC.ExpandButton onClick={() => handleExpand()}>
                {expanded ? translate('Collapse') : translate('Expand')}
              </SC.ExpandButton>
            )}
          </>
        )}
      />
    </CustomTooltip>
  );
};
