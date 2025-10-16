import { enqueueSnackbar } from 'notistack';
import { EditableText, useTranslate, useWorkflows } from '6_shared';
import { setBpmnDiagramName } from 'components/contentOfWorkflows/lib';

export const DiagramName = () => {
  const translate = useTranslate();

  const {
    activeItem,
    newItem,
    bpmnModeler,
    uniqueWorkflowsNames,
    setActiveItem,
    setIsDiagramChanged,
    setNewItem,
  } = useWorkflows();

  return (
    <EditableText
      initialValue={activeItem.item?.name || activeItem.item?.key || ''}
      uniqueWorkflowsNames={uniqueWorkflowsNames}
      onAccept={async (value) => {
        if (!value.trim()) return;

        if (uniqueWorkflowsNames.includes(value.trim())) {
          enqueueSnackbar({
            variant: 'error',
            message: translate('Workflow name already exists'),
          });
          return;
        }

        if (bpmnModeler) await setBpmnDiagramName(bpmnModeler, value);

        if (newItem.item && newItem.item.key === activeItem.item?.key) {
          setNewItem({
            isCollapsed: newItem.isCollapsed,
            item: { ...newItem.item, name: value },
          });
        }

        if (activeItem.item) {
          setActiveItem({
            isCollapsed: activeItem.isCollapsed,
            item: { ...activeItem.item, name: value },
          });
        }

        setIsDiagramChanged(true);
        enqueueSnackbar({
          variant: 'success',
          message: translate('Press Save button to apply changes'),
        });
      }}
    />
  );
};
