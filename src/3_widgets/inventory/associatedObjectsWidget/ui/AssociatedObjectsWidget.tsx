import { AssociatedObjectsComponent } from '4_features';
import { ActionTypes, useAssociatedObjects } from '6_shared';
import { useGetAssociatedObjectsData } from '../api/useGetAssociatedObjectsData';

interface IProps {
  permissions?: Record<ActionTypes, boolean>;
  setIsFindPathOpen?: (value: boolean) => void;
}

export const AssociatedObjectsWidget = ({ permissions, setIsFindPathOpen }: IProps) => {
  const {
    detailedView: { pagination },
    associatedObjectType,
    skipFetching,
    isOpenAssociatedTableModal,
    selectedObjectRequestData,
  } = useAssociatedObjects();

  const {
    currentTMOModel,
    commonViewRows,
    isLoadingData,
    linkTotalCount,
    inventoryObjectData,
    childObjects,
    isChildObjectsError,
  } = useGetAssociatedObjectsData({
    skipFetching: skipFetching || !isOpenAssociatedTableModal,
    associatedObjectType,
    selectedObjectData: selectedObjectRequestData,
    pagination,
  });

  return (
    <AssociatedObjectsComponent
      permissions={permissions}
      isOpen={isOpenAssociatedTableModal}
      detailedViewTmoModel={currentTMOModel}
      commonViewRows={commonViewRows}
      isDataLoading={isLoadingData}
      commonViewRowsTotalCount={linkTotalCount}
      inventoryObjectData={inventoryObjectData}
      parentId={inventoryObjectData?.id}
      associatedObjectType={associatedObjectType}
      childObjects={childObjects}
      setIsFindPathOpen={setIsFindPathOpen}
    />
  );
};
