import { Box, Typography, useTheme, Theme, Tooltip } from '@mui/material';
import { Share, Upload, Campaign } from '@mui/icons-material';
import store from 'store';
import { useState } from 'react';
// import { exportToPDF } from '3_widgets/taskPlanner/lib';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { useExportToPdf } from '3_widgets/taskPlanner/lib/useExportToPdf';
import { getStateUrl, stateApi, useTranslate } from '6_shared';
import CachedIcon from '@mui/icons-material/Cached';
import { ChartShareToolsStyled } from './ChartShareTools.styled';

const customButtonSx = (theme: Theme) => ({
  borderRadius: '10px',
  border: `1px solid ${theme.palette.neutralVariant.outline}`,
  width: '37px',
  height: '37px',
  minWidth: 0,
  padding: '8px',
});

interface IProps {
  ganttChartRef: React.MutableRefObject<HTMLDivElement | null>;

  refetchTasks?: () => void;
  isTaskRefetching?: boolean;
}

export const ChartShareTools = ({ ganttChartRef, isTaskRefetching, refetchTasks }: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const buttonSx = customButtonSx(theme);

  const [loading, setLoading] = useState(false);

  const [postState, { isLoading: isLoadingPostState }] = stateApi.usePostStateMutation();

  const { exportToPdfFn } = useExportToPdf({ ganttChartRef });

  const handleExportPdf = async () => {
    setLoading(true);

    exportToPdfFn();
    setLoading(false);
  };

  const onGenerateLink = async (linkExpires: number) => {
    const state = store.getState();
    const url = await getStateUrl(state, postState, linkExpires);
    if (url) {
      navigator.clipboard.writeText(url);
      enqueueSnackbar(translate('Application state link created successfully'), {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(translate('Error creating link'), { variant: 'error' });
    }
  };

  const playBeep = () => {
    try {
      const audio = new Audio('/sound/notification_sound.mp3'); // Путь относительно корня сборки
      audio.play();
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error);
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, context.currentTime);

      oscillator.connect(context.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 300);
    }
  };

  return (
    <ChartShareToolsStyled>
      <Typography variant="h1">Planning</Typography>
      <Box component="div" sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <Tooltip title="Beep" arrow placement="bottom">
          <LoadingButton sx={buttonSx} onClick={() => playBeep()}>
            <Campaign fontSize="small" sx={{ fill: theme.palette.text.primary }} />
          </LoadingButton>
        </Tooltip>

        <Tooltip title="Share" arrow placement="bottom">
          <LoadingButton
            loading={isLoadingPostState}
            sx={buttonSx}
            onClick={() => onGenerateLink(10)}
          >
            <Share fontSize="small" sx={{ fill: theme.palette.text.primary }} />
          </LoadingButton>
        </Tooltip>

        <Tooltip title="Export to PDF" arrow placement="bottom">
          <LoadingButton loading={loading} sx={buttonSx} onClick={handleExportPdf}>
            <Upload fontSize="small" sx={{ fill: theme.palette.text.primary }} />
          </LoadingButton>
        </Tooltip>

        <LoadingButton loading={isTaskRefetching} sx={buttonSx} onClick={refetchTasks}>
          <CachedIcon />
        </LoadingButton>
      </Box>
    </ChartShareToolsStyled>
  );
};
