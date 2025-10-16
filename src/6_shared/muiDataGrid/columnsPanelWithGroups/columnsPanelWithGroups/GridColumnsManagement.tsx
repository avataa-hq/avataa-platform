/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import {
  getDataGridUtilityClass,
  GridColDef,
  gridColumnDefinitionsSelector,
  GridColumnVisibilityModel,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector,
} from '@mui/x-data-grid-premium';
import { DataGridPremiumProcessedProps } from '@mui/x-data-grid-premium/models/dataGridPremiumProps';
import useLazyRef from '@mui/utils/useLazyRef';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { checkColumnVisibilityModelsSame, defaultSearchPredicate } from './utils';
import ColumnsGroupsSwitch from '../ColumnsGroupsSwitch';

interface GridColumnsManagementProps {
  sort?: 'asc' | 'desc';
  searchPredicate?: (column: GridColDef, searchValue: string) => boolean;
  autoFocusSearchField?: boolean;
  disableShowHideToggle?: boolean;
  disableResetButton?: boolean;
  toggleAllMode?: 'all' | 'filteredOnly';
  getTogglableColumns?: (columns: GridColDef[]) => GridColDef['field'][];

  // *** Custom props ***
  groupedColumns: Record<string, string[]>;
  columnsVisibilityModel: GridColumnVisibilityModel;
  setColumnsModel: (model: GridColumnVisibilityModel) => void;
}

