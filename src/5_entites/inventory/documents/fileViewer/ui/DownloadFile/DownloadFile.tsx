import { useState } from 'react';
import { Box, CircularProgress, Tooltip, TooltipProps } from '@mui/material';
import { downloadDocument } from '5_entites';
import { useTranslate } from '6_shared';
import * as SC from './DownloadFile.styled';

interface IProps {
  fileSize: {
    amount: number;
    units: string;
  };
  fileUrl: string;
  fileName: string;
  tooltipWithFileName?: boolean;
  disabled?: boolean;
  tooltipPlacement?: TooltipProps['placement'];
}

export const DownloadFile = ({
  fileUrl,
  fileName,
  fileSize,
  tooltipWithFileName = false,
  disabled = false,
  tooltipPlacement,
}: IProps) => {
  const translate = useTranslate();
  const [isFetchingFile, setIsFetchingFile] = useState(false);
  const [isError, setIsError] = useState(false);

  const onDownloadFile = async (newFileName: string, newFileUrl: string) => {
    try {
      setIsError(false);
      setIsFetchingFile(true);
      await downloadDocument(newFileUrl, newFileName);
      setIsFetchingFile(false);
    } catch (error) {
      setIsFetchingFile(false);
      setIsError(true);
    }
  };

  return (
    <Tooltip
      title={`${tooltipWithFileName ? fileName : translate('Download')} ${fileSize.amount}${
        fileSize.units
      }`}
      placement={tooltipPlacement}
    >
      <Box component="div">
        <SC.LoadingButtonStyled
          color={isError ? 'error' : 'secondary'}
          loading={isFetchingFile}
          loadingIndicator={
            <CircularProgress color="primary" size={25} sx={{ marginLeft: '4px' }} />
          }
          onClick={() => onDownloadFile(fileName, fileUrl)}
          disabled={disabled}
        >
          <SC.DownloadIconStyled />
        </SC.LoadingButtonStyled>
      </Box>
    </Tooltip>
  );
};
