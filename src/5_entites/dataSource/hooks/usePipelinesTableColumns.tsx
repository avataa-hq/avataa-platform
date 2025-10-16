import { IconButton, Box } from '@mui/material';
import { AccessTimeFilledRounded, HistoryRounded, InfoRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import { TableColumn, Tag, ThemeColors, useTranslate } from '6_shared';
import { Pipeline } from '6_shared/api/dataview/types';
import { GetPipelinesTableColumnsProps } from '../model';
import { parseCronExpression } from '../lib';

const statusColors: Record<string, ThemeColors> = {
  new: 'primary',
  updated: 'success',
  warning: 'warning',
  off: 'info',
  error: 'error',
  running: 'success',
  draft: 'info',
  'creation error': 'error',
};

type StatusColor = keyof typeof statusColors;

export const usePipelinesTableColumns = ({
  onInfoClick,
  onHistoryClick,
  selectedTags,
  handlePipelineTagClick,
  permissions,
}: GetPipelinesTableColumnsProps): TableColumn<Pipeline>[] => {
  const translate = useTranslate();

  return [
    {
      dataIndex: 'name',
      key: 'name',
      title: translate('Name'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: translate('Status'),
      render: (item) => (
        <Box component="div" sx={{ width: 'max-content', maxWidth: '150px' }}>
          <Tag label={item.status} color={statusColors[item.status as StatusColor]} />
        </Box>
      ),
    },
    {
      dataIndex: 'last_run',
      key: 'last_run',
      title: translate('Last run'),
      render: (item) =>
        item.last_run ? dayjs(item.last_run).format('DD.MM.YYYY[,] HH:MM:ss') : '-',
    },
    {
      dataIndex: 'schedule',
      key: 'schedule',
      title: translate('Schedule'),
      render: (item) => {
        const parsedInterval = parseCronExpression(item.schedule);
        return (
          <Box component="div" sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {parsedInterval && <AccessTimeFilledRounded />}
            {parsedInterval ?? '-'}
          </Box>
        );
      },
    },
    {
      dataIndex: 'tags',
      key: 'tags',
      title: translate('Tags'),
      render: (item) => {
        return (
          <Box
            component="div"
            sx={{
              display: 'flex',
              gap: '0.35rem',
              alignItems: 'center',
              maxWidth: '170px',
              flexWrap: 'wrap',
            }}
          >
            {item.tags?.length !== 0 &&
              item.tags.map((tag, i) => (
                <Tag
                  key={i}
                  label={tag}
                  color={statusColors.new}
                  selected={selectedTags?.[tag] ?? false}
                  clickable
                  onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePipelineTagClick(tag);
                  }}
                />
              ))}
            {item.tags?.length === 0 && '-'}
          </Box>
        );
      },
    },
    {
      key: 'actions',
      align: 'right',
      title: '',
      render: (item) => (
        <Box component="div" display="flex" gap="5px">
          <IconButton
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onInfoClick(item, e);
            }}
            disabled={!(permissions?.view ?? true)}
          >
            <InfoRounded />
          </IconButton>
          <IconButton
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onHistoryClick(item, e);
            }}
            disabled={!(permissions?.view ?? true)}
          >
            <HistoryRounded />
          </IconButton>
        </Box>
      ),
    },
  ];
};