declare module '@mui/x-data-grid' {
  interface ColumnsManagementPropsOverrides {
    groupedColumns: Record<string, string[]>;
    columnsVisibilityModel: GridColumnVisibilityModel;
    setColumnsModel: (model: GridColumnVisibilityModel) => void;
  }
}

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['columnsManagement'],
    header: ['columnsManagementHeader'],
    footer: ['columnsManagementFooter'],
    row: ['columnsManagementRow'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const collator = new Intl.Collator();

const GridColumnsManagement = (props: GridColumnsManagementProps) => {
  const apiRef = useGridApiContext();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const initialColumnVisibilityModel = useLazyRef(() =>
    gridColumnVisibilityModelSelector(apiRef),
  ).current;
  const columnVisibilityModel = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const rootProps = useGridRootProps();
  const [searchValue, setSearchValue] = React.useState('');
  const classes = useUtilityClasses(rootProps);

  const {
    sort,
    searchPredicate = defaultSearchPredicate,
    autoFocusSearchField = true,
    disableShowHideToggle = false,
    disableResetButton = false,
    toggleAllMode = 'all',
    getTogglableColumns,
    groupedColumns,
    columnsVisibilityModel,
    setColumnsModel,
  } = props;

  const isResetDisabled = React.useMemo(
    () =>
      checkColumnVisibilityModelsSame(columnVisibilityModel, initialColumnVisibilityModel || {}), // Added the '|| {}' for TS
    [columnVisibilityModel, initialColumnVisibilityModel],
  );

  const sortedColumns = React.useMemo(() => {
    switch (sort) {
      case 'asc':
        return [...columns].sort((a, b) =>
          collator.compare(a.headerName || a.field, b.headerName || b.field),
        );

      case 'desc':
        return [...columns].sort(
          (a, b) => -collator.compare(a.headerName || a.field, b.headerName || b.field),
        );

      default:
        return columns;
    }
  }, [columns, sort]);

  const toggleColumn = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name: field } = event.target as HTMLInputElement;
    apiRef.current.setColumnVisibility(field, columnVisibilityModel[field] === false);
  };

  const currentColumns = React.useMemo(() => {
    const togglableColumns = getTogglableColumns ? getTogglableColumns(sortedColumns) : null;

    const togglableSortedColumns = togglableColumns
      ? sortedColumns.filter(({ field }) => togglableColumns.includes(field))
      : sortedColumns;

    if (!searchValue) {
      return togglableSortedColumns;
    }

    return togglableSortedColumns.filter((column) =>
      searchPredicate(column, searchValue.toLowerCase()),
    );
  }, [sortedColumns, searchValue, searchPredicate, getTogglableColumns]);

  const toggleAllColumns = React.useCallback(
    (isVisible: boolean) => {
      const currentModel = gridColumnVisibilityModelSelector(apiRef);
      const newModel = { ...currentModel };
      const togglableColumns = getTogglableColumns ? getTogglableColumns(columns) : null;

      (toggleAllMode === 'filteredOnly' ? currentColumns : columns).forEach((col) => {
        if (col.hideable && (togglableColumns == null || togglableColumns.includes(col.field))) {
          if (isVisible) {
            // delete the key from the model instead of setting it to `true`
            delete newModel[col.field];
          } else {
            newModel[col.field] = false;
          }
        }
      });

      return apiRef.current.setColumnVisibilityModel(newModel);
    },
    [apiRef, columns, getTogglableColumns, toggleAllMode, currentColumns],
  );

  const handleSearchValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [],
  );

  const hideableColumns = React.useMemo(
    () => currentColumns.filter((col) => col.hideable),
    [currentColumns],
  );

  const allHideableColumnsVisible = React.useMemo(
    () =>
      hideableColumns.every(
        (column) =>
          columnVisibilityModel[column.field] == null ||
          columnVisibilityModel[column.field] !== false,
      ),
    [columnVisibilityModel, hideableColumns],
  );

  const allHideableColumnsHidden = React.useMemo(
    () => hideableColumns.every((column) => columnVisibilityModel[column.field] === false),
    [columnVisibilityModel, hideableColumns],
  );

  const firstSwitchRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusSearchField) {
      searchInputRef.current!.focus();
    } else if (firstSwitchRef.current && typeof firstSwitchRef.current.focus === 'function') {
      firstSwitchRef.current.focus();
    }
  }, [autoFocusSearchField]);

  let firstHideableColumnFound = false;
  const isFirstHideableColumn = (column: GridColDef) => {
    if (firstHideableColumnFound === false && column.hideable !== false) {
      firstHideableColumnFound = true;
      return true;
    }
    return false;
  };

  // ***************************************************************************************

  const [showGroups, setShowGroups] = useState(false);

  const toggleColumnsGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name: field } = event.target as HTMLInputElement;
    if (!groupedColumns[field]) return;

    // @ts-expect-error
    const isChecked = event.target.checked!;
    const columnIds = groupedColumns[field];

    const model = columnIds.reduce((prev, item) => {
      return { ...prev, [item]: isChecked };
    }, {});

    setColumnsModel({ ...columnsVisibilityModel, ...model });
  };

  const columnsGroups = Object.keys(apiRef.current.getAllGroupDetails());

  const setColumnsGroupIsChecked = (group: string) => {
    if (!groupedColumns) return undefined;
    let isChecked: boolean = true;

    if (
      Object.keys(groupedColumns).length &&
      columnsVisibilityModel &&
      Object.keys(columnsVisibilityModel).length
    ) {
      groupedColumns[group].forEach((id) => {
        if (columnsVisibilityModel[id] === false) {
          isChecked = false;
        }
      });
    }

    return isChecked;
  };

  const [groupsSearchValue, setGroupsSearchValue] = useState('');

  const handleGroupsSearchValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setGroupsSearchValue(event.target.value);
  }, []);

  const currentColumnsGroups = useMemo(() => {
    if (!groupsSearchValue) {
      return columnsGroups;
    }
    const searchValueToCheck = groupsSearchValue.toLowerCase();
    // @ts-expect-error
    return columnsGroups.filter((column) => searchPredicate(column, searchValueToCheck));
  }, [columnsGroups, groupsSearchValue, searchPredicate]);

  const toggleToColumns = () => {
    setShowGroups(false);
  };
  const toggleToGroups = () => {
    setShowGroups(true);
  };

  return (
    <>
      <GridColumnsManagementHeader className={classes.header} ownerState={rootProps}>
        <ColumnsGroupsSwitch toggleToColumns={toggleToColumns} toggleToGroups={toggleToGroups} />
      </GridColumnsManagementHeader>
      {!showGroups && (
        <>
          <rootProps.slots.baseTextField
            placeholder={apiRef.current.getLocaleText('columnsManagementSearchTitle')}
            inputRef={searchInputRef}
            value={searchValue}
            onChange={handleSearchValueChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <rootProps.slots.baseInputAdornment position="start">
                  <rootProps.slots.quickFilterIcon />
                </rootProps.slots.baseInputAdornment>
              ),
              sx: { pl: 1.5 },
            }}
            fullWidth
            {...rootProps.slotProps?.baseTextField}
          />
          <GridColumnsManagementBody className={classes.root} ownerState={rootProps}>
            {currentColumns.map((column) => (
              <FormControlLabel
                key={column.field}
                className={classes.row}
                control={
                  <rootProps.slots.baseCheckbox
                    disabled={column.hideable === false}
                    checked={columnVisibilityModel[column.field] !== false}
                    onClick={toggleColumn}
                    name={column.field}
                    sx={{ p: 0.5 }}
                    inputRef={isFirstHideableColumn(column) ? firstSwitchRef : undefined}
                    {...rootProps.slotProps?.baseCheckbox}
                  />
                }
                label={column.headerName || column.field}
              />
            ))}
            {currentColumns.length === 0 && (
              <GridColumnsManagementEmptyText ownerState={rootProps}>
                {apiRef.current.getLocaleText('columnsManagementNoColumns')}
              </GridColumnsManagementEmptyText>
            )}
          </GridColumnsManagementBody>
        </>
      )}

      {showGroups && (
        <>
          <rootProps.slots.baseTextField
            placeholder={apiRef.current.getLocaleText('columnsManagementSearchTitle')}
            inputRef={searchInputRef}
            value={groupsSearchValue}
            onChange={handleGroupsSearchValueChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <rootProps.slots.baseInputAdornment position="start">
                  <rootProps.slots.quickFilterIcon />
                </rootProps.slots.baseInputAdornment>
              ),
              sx: { pl: 1.5 },
            }}
            fullWidth
            {...rootProps.slotProps?.baseTextField}
          />
          <GridColumnsManagementBody className={classes.root} ownerState={rootProps}>
            {currentColumnsGroups.map((group) => (
              <FormControlLabel
                key={group}
                className={classes.row}
                control={
                  <rootProps.slots.baseCheckbox
                    checked={setColumnsGroupIsChecked(group)}
                    onClick={toggleColumnsGroup}
                    name={group}
                    sx={{ p: 0.5 }}
                    {...rootProps.slotProps?.baseCheckbox}
                  />
                }
                label={group}
              />
            ))}
            {currentColumns.length === 0 && (
              <GridColumnsManagementEmptyText ownerState={rootProps}>
                {apiRef.current.getLocaleText('columnsManagementNoColumns')}
              </GridColumnsManagementEmptyText>
            )}
          </GridColumnsManagementBody>
        </>
      )}

      {(!disableShowHideToggle || !disableResetButton) && currentColumns.length > 0 ? (
        <GridColumnsManagementFooter ownerState={rootProps} className={classes.footer}>
          {!disableShowHideToggle ? (
            <FormControlLabel
              control={
                <rootProps.slots.baseCheckbox
                  disabled={hideableColumns.length === 0}
                  checked={allHideableColumnsVisible}
                  indeterminate={!allHideableColumnsVisible && !allHideableColumnsHidden}
                  onClick={() => toggleAllColumns(!allHideableColumnsVisible)}
                  name={apiRef.current.getLocaleText('columnsManagementShowHideAllText')}
                  sx={{ p: 0.5 }}
                  {...rootProps.slotProps?.baseCheckbox}
                />
              }
              label={apiRef.current.getLocaleText('columnsManagementShowHideAllText')}
            />
          ) : (
            <span />
          )}

          {!disableResetButton ? (
            <rootProps.slots.baseButton
              onClick={() =>
                apiRef.current.setColumnVisibilityModel(initialColumnVisibilityModel || {})
              } // Added the '|| {}' for TS
              disabled={isResetDisabled}
              {...rootProps.slotProps?.baseButton}
            >
              {apiRef.current.getLocaleText('columnsManagementReset')}
            </rootProps.slots.baseButton>
          ) : null}
        </GridColumnsManagementFooter>
      ) : null}
    </>
  );
};

const GridColumnsManagementBody = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagement',
  overridesResolver: (_, styles) => styles.columnsManagement,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(0, 3, 1.5),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  flex: '1 1',
  maxHeight: 400,
  alignItems: 'flex-start',
}));

const GridColumnsManagementHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementHeader',
  overridesResolver: (_, styles) => styles.columnsManagementHeader,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
}));

const GridColumnsManagementFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnsManagementFooter',
  overridesResolver: (_, styles) => styles.columnsManagementFooter,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(0.5, 1, 0.5, 3),
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const GridColumnsManagementEmptyText = styled('div')<{ ownerState: OwnerState }>(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  color: theme.palette.grey[500],
}));

export { GridColumnsManagement };
