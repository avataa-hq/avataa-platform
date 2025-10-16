import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, IconButton } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ChevronRight, DeleteRounded, EditRounded, ExpandMore } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

import {
  Tag,
  dataflowGroupsApi,
  ItemTreeListItem,
  dataviewGroupsApi,
  ActionTypes,
  ErrorPage,
  useTranslate,
  getErrorMessage,
  LoadingAvataa,
} from '6_shared';
import { FileConData, Source } from '6_shared/api/dataflowV3/types';
import { Source as DataviewSource } from '6_shared/api/dataview/types';

const { useGetAllGroupsQuery, useLazyGetGroupSourcesQuery } = dataflowGroupsApi;
const { useLazyGetGroupSourcesQuery: useLazyGetDataviewGroupSourcesQuery } = dataviewGroupsApi;

type SourceType = 'Manual' | 'SFTP' | 'DB' | 'RestAPI';

export interface GroupedDataflowSourcesProps {
  searchValue?: string;
  onSourceClick: (source: Source, dataviewSourceId: number) => void;
  onEditSourceClick: (source: Source, sourceType: SourceType) => void;
  onDeleteSourceClick: (source: Source) => void;
  permissions?: Record<ActionTypes, boolean>;
}

export const GroupedDataflowSources = ({
  onSourceClick,
  onDeleteSourceClick,
  onEditSourceClick,
  searchValue,
  permissions,
}: GroupedDataflowSourcesProps) => {
  const translate = useTranslate();

  const [activeSource, setActiveSource] = useState<Source>();
  const [data, setData] = useState<Record<number, Source[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dataviewSources = useRef<Record<number, DataviewSource>>({});

  // const { isSourceDeleted } = useDataflowPage();

  const {
    data: groups,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroupsQuery();
  const [getGroupSources] = useLazyGetGroupSourcesQuery();
  const [getDataviewGroupSources] = useLazyGetDataviewGroupSourcesQuery();

  useEffect(() => {
    const fetchSources = async () => {
      if (!groups) return;

      setIsLoading(isGroupsFetching);

      try {
        const results = await Promise.all(
          groups.map(async (group) => {
            const groupSources = await getGroupSources(group.id).unwrap();
            let dataviewGroupSources: DataviewSource[] = [];

            if (groupSources?.length !== 0) {
              dataviewGroupSources = await getDataviewGroupSources(group.id).unwrap();
            }

            if (dataviewGroupSources) {
              dataviewSources.current = dataviewGroupSources.reduce((acc, source) => {
                return {
                  ...acc,
                  [source.source_id]: source,
                };
              }, dataviewSources.current);
            }

            const filteredGroupSources = searchValue?.trim()?.length
              ? groupSources.filter((source) =>
                  source.name.toLowerCase().includes(searchValue.toLowerCase()),
                )
              : groupSources;

            return { groupId: group.id, sources: filteredGroupSources };
          }),
        );

        const newData: Record<number, Source[]> = {};
        results.forEach(({ groupId, sources }) => {
          newData[groupId] = sources;
        });
        setData(newData);
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      } finally {
        setIsLoading(isGroupsFetching);
      }
    };

    fetchSources();
  }, [getDataviewGroupSources, getGroupSources, groups, isGroupsFetching, searchValue]);

  // useEffect(() => {
  //   if (!groups) return;

  //   groups.forEach(async (group) => {
  //     try {
  //       const groupSources = await getGroupSources(group.id).unwrap();
  //       let dataviewGroupSources: DataviewSource[] = [];

  //       if (groupSources?.length !== 0) {
  //         dataviewGroupSources = await getDataviewGroupSources(group.id).unwrap();
  //       }

  //       if (dataviewGroupSources) {
  //         dataviewSources.current = dataviewGroupSources.reduce((accumulator, source) => {
  //           return {
  //             ...accumulator,
  //             [source.source_id]: source,
  //           };
  //         }, dataviewSources.current);
  //       }

  //       const filteredGroupSources = searchValue?.trim()?.length
  //         ? groupSources?.filter((source) =>
  //             source.name.toLowerCase().includes(searchValue.toLowerCase()),
  //           )
  //         : groupSources;

  //       if (groupSources) setData((prev) => ({ ...prev, [group.id]: filteredGroupSources }));
  //     } catch (error) {
  //       enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  //     }
  //   });
  // }, [getDataviewGroupSources, getGroupSources, groups, searchValue, isSourceDeleted]);

  const getSourceIcon = useCallback((item: Source) => {
    let tagLabel = 'DB';

    switch (item.con_type) {
      case 'RestAPI':
        tagLabel = 'API';
        break;
      case 'File': {
        const fileExtensionRegex = /\.[0-9a-z]+$/i;
        const extensionMatch = (item as Source<FileConData>)?.con_data?.file?.file_name?.match(
          fileExtensionRegex,
        );
        tagLabel = extensionMatch?.[0]?.slice(1).toUpperCase() ?? 'File';
        break;
      }
      default:
        break;
    }

    return <Tag color="primary" label={tagLabel} />;
  }, []);

  const getItemActions = useCallback(
    (source: Source) => (
      <>
        <IconButton
          disabled={!(permissions?.update ?? true)}
          style={{ padding: 0 }}
          onClick={() => {
            const sourceType =
              source.con_type === 'File'
                ? (source as Source<FileConData>).con_data.import_type
                : source.con_type;
            onEditSourceClick(source, sourceType as SourceType);
          }}
          data-testid={source.name?.startsWith('at_') ? `${source.name}_edit-btn` : undefined}
        >
          <EditRounded />
        </IconButton>
        <IconButton
          disabled={!(permissions?.update ?? true)}
          style={{ padding: 0 }}
          onClick={() => {
            onDeleteSourceClick(source);
          }}
          data-testid={source.name?.startsWith('at_') ? `${source.name}_delete-btn` : undefined}
        >
          <DeleteRounded />
        </IconButton>
      </>
    ),
    [permissions?.update, onEditSourceClick, onDeleteSourceClick],
  );

  const handleSourceClick = (source: Source) => {
    const dataviewSourceId = dataviewSources.current[source.id]?.id;
    setActiveSource(source);
    onSourceClick(source, dataviewSourceId);
  };

  return (
    <Box component="div" height="100%" overflow="auto">
      {isLoading && !isGroupsError && (
        <Box
          component="div"
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoadingAvataa />
        </Box>
      )}
      {!isLoading && isGroupsError && (
        <ErrorPage
          error={{ message: translate('An error has occurred, please try again'), code: '404' }}
        />
      )}
      {!isLoading && !isGroupsError && (
        <SimpleTreeView
          aria-label="controlled"
          slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
        >
          {groups?.map((group) => (
            <TreeItem
              key={group.id}
              itemId={group.id.toString()}
              label={group.name}
              ContentProps={{
                style: {
                  padding: '5px 10px',
                },
              }}
              sx={{
                '.MuiTreeItem-group': {
                  marginLeft: 0,
                },
              }}
            >
              {data?.[group.id]?.map((source) => (
                <ItemTreeListItem
                  key={source.id}
                  name={source.name}
                  onClick={() => handleSourceClick(source)}
                  icon={getSourceIcon(source)}
                  actions={getItemActions(source)}
                  selected={source.id === activeSource?.id}
                />
              ))}
            </TreeItem>
          ))}
        </SimpleTreeView>
      )}
    </Box>
  );
};
