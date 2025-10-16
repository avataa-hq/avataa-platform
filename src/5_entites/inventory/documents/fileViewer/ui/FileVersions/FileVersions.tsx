import { useState } from 'react';
import { CircularProgress, Tooltip } from '@mui/material';
import { IFileVersion, useGetDocumentVersions } from '5_entites';
import { useTranslate } from '6_shared';
import * as SC from './FileVersions.styled';

interface IProps {
  isOpenFileVersion: boolean;
  setIsOpenFileVersion: (isOpen: boolean) => void;
  setFileVersions?: (versions: IFileVersion[]) => void;
  fileUrl: string;
}

export const FileVersions = ({
  isOpenFileVersion,
  fileUrl,
  setIsOpenFileVersion,
  setFileVersions,
}: IProps) => {
  const translate = useTranslate();
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const { getFileVersions } = useGetDocumentVersions();

  const onClickFileVersion = () => {
    if (!isOpenFileVersion) {
      getFileVersions(fileUrl).then((versions) => {
        setIsOpenFileVersion(true);
        setFileVersions?.(versions);
        setIsLoadingVersions(false);
      });
    }
    setIsOpenFileVersion(false);
  };

  return (
    <Tooltip title={translate('Version')}>
      <SC.LoadingButtonStyled
        loading={isLoadingVersions}
        onClick={onClickFileVersion}
        loadingIndicator={<CircularProgress color="primary" size={25} sx={{ marginLeft: '4px' }} />}
      >
        <SC.HistoryIconStyled />
      </SC.LoadingButtonStyled>
    </Tooltip>
  );
};
