import {
  useCreateGroup,
  useAddElementsToGroup,
  useDeleteGroup,
  useCreateGroupTemplate,
} from '4_features';
import { useGetAllGroups } from '5_entites';
import {
  ICreateGroupBody,
  IElementsMutationRequestParams,
  IGroupTemplatesBody,
  IProcessGroupModel,
  PmSelectedRow,
  SeverityProcessModelData,
} from '6_shared';
import { useEffect, useState } from 'react';

interface IProps {
  selectedRows: PmSelectedRow[];
  selectedRow: SeverityProcessModelData | null;
  refetchAfterSuccess: () => void;
  skip?: boolean;

  setIsOpenTemplateDialog?: (isOpen: boolean) => void;
}

export const useProcessGroups = ({
  selectedRows,
  selectedRow,
  refetchAfterSuccess,
  setIsOpenTemplateDialog,
  skip,
}: IProps) => {
  const [allProcessGroup, setAllProcessGroup] = useState<IProcessGroupModel[]>([]);
  const [newOffset, setNewOffset] = useState(0);
  const [totalGroups, setTotalGroups] = useState<number | null>(null);

  const { data, isFetching } = useGetAllGroups({
    newOffset,
    skip: totalGroups !== null && newOffset >= totalGroups,
  });

  const { createNewGroup, isLoadingCreateGroup } = useCreateGroup();
  const { addElements, isLoadingAddElementsToGroup } = useAddElementsToGroup();
  const { deleteGroup, isLoadingDeleteGroup } = useDeleteGroup();
  const { createTemplate, isLoadingGroupTemplateCreation } = useCreateGroupTemplate({
    setIsOpenDialog: setIsOpenTemplateDialog,
  });

  useEffect(() => {
    if (data) {
      setTotalGroups(data.total);
      setAllProcessGroup(data.groups);
    }
  }, [data]);

  const onAddElementsToGroup = async (group: IProcessGroupModel | string) => {
    const responseBody: IElementsMutationRequestParams = {
      group_name: typeof group === 'string' ? group : group.group_name,
      body: selectedRows.map((i) => ({ entity_id: +i.id })),
    };

    await addElements(responseBody);
    refetchAfterSuccess();
  };

  const onCreateGroup = async (body: ICreateGroupBody) => {
    const tmo_id = selectedRow?.tmo_id;
    if (tmo_id) {
      const response = await createNewGroup(body);
      if (response) refetchAfterSuccess();
    }
  };

  const onDeleteGroup = async (group: string[]) => {
    await deleteGroup(group);
    refetchAfterSuccess();
  };

  const onCreateGroupTemplate = async (body: IGroupTemplatesBody) => {
    await createTemplate(body);
  };

  return {
    onCreateGroup,
    isLoadingCreateGroup,

    onAddElementsToGroup,

    onDeleteGroup,
    isLoadingDeleteGroup,
    isLoadingAddElementsToGroup,
    allProcessGroup,

    isFetchingAllProcessGroup: isFetching,

    totalGroups,
    setNewOffset,

    onCreateGroupTemplate,
    isLoadingGroupTemplateCreation,
  };
};
