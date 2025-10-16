import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useState } from 'react';
import { Box, IProcessGroupModel } from '6_shared';
import { Typography } from '@mui/material';

const EMPTY_GROUP_ERROR_MESSAGE = 'At least one group must be selected';

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupList?: IProcessGroupModel[];
  isLoadingGroupList?: boolean;
  isLoadingAddElements?: boolean;
  onAddClick?: (group: IProcessGroupModel) => Promise<void>;
  selectedElementsCount?: number;
  totalGroups: number | null;
  setNewOffset: React.Dispatch<React.SetStateAction<number>>;
}

export const AddElementsToGroup = ({
  setIsOpen,
  isOpen,
  groupList,
  isLoadingGroupList,
  isLoadingAddElements,
  onAddClick,
  selectedElementsCount,
  totalGroups,
  setNewOffset,
}: IProps) => {
  const [value, setValue] = useState<IProcessGroupModel | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clearStates = () => {
    setValue(null);
    setIsError(false);
    setErrorMessage('');
    setIsOpen(false);
  };

  const handleClose = () => {
    clearStates();
  };

  const onChange = (newValue: any | null) => {
    if (newValue != null) setIsError(false);
    setValue(newValue);
  };

  const onAdd = async () => {
    // validation
    if (value == null) {
      setIsError(true);
      setErrorMessage(EMPTY_GROUP_ERROR_MESSAGE);
      return;
    }

    // call function from props
    await onAddClick?.(value);

    // clear
    clearStates();
  };

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const target = event.target as HTMLUListElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight === scrollHeight) {
        setNewOffset((prev) => prev + 50);
      }
    },
    [setNewOffset],
  );

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pt: 3, pr: 3, pl: 3 }}
        >
          <Typography variant="h2">Add To Group</Typography>
          {selectedElementsCount === 0 && (
            <Typography color="error" variant="body2">
              You need to select at least one element
            </Typography>
          )}
          {selectedElementsCount !== 0 && (
            <Typography variant="body2">
              Selected item count <b>{selectedElementsCount}</b>
            </Typography>
          )}
        </Box>

        <DialogContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body1">
              You must select the group to which the element(s) will be added
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" width="100%" mt={2}>
            <FormControl error={isError} fullWidth>
              <FormLabel color="primary" sx={{ mb: 1 }}>
                Select Group
              </FormLabel>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                options={groupList || []}
                getOptionLabel={(opt) => opt.group_name}
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                loading={isLoadingGroupList}
                ListboxProps={{
                  onScroll: totalGroups !== null && totalGroups >= 50 ? handleScroll : undefined,
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingGroupList ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {isError && <FormHelperText sx={{ mb: 0.5 }}>{errorMessage}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!selectedElementsCount || value === null}
            variant={isLoadingAddElements ? 'text' : 'contained'}
            onClick={onAdd}
          >
            {isLoadingAddElements ? <CircularProgress size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
