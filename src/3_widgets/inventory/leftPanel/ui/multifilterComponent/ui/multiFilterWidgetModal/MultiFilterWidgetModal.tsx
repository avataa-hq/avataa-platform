import { useEffect, useState } from 'react';
import { NestedMultiFilterOperators, INestedMultiFilterForm, NestedMultiFilter } from '6_shared';
import { Box, Modal } from '@mui/material';
import { ObjectTypeAutocomplete } from '5_entites';
import styled from '@emotion/styled';
import { useMultiFilterModalData } from '../../lib/useMultiFilterModalData';

const Content = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  min-width: 500px;
  max-width: 850px;
  //height: 50%;
  background: ${({ theme: { palette } }) => palette.background.paper};
  backdrop-filter: blur(10px);
  border-radius: 20px;
`;

interface IMultiFilterWidgetModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onApplyFilter?: (formData: INestedMultiFilterForm) => void;
  filterState?: INestedMultiFilterForm | null;
  operatorsData?: NestedMultiFilterOperators;
}

export const MultiFilterWidgetModal = ({
  isOpen,
  setIsOpen,
  onApplyFilter,
  filterState,
  operatorsData,
}: IMultiFilterWidgetModalProps) => {
  const [isNeedForceReset, setIsNeedForceReset] = useState(false);
  const {
    selectedTmo,
    setSelectedTmo,
    isErrorObjectTypes,
    isFetchingObjectTypes,
    isFetchingParamTypes,
    objectTypeList,
    columnsList,
    isErrorParamTypes,
  } = useMultiFilterModalData(!isOpen);

  useEffect(() => {
    if (filterState && filterState.selectedTmo) {
      setSelectedTmo(filterState.selectedTmo);
    }
  }, [filterState]);

  useEffect(() => {
    setIsNeedForceReset(true);
    setTimeout(() => {
      setIsNeedForceReset(false);
    }, 0);
  }, [selectedTmo]);

  useEffect(() => {
    if (!isOpen) setSelectedTmo(null);
  }, [isOpen]);

  const onApply = (formData: INestedMultiFilterForm) => {
    if (selectedTmo) {
      const data: INestedMultiFilterForm = { ...formData, selectedTmo };
      onApplyFilter?.(data);
      setSelectedTmo(null);
    }
  };

  return (
    <Modal
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Content>
        <NestedMultiFilter
          withName
          withSharingSettings
          forceReset={isNeedForceReset}
          onApply={onApply}
          headerRightSlot={
            <ObjectTypeAutocomplete
              value={selectedTmo}
              options={objectTypeList}
              isLoading={isFetchingObjectTypes}
              isError={isErrorObjectTypes}
              onChange={setSelectedTmo}
              readonly={filterState?.readonly}
            />
          }
          multiFilterData={{
            columnsData: {
              list: columnsList,
              isError: isErrorParamTypes,
              isLoading: isFetchingParamTypes,
            },
            filterState,
            operatorsData: operatorsData ?? undefined,
          }}
        />
      </Content>
    </Modal>
  );
};
