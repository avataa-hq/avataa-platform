import Button from '@mui/material/Button';
import { SyntheticEvent, useRef, useState } from 'react';
import { Checkbox, CircularProgress, Input, Typography } from '@mui/material';
import { ICreateGroupBody, INestedFilterForwardRef, INestedMultiFilterForm } from '6_shared';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Body,
  BodyContentText,
  CreateGroupStyled,
  FooterButtonContainer,
  Footer,
  Header,
  BodyItem,
} from './CreateGroup.styled';
import { GroupInput } from '../../ui/groupInput/GroupInput';
import { ElementsFilterButton } from '../../ui/elementsFilterButton/ElementsFilterButton';
import { ElementsFilter } from '../../ui/elementsFilter/ElementsFilter';

const EMPTY_GROUP_NAME_ERROR_MESSAGE = 'Group name cannot be empty';

const getCreateGroupBody = (
  tmo_id: number,
  group_name: string,
  multiFilterForm: INestedMultiFilterForm | null,
  isAggregate?: boolean,
  min_qnt?: number,
): ICreateGroupBody => {
  const columnFilters = !multiFilterForm
    ? []
    : multiFilterForm.columnFilters.map(({ column, filters, logicalOperator }) => ({
        filters,
        columnName: column.id,
        rule: logicalOperator,
      }));

  return {
    group_info: {
      tmo_id,
      group_name,
      columnFilters,
      group_type: 'process_group',
      is_aggregate: isAggregate,
      min_qnt,
    },
  };
};

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCreate?: (body: ICreateGroupBody) => Promise<void>;
  currentTmoId?: number;
  isLoading?: boolean;
}

export const CreateGroup = ({ isOpen, setIsOpen, onCreate, currentTmoId, isLoading }: IProps) => {
  const multiFilerRef = useRef<INestedFilterForwardRef | null>(null);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isFilterMode, setIsFilterMode] = useState(false);
  const [isAggregate, setIsAggregate] = useState(false);
  const [minElementsCount, setMinElementsCount] = useState(0);
  const [selectedFilterState, setSelectedFilterState] = useState<INestedMultiFilterForm | null>(
    null,
  );
  const [expanded, setExpanded] = useState<string | false>('name');

  const clearState = () => {
    setGroupName('');
    setIsOpen(false);
    setIsError(false);
    setErrorMessage('');
    setIsAggregate(false);
    setMinElementsCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onCreateGroup = async () => {
    // validation
    if (!groupName.trim().length) {
      setIsError(true);
      setErrorMessage(EMPTY_GROUP_NAME_ERROR_MESSAGE);
    }

    if (groupName.trim().length > 0 && currentTmoId) {
      const createGroupBody = getCreateGroupBody(
        currentTmoId,
        groupName,
        selectedFilterState,
        isAggregate,
        minElementsCount,
      );
      await onCreate?.(createGroupBody);
      clearState();
    }
    handleClose();
  };

  const onAddElementsByFilterClick = () => {
    setIsFilterMode((v) => !v);
    setExpanded('filters');
  };
  const onApplyFilter = (form: INestedMultiFilterForm) => {
    setSelectedFilterState(form.columnFilters.length > 0 ? form : null);
    setIsFilterMode(false);
    setExpanded(false);
  };

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);

    if (panel === 'name') {
      setIsFilterMode(false);
    }
    if (panel === 'filters') {
      setIsFilterMode(true);
    }
  };
  return (
    <CreateGroupStyled>
      <Header>
        <Typography variant="h2">Create Group</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Typography sx={{ opacity: isAggregate ? 1 : 0.8 }} variant="body1">
            Calculate aggregates:
          </Typography>
          <Checkbox
            checked={isAggregate}
            onChange={(_, checked) => {
              setIsAggregate(checked);
            }}
          />
        </div>
      </Header>
      <Body>
        <Accordion expanded={expanded === 'name'} onChange={handleChange('name')}>
          <AccordionSummary aria-controls="name" id="panel-name" expandIcon={<ExpandMoreIcon />}>
            Group
          </AccordionSummary>
          <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <BodyContentText>You must enter the name of the new group</BodyContentText>
            <GroupInput
              value={groupName}
              setValue={setGroupName}
              setIsError={setIsError}
              isError={isError}
              errorMessage={errorMessage}
              label="Group name:"
            />

            <ElementsFilterButton
              hasFilterState={!!selectedFilterState}
              isFilterMode={isFilterMode}
              onClick={onAddElementsByFilterClick}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'filters'}>
          <AccordionSummary aria-controls="panel-filters" id="filters">
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <Typography>Add elements by filter</Typography>
              {expanded === 'filters' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Min threshold:
                  </Typography>
                  <Input
                    value={minElementsCount}
                    onChange={(event) => {
                      if (+event.target.value >= 0) {
                        setMinElementsCount(+event.target.value);
                      }
                    }}
                    sx={{ width: 100 }}
                  />
                </div>
              )}
            </div>
          </AccordionSummary>
          <BodyItem>
            <ElementsFilter
              multerFilterRef={multiFilerRef}
              selectedFilterState={selectedFilterState}
              onApplyFilter={onApplyFilter}
              currentTmoId={currentTmoId}
              skipResponse={!isOpen}
            />
          </BodyItem>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
            <Button
              onClick={() => {
                multiFilerRef.current?.onApply?.();
              }}
            >
              Save Filters
            </Button>
          </div>
        </Accordion>
      </Body>

      <Footer>
        <FooterButtonContainer>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={isError || (isFilterMode && !selectedFilterState) || !groupName || isLoading}
            variant="contained"
            onClick={onCreateGroup}
          >
            {isLoading ? <CircularProgress size={22} /> : 'Create'}
          </Button>
        </FooterButtonContainer>
      </Footer>
    </CreateGroupStyled>
  );
};
