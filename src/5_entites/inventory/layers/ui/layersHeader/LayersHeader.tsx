import { Box, IconButton } from '@mui/material';
import { Close, Search, ArrowBack } from '@mui/icons-material';
import { InputWithIcon, useLayersSlice } from '6_shared';

interface IProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const LayersHeader = ({ searchQuery, setSearchQuery }: IProps) => {
  const { foldersSequence, setFoldersSequence } = useLayersSlice();

  const onBackClick = () => {
    setFoldersSequence(foldersSequence.slice(0, foldersSequence.length - 1));
  };

  return (
    <Box
      component="div"
      sx={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}
    >
      <IconButton onClick={onBackClick} disabled={foldersSequence.length === 0}>
        <ArrowBack />
      </IconButton>
      <InputWithIcon
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.trim())}
        iconPosition="right"
        icon={searchQuery !== '' ? <Close fontSize="small" /> : <Search fontSize="small" />}
        onIconClick={() => setSearchQuery('')}
      />
    </Box>
  );
};
