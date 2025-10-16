import { IconButton, Modal, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLabeledOperators } from '4_features/ruleManagerDiagram';
import {
  INestedFilterColumn,
  INestedMultiFilterForm,
  NestedMultiFilter,
  TableColumn,
  useDataflowPage,
  useTranslate,
} from '6_shared';
import { Pipeline } from '6_shared/api/dataview/types';

import * as SC from './FilterModal.styled';

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  columns: TableColumn<Pipeline>[];
}

export const FilterModal = ({ isOpen, setIsOpen, columns }: IProps) => {
  const translate = useTranslate();

  const { filterFormState, setFilterFormState } = useDataflowPage();

  const {
    data: labeledOperators,
    isError: isOperatorsError,
    isFetching: isOperatorsFetching,
  } = useLabeledOperators();

  const onApplyFilter = (filterForm: INestedMultiFilterForm) => {
    setFilterFormState(filterForm);
    setIsOpen(false);
  };
  const onClear = () => {
    setFilterFormState(null);
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SC.ModalContent>
        <SC.Header>
          <Typography>{translate('Filters settings')}</Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <Close />
          </IconButton>
        </SC.Header>
        <NestedMultiFilter
          onApply={onApplyFilter}
          onClear={onClear}
          disableTitle
          disableExpandAllButton
          multiFilterData={{
            columnsData: {
              list: columns.reduce((acc, col) => {
                if (col.key === 'tags') {
                  const option = {
                    id: col.key,
                    name: col.title,
                    type: 'str',
                  };
                  acc.push(option);
                }
                return acc;
              }, [] as INestedFilterColumn[]),
              isLoading: isOperatorsFetching,
              isError: isOperatorsError,
            },
            filterState: filterFormState,
            operatorsData: {
              str: {
                '=': 'eq',
              },
            },
          }}
        />
      </SC.ModalContent>
    </Modal>
  );
};
