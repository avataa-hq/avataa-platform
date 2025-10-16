import { IconButton } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { InputWithIcon, useTranslate } from '6_shared';

interface IProps {
  sort: 'asc' | 'desc';
  setSort: (value: 'asc' | 'desc') => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export const FilterAndSort = ({ filterValue, setFilterValue, setSort, sort }: IProps) => {
  const translate = useTranslate();

  return (
    <div
      style={{
        width: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        borderRadius: 10,
        height: '100%',
        boxShadow: `10px 15px 10px -5px rgb(0 0 0 / 5%)`,
        padding: '0, 10px',
      }}
    >
      <InputWithIcon
        fullWidth
        icon={null}
        style={{ height: '20px' }}
        placeholder={translate('Filter')}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <IconButton
        color="inherit"
        size="small"
        onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
      >
        <SwapVertIcon color="primary" />
      </IconButton>
    </div>
  );
};
