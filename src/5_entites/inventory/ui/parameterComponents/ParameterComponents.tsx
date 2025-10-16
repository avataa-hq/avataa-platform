import { Box, SxProps, Theme } from '@mui/material';
import {
  BooleanComponent,
  BooleanMultipleComponent,
  DateComponent,
  DateMultipleComponent,
  DateTimeComponent,
  DateTimeMultipleComponent,
  EnumComponent,
  EnumMultipleComponent,
  LinkToObjectComponent,
  LinkToObjectMultipleComponent,
  LinkToParameterComponent,
  LinkToParameterMultipleComponent,
  LinkToUserComponent,
  LinkToUserMultipleComponent,
  StringComponent,
  StringMultipleComponent,
} from '5_entites/inventory/attributes';
import { ICreateTooltipTextProps, IParams } from '5_entites';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  showDeleteButton?: boolean;
  onDeleteClick?: (paramTypeId: number) => void;
  endButtonSlot?: React.ReactNode;
  createTooltipText?: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  customComponentWrapperStyles?: React.CSSProperties;
  customNotMultipleWrapperSx?: SxProps<Theme>;
  customMultipleWrapperSx?: SxProps<Theme>;
  showExpandButton?: boolean;
  isParamResolver?: boolean;
  testid?: string;
}

export const ParameterComponents = ({
  param,
  isEdited,
  showDeleteButton,
  onDeleteClick,
  endButtonSlot,
  createTooltipText,
  customComponentWrapperStyles,
  customNotMultipleWrapperSx,
  customMultipleWrapperSx,
  showExpandButton,
  isParamResolver,
  testid,
}: IProps) => {
  return (
    <>
      {!param.multiple && (
        <Box component="div" sx={{ ...customNotMultipleWrapperSx }}>
          {['str', 'int', 'float', 'formula', 'sequence'].includes(param.val_type) && (
            <StringComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              createTooltipText={createTooltipText}
              isParamResolver={isParamResolver}
              customWrapperStyles={customComponentWrapperStyles}
              showExpandButton={showExpandButton}
              testid={testid}
            />
          )}

          {param.val_type === 'bool' && (
            <BooleanComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}

          {param.val_type === 'date' && (
            <DateComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}

          {param.val_type === 'datetime' && (
            <DateTimeComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}

          {['two-way link', 'mo_link'].includes(param.val_type) && (
            <LinkToObjectComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              createTooltipText={createTooltipText}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}

          {param.val_type === 'prm_link' && (
            <LinkToParameterComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              createTooltipText={createTooltipText}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}

          {param.val_type === 'user_link' && (
            <LinkToUserComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}

          {param.val_type === 'enum' && (
            <EnumComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              customWrapperStyles={customComponentWrapperStyles}
              testid={testid}
            />
          )}
        </Box>
      )}

      {param.multiple && (
        <Box component="div" sx={{ ...customMultipleWrapperSx }}>
          {['str', 'int', 'float'].includes(param.val_type) && (
            <StringMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              createTooltipText={createTooltipText}
              isParamResolver={isParamResolver}
            />
          )}

          {param.val_type === 'bool' && (
            <BooleanMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
            />
          )}

          {param.val_type === 'date' && (
            <DateMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
            />
          )}

          {param.val_type === 'datetime' && (
            <DateTimeMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
            />
          )}

          {param.val_type === 'mo_link' && (
            <LinkToObjectMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              createTooltipText={createTooltipText}
            />
          )}

          {param.val_type === 'prm_link' && (
            <LinkToParameterMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
              createTooltipText={createTooltipText}
            />
          )}

          {param.val_type === 'user_link' && (
            <LinkToUserMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
            />
          )}

          {param.val_type === 'enum' && (
            <EnumMultipleComponent
              param={param}
              isEdited={isEdited || false}
              onDeleteClick={onDeleteClick}
              showDeleteButton={showDeleteButton}
              endButtonSlot={endButtonSlot}
            />
          )}
        </Box>
      )}
    </>
  );
};
