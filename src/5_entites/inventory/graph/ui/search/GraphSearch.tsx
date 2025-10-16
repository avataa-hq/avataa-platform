import { SyntheticEvent, useMemo, useState } from 'react';
import { AutocompleteProps, SxProps, Theme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import ClearIcon from '@mui/icons-material/Clear';

import { graphSearchApi } from '6_shared/api/graph/search';
import { AnalysisNode, GraphNodeObjectType, getErrorMessage, useDebounceValue } from '6_shared';

import { GraphSearchInput } from './GraphSearchInput';
import { GraphSearchOption } from './GraphSearchOption';
import { GraphSearchAutocomplete } from './GraphSearch.styled';

const { useSearchNodeQuery, useLazyGetNodeHierarchyQuery } = graphSearchApi;

interface GraphSearchProps {
  graphKey: string;
  onChange: (nodeHierarchy: AnalysisNode[]) => void;
  label?: string;
  slotPropsSx?: SxProps<Theme>;
  setNodeKeyB?: (key: string) => void;
}

type PopulatedSearchOption = AnalysisNode & { tmo: GraphNodeObjectType };

const listboxProps: AutocompleteProps<
  PopulatedSearchOption,
  false,
  false,
  false,
  'div'
>['ListboxProps'] = {
  sx: {
    width: '100%',
    '& ul': {
      padding: 0,
    },
    '& .MuiAutocomplete-option': {
      justifyContent: 'space-between',
    },
  },
};

const slotProps: AutocompleteProps<PopulatedSearchOption, false, false, false, 'div'>['slotProps'] =
  {
    paper: {
      sx: {
        transform: 'translateX(-100px)',
        minWidth: 300,
      },
    },
  };

export const GraphSearch = ({
  graphKey,
  onChange,
  label,
  slotPropsSx = {},
  setNodeKeyB,
}: GraphSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<PopulatedSearchOption | null>(null);
  const debouncedValue = useDebounceValue(searchQuery, 500);

  const [getNodeHierarchy, { isFetching: isNodeHierarchyFetching }] =
    useLazyGetNodeHierarchyQuery();
  const { data, isFetching: isSearchFetching } = useSearchNodeQuery(
    { query: debouncedValue, graphKey },
    { skip: !debouncedValue?.trim().length || debouncedValue.length < 3 },
  );

  const handleNodeSelect = async (
    event: SyntheticEvent<Element, Event>,
    newValue: PopulatedSearchOption | null,
  ) => {
    if (newValue) {
      try {
        setSelectedNode(newValue);
        setNodeKeyB?.(newValue.key);

        const nodeHierarchy = await getNodeHierarchy({
          graphKey,
          nodeKey: newValue.key,
        }).unwrap();
        onChange(nodeHierarchy);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      }
    }
  };

  const populatedOptions = useMemo(() => {
    const tmoMap =
      data?.tmo.reduce((acc, tmo) => {
        acc[tmo.tmo_id] = tmo;
        return acc;
      }, {} as Record<string, GraphNodeObjectType>) ?? {};

    return (data?.nodes.map(({ tmo: nodeTmoId, ...node }) => {
      const tmo = tmoMap[nodeTmoId];
      return {
        ...node,
        tmo,
      };
    }) ?? []) as PopulatedSearchOption[];
  }, [data?.nodes, data?.tmo]);

  return (
    <GraphSearchAutocomplete
      value={selectedNode}
      onChange={handleNodeSelect}
      onInputChange={(event, newInputValue) => {
        if (newInputValue !== searchQuery) setSearchQuery(newInputValue);
      }}
      options={populatedOptions}
      renderInput={(params) => (
        <GraphSearchInput
          label={label}
          isLoading={isNodeHierarchyFetching || isSearchFetching}
          params={params}
        />
      )}
      popupIcon={false}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.key}
      ListboxProps={listboxProps}
      slotProps={{
        ...slotProps,
        paper: {
          ...(slotProps.paper || {}),
          sx: {
            ...(slotProps.paper?.sx ?? ({} as any)),
            ...slotPropsSx,
          },
        },
      }}
      renderOption={(props, option) => (
        <GraphSearchOption
          key={option.key}
          props={props}
          title={option.name}
          subtitle={option.tmo.name}
        />
      )}
      isOptionEqualToValue={(option, value) => option.key === value?.key}
      clearIcon={<ClearIcon onClick={() => setSelectedNode(null)} />}
    />
  );
};
