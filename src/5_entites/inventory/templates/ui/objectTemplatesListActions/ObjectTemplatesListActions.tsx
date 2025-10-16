import {
  IconButton,
  ActionTypes,
  CheckCircleOutlineIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  CircularProgress,
  type IGetTemplatesByFilterModel,
  type IObjectTemplateModel,
} from '6_shared';

interface IProps {
  item: IGetTemplatesByFilterModel;
  selectedTemplateId?: number | null;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  buildTemplatesFormDataLoading?: boolean;
  isEditTemplateName?: boolean;
  editedTemplateName?: string;
  setEditedTemplateName?: (name: string) => void;
  onEditTemplateClick?: (template: IObjectTemplateModel) => void;
  onApplyEditTemplateName?: (newTemplateName: string) => void;
  onCloseEditTemplateName?: () => void;
  onDeleteTemplateClick?: (template: IObjectTemplateModel) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const ObjectTemplatesListActions = ({
  item,
  selectedTemplateId,
  showEditButton = true,
  showDeleteButton = true,
  buildTemplatesFormDataLoading,
  isEditTemplateName,
  editedTemplateName,
  setEditedTemplateName,
  onEditTemplateClick,
  onApplyEditTemplateName,
  onCloseEditTemplateName,
  onDeleteTemplateClick,
  permissions,
}: IProps) => {
  return (
    <div>
      {buildTemplatesFormDataLoading && selectedTemplateId === item.id && (
        <CircularProgress size={20} />
      )}
      {isEditTemplateName && selectedTemplateId === item.id && (
        <>
          <IconButton
            disabled={permissions?.update !== true}
            onClick={() => {
              onApplyEditTemplateName?.(editedTemplateName || '');
            }}
          >
            <CheckCircleOutlineIcon />
          </IconButton>
          <IconButton
            disabled={permissions?.update !== true}
            onClick={() => {
              setEditedTemplateName?.('');
              onCloseEditTemplateName?.();
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      )}

      {showEditButton && !isEditTemplateName && selectedTemplateId === item.id && (
        <IconButton
          disabled={permissions?.update !== true}
          onClick={() => {
            setEditedTemplateName?.(item.name);
            onEditTemplateClick?.(item);
          }}
        >
          <EditIcon />
        </IconButton>
      )}
      {showDeleteButton && !isEditTemplateName && selectedTemplateId === item.id && (
        <IconButton
          disabled={permissions?.update !== true}
          onClick={() => {
            onDeleteTemplateClick?.(item);
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};
